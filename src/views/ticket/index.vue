<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>项目任务管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="我的任务" name="1">
          <my-ticket />
        </el-tab-pane>
        <el-tab-pane label="申请新任务" name="2">
          <request-ticket />
        </el-tab-pane>
        <el-tab-pane label="项目任务管理" name="3">
          <manage-project />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyTicket from './my-ticket'
import RequestTicket from './request-ticket'
import ManageProject from './manage-project'
export default {
  components: { MyTicket, RequestTicket, ManageProject },
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
</style>
