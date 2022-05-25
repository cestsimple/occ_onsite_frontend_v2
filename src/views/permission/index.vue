<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理 Permission</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标签页 -->
      <!-- 标签页 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="1">
          <role-info />
        </el-tab-pane>
        <el-tab-pane label="访问权和操作权" name="2">
          <permission-info />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import PermissionInfo from './permission-info'
import RoleInfo from './role-info'
export default {
  components: { PermissionInfo, RoleInfo },
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
</style>
