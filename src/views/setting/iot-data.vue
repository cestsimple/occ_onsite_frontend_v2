<template>
  <div>
    <el-card v-loading="loading">
      <el-row>
        <el-col :span="2">
          进行中任务:
        </el-col>
        <div v-show="jobList.length !== 0">
          <el-col v-for="job in jobList" :key="job.id">
            <el-tag size="medium" type="danger">{{ job.name }}</el-tag>
          </el-col>
        </div>
        <div v-show="jobList.length === 0">
          <el-tag size="mini" type="info">暂无任务</el-tag>
        </div>
      </el-row>
    </el-card>
    <el-card v-loading="loading">
      <el-form
        ref="apsaFormRef"
        :model="apsaRefresh"
        :rules="apsaFormRules"
        label-width="160px"
        size="mini"
      >
        <el-form-item>
          <el-form-item label="部分刷新气站原始数据" prop="apsa_list">
            <el-select
              v-model="apsaRefresh.apsa_list"
              filterable
              remote
              multiple
              placeholder="输入气站中文或RTU名"
              :remote-method="getSeatchItem"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in serchItemList"
                :key="item.id"
                :label="item.site_name + '-' + item.asset_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围(跨度≤6个月)" prop="time_list">
            <el-date-picker
              v-model="apsaRefresh.time_list"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              :style="{'width': '260px'}"
            />
          </el-form-item>
        </el-form-item>
        <span class="dialog-footer">
          <el-button size="mini" @click="clearSelect">清空</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="getRecord({...apsaRefresh})"
          >提交请求</el-button>
        </span>
      </el-form>
    </el-card>
    <el-card v-loading="loading">
      <el-form
        :model="newAssetRequest"
        size="mini"
      >
        <el-form-item>
          <el-form-item label="手动刷新/添加资产(及其变量): 输入iot资产页面上方地址栏asset后类似a3c42fda-607f-49a9-bbcc-bc2ab8d542fb的id即可">
            <el-input v-model="newAssetRequest.uuid" />
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="newAssetRequest.is_apsa" label="1">Apsa资产</el-radio>
          <el-radio v-model="newAssetRequest.is_apsa" label="0">Bulk资产</el-radio>
        </el-form-item>
        <span class="dialog-footer">
          <el-button
            type="primary"
            size="mini"
            :disabled="jobList.some(x => x.name === 'IOT_ASSET_MANUEL')"
            @click="mauelAsset"
          >提交请求</el-button>
        </span>
      </el-form>
      <el-row>
        *刷新资产(及其变量)时,apsa/bulk选项会被忽略<br><br>
        *请求后去job记录页面查看抓取结果
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getJobs } from '@/api/job'
import { getApsa } from '@/api/apsa'
import { getRecord, getIotAll, manuelCreateAsset } from '@/api/manuel'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      jobList: [],
      apsaRefresh: {
        apsa_list: [],
        time_list: []
      },
      intervalJob: null,
      loading: false,
      serchItemList: [],
      apsaFormRules: {},
      newAssetRequest: {
        uuid: '',
        is_apsa: '1'
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getJobs()
    this.intervalJob = setInterval(this.getJobs, 10000)
  },
  beforeDestroy() {
    clearInterval(this.intervalJob)
  },
  methods: {
    async getRecord(params) {
      this.loading = true
      params.user = this.userInfo.username
      try {
        if (params === {}) {
          await this.$confirm('刷新全部数据耗时较长,请确认继续')
        }
        await getRecord(params)
        Message.success('请求成功，请等待完成')
        this.getJobs()
        this.apsaRefresh.apsa_list = []
        this.loading = false
      } catch (error) {
        Message.error('数据刷新请求失败')
        this.loading = false
      }
    },
    async getIotAll() {
      this.loading = true
      const params = {
        user: this.userInfo.username,
        params: 'refresh all'
      }
      try {
        await this.$confirm('刷新气站信息会花费较久时间，请确认继续')
        await getIotAll(params)
        Message.success('刷新成功，请等待完成')
        this.getJobs()
        this.loading = false
      } catch (error) {
        Message.error('刷新失败')
        this.loading = false
      }
    },
    // 任务
    async getJobs() {
      try {
        this.loading = true
        const res = await getJobs({ finish: 0 })
        this.jobList = res
        this.loading = false
      } catch (error) {
        Message.error('获取Job失败,请求超时,请稍后再试')
        this.loading = false
      }
    },
    // 搜索框内容
    async getSeatchItem(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getApsa({ 'name': query }).catch(() => {
        this.loading = false
        this.$message.error('无法获取资产列表')
      })
      this.serchItemList = res
      this.loading = false
    },
    clearSelect() {
      this.apsaRefresh.apsa_list = []
    },
    // 手动添加资产
    async mauelAsset() {
      if (this.newAssetRequest.uuid === '') {
        return Message.error('uuid不能为空')
      }
      try {
        this.newAssetRequest.user = this.userInfo.username
        const res = await manuelCreateAsset(this.newAssetRequest)
        if (res !== null) {
          this.newAssetRequest.uuid = ''
          return Message.success('请求成功, 可在job记录页查看详情')
        }
      } catch (error) {
        return Message.error('请求失败，与服务器连接失败')
      }
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-row {
    margin: 10px 10px;
  }
  ::v-deep div {
      font-size: small;
  }
  ::v-deep .el-row {
      height: 40px;
      margin-bottom: 10px;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0px !important;
  }
   ::v-deep .el-form-item__content .el-input__inner {
    width: 500px;
  }
</style>
