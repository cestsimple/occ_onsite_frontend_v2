<template>
  <div>
    <el-card v-loading="loading">
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="6">
          <el-select
            v-model="query.finish"
            size="mini"
            clearable
            placeholder="是否完成"
          >
            <el-option
              :key="2"
              label="所有"
              :value="null"
            />
            <el-option
              :key="1"
              label="未完成"
              :value="0"
            />
            <el-option
              :key="0"
              label="完成"
              :value="1"
            />
          </el-select>
        </el-col>
        <el-col :span="16">
          <el-select
            v-model="query.success"
            size="mini"
            clearable
            placeholder="是否成功"
          >
            <el-option
              :key="2"
              label="所有"
              :value="null"
            />
            <el-option
              :key="1"
              label="失败"
              :value="0"
            />
            <el-option
              :key="0"
              label="成功"
              :value="1"
            />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button size="mini" @click="getJobs">刷新</el-button>
        </el-col>
      </el-row>

      <!-- 表单区 -->
      <el-table border stripe size="mini" :data="jobList">
        <el-table-column type="index" label="#" width="45px" />
        <el-table-column label="任务名" prop="name" />
        <el-table-column label="状态" prop="result">
          <template slot-scope="scope">
            {{ scope.row.result === '' ? '进行中' : scope.row.result }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="start_time" width="130px" />
        <el-table-column label="结束时间" prop="finish_time" width="130px">
          <template slot-scope="scope">
            {{ scope.row.finish_time === null ? '未完成' : scope.row.finish_time }}
          </template>
        </el-table-column>
        <el-table-column label="请求用户" prop="user" width="110px" />
        <el-table-column label="请求参数" prop="params" />
        <el-table-column label="操作" width="65px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteJob(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getJobs, deleteJob } from '@/api/job'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      // 搜索参数
      query: {
        finish: null,
        success: null
      },
      // 搜索选项

      jobList: [],
      apsaRefresh: {
        apsa_list: []
      },
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
    // 任务
    async getJobs() {
      try {
        this.loading = true
        const res = await getJobs(this.query)
        this.jobList = res
        this.loading = false
      } catch (error) {
        Message.error('获取Job失败,请求超时,请稍后再试')
        this.loading = false
      }
    },
    async deleteJob(item) {
      try {
        await this.$confirm('当且仅当确认任务卡死或已完成时才可以删除，否则可能会造成数据冲突或损失!')
        this.loading = true
        await deleteJob(item.id)
        Message.info('Job删除成功，可以重新执行了')
        this.getJobs()
        this.loading = false
      } catch (error) {
        Message.error('删除Job失败')
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-row {
    margin: 10px 10px;
  }
</style>
