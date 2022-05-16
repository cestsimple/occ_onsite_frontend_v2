<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="24">
          刷新所有数据执行顺序： 抓取数据 ==> 计算filling ==> 计算daily和malfunction
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_FILLING' || x.name === 'IOT_RECORD')" size="mini" @click="calculateFilling">
            计算filling
          </el-button>
          <el-button type="primary" :disabled="jobList.some(x => x.name === 'ONSITE_DAILY' || x.name === 'IOT_RECORD')" size="mini" @click="calculateDaily">
            计算daily和malfunction
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
import { calculateFilling, calculateDaily } from '@/api/manuel'
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
  ::v-deep div {
      font-size: small;
  }
  ::v-deep .el-row {
      height: 40px;
      margin-bottom: 10px;
  }
</style>
