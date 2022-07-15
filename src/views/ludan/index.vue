<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>路单信息 Settings</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标签页 -->
      <el-card>
        <!-- 标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="信息登记" name="1">
            信息登记
          </el-tab-pane>
          <el-tab-pane label="信息统计" name="2">
            信息统计
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
