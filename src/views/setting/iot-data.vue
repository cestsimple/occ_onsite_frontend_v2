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
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'IOT_RECORD')" size="mini" @click="getRecord"> 抓取数据 </el-button>
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'IOT_ALL')" size="mini" @click="getIotAll">
            刷新气站信息
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

  </div>
</template>

<script>
import { getJobs } from '@/api/job'
import { getRecord, getIotAll } from '@/api/manuel'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      jobList: [],
      intervalJob: null,
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
    async getRecord() {
      this.loading = true
      await getRecord().catch(() => {
        Message.error('刷新失败')
        this.loading = false
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
      this.loading = false
    },
    async getIotAll() {
      await this.$confirm('刷新气站信息会花费较久时间，请确认继续')
      this.loading = true
      await getIotAll().catch(() => {
        Message.error('刷新失败')
        this.loading = false
      })
      Message.success('刷新成功，请等待完成')
      this.getJobs()
      this.loading = false
    },
    async getJobs() {
      this.loading = true
      const res = await getJobs().catch(() => {
        Message.error('获取Job失败')
        this.loading = false
      })
      this.jobList = res.res
      this.loading = false
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
