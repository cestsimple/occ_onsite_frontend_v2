<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理 Assets</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标签页 -->
      <!-- 标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="产气设备" name="1">
          <apsa />
        </el-tab-pane>
        <el-tab-pane label="储罐" name="2">
          <bulk />
        </el-tab-pane>
        <el-tab-pane label="月报变量" name="3">
          <invoice />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Apsa from './apsa'
import Bulk from './bulk'
import Invoice from './invoice-variable'
export default {
  components: { Apsa, Bulk, Invoice },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-row {
    margin: 10px 10px;
  }
  ::v-deep .el-card__body {
    padding-top: 5px;
  }
  .el-tabs__nav-scroll {
      font-size: 75%;
  }
</style>
