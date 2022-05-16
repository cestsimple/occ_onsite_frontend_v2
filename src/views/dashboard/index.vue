<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>信息展示</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="header">
          <span>欢迎登录OCC在线平台</span>
        </div>

        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
            size="normal"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activities: [
        {
          content: '新增用户页面，可以对用户进行增删改; apsa开票变量新增用途多选; 后台操作页面细化操作分类',
          timestamp: '2022-5-16'
        },
        {
          content: '新增Invoice变量页面和相应功能 (入口: APSA设置页面->左上角开票变量按钮)',
          timestamp: '2022-5-14'
        },
        {
          content: '迁移项目',
          timestamp: '2021-2022'
        }]
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
::v-deep .header {
  font-size: x-large;
  margin-bottom: 25px;
}
::v-deep .el-timeline {
  padding-left: 20px;
}
</style>
