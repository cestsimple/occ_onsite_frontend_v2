<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>配置管理 Settings</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-button type="primary" @click="getRecord"> 抓取数据 </el-button>
        <el-button type="primary" @click="calculateFilling">
          计算filling
        </el-button>
        <el-button type="primary" @click="calculateDaily">
          计算daily和malfunction
        </el-button>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getRecord, calculateFilling, calculateDaily } from '@/api/manuel'
export default {
  methods: {
    async getRecord() {
      await getRecord().catch(() => {
        this.$message.error('刷新失败')
      })
    },
    async calculateFilling() {
      await calculateFilling().catch(() => {
        this.$message.error('刷新失败')
      })
    },
    async calculateDaily() {
      await calculateDaily().catch(() => {
        this.$message.error('刷新失败')
      })
    }
  }
}
</script>

<style>

</style>
