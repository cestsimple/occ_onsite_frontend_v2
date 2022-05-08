<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>配置管理 Settings</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-button type="primary" :disabled="jobList.some(x => x.name === 'IOT_RECORD')" @click="getRecord"> 抓取数据 </el-button>
        <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_FILLING')" @click="calculateFilling">
          计算filling
        </el-button>
        <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_DAILY')" @click="calculateDaily">
          计算daily和malfunction
        </el-button>
        <el-row>
          <el-col :span="2">
            进行中任务:
          </el-col>
          <el-col v-for="job in jobList" :key="job.id" :span="4">
            <el-tag>{{ job.name }}</el-tag>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <div class="block">
          <span class="demonstration">月</span>
          <el-date-picker
            v-model="value2"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
          />
        </div>
        {{ value2 }}
      </el-card>
    </div>
  </div>
</template>

<script>
import { getJobs } from '@/api/job'
import { getRecord, calculateFilling, calculateDaily } from '@/api/manuel'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      jobList: [],
      intervalJob: null,
      value2: ''
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
    async getRecord() {
      await getRecord().catch(() => {
        Message.error('刷新失败')
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
    },
    async calculateFilling() {
      await calculateFilling().catch(() => {
        Message.error('刷新失败')
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
    },
    async calculateDaily() {
      await calculateDaily().catch(() => {
        Message.error('刷新失败')
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
    },
    async getJobs() {
      const res = await getJobs().catch(() => {
        Message.error('获取Job失败')
      })
      this.jobList = res.res
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-row {
    margin: 10px 10px;
  }
</style>
