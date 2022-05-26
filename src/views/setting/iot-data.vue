<template>
  <div>
    <el-card v-loading="loading">
      <el-row>
        <el-col :span="24">
          刷新数据： 抓取数据->抓取过去一天的所有数据，可以更新计算每日的报表
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          刷新气站信息: 从IOT抓取所有site,asset,variable,tag等数据，更新内容包括：IOT上新资产/变量会出现，IOT上删除的会被隐藏，已有资产会更新中文名，维修等字段
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'IOT_RECORD')" size="mini" @click="getRecord({})"> 抓取所有气站数据 </el-button>
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'IOT_ALL')" size="mini" @click="getIotAll">
            从IOT更新气站&资产&变量数据
          </el-button>
        </el-col>
      </el-row>
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
          <el-form-item label="选择日期范围" prop="time_list">
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
        {{ apsaRefresh.time_list }}
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getJobs } from '@/api/job'
import { getApsa } from '@/api/apsa'
import { getRecord, getIotAll } from '@/api/manuel'
import { Message } from 'element-ui'
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
      apsaFormRules: {}
    }
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
      try {
        this.loading = true
        await this.$confirm('刷新气站信息会花费较久时间，请确认继续')
        await getIotAll()
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
        Message.error('获取Job失败')
        this.loading = false
      }
    },
    // 搜索框内容
    async getSeatchItem(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getApsa({ 'name': query }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message.error('无法获取资产列表')
      })
      this.serchItemList = res
      this.loading = false
    },
    clearSelect() {
      this.apsaRefresh.apsa_list = []
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
