<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>月报表 Monthly</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <!-- 标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="充液汇总" name="1">
            <filling />
          </el-tab-pane>
          <el-tab-pane label="开票变量" name="2">
            <invoice-diff />
          </el-tab-pane>
          <el-tab-pane label="月报变量" name="3">
            <monthly-diff />
          </el-tab-pane>
          <el-tab-pane label="停机汇总" name="4">
            <monthly-malfunction />
          </el-tab-pane>
          <el-tab-pane label="数据生成" name="5">
            <calculate-request />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import Filling from './monthly-filling'
import InvoiceDiff from './monthly-invoice-diff'
import MonthlyDiff from './monthly-monthly-diff'
import MonthlyMalfunction from './monthly-malfunction'
import CalculateRequest from './calculate-request'
export default {
  components: { Filling, InvoiceDiff, MonthlyDiff, CalculateRequest, MonthlyMalfunction },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style>

</style>
