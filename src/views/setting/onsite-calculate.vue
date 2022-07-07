<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="24">
          说明: 不选择日期时默认计算前一日报表
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_FILLING' || x.name === 'IOT_RECORD')" size="mini" @click="calculateFilling">
            计算filling
          </el-button>
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_DAILY' || x.name === 'IOT_RECORD' || x.name === 'ONSITE_FILLING')" size="mini" @click="calculateDaily">
            计算daily和malfunction
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-select
            v-model="apsa_list"
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-date-picker
            v-model="date_list"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="mini"
            :style="{'width': '260px'}"
          />
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

  </div>
</template>

<script>
import { getJobs } from '@/api/job'
import { getApsa } from '@/api/apsa'
import { calculateFilling, calculateDaily } from '@/api/manuel'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      jobList: [],
      intervalJob: null,
      value2: '',
      date_list: [],
      apsa_list: [],
      serchItemList: [],
      loading: false
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
    async calculateFilling() {
      await calculateFilling({ date_list: this.date_list, apsa_list: this.apsa_list }).catch(() => {
        Message.error('刷新失败')
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
    },
    async calculateDaily() {
      await calculateDaily({ date_list: this.date_list, apsa_list: this.apsa_list }).catch(() => {
        Message.error('刷新失败')
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
    },
    async getJobs() {
      const res = await getJobs({ finish: 0 }).catch(() => {
        Message.error('获取Job失败')
      })
      this.jobList = res
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
</style>
