<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>配置管理 Settings</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 标签页 -->
      <el-card>
        <!-- 标签页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="抓取IOT数据" name="1">
            <iot-data />
          </el-tab-pane>
          <el-tab-pane label="手动报表计算" name="2">
            <onsite-calculate />
          </el-tab-pane>
          <el-tab-pane label="开发中。。。" name="4">开发中。。。</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import IotData from './iot-data'
import OnsiteCalculate from './onsite-calculate'
export default {
  components: { IotData, OnsiteCalculate },
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
