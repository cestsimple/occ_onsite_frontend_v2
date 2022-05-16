<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <h2>欢迎登录IMOCC在线平台</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      reverse: true,
      activities: [{
        content: '新增APSA界面中Invoice变量页面和相应功能',
        timestamp: '2022-5-14'
      },
      {
        content: '移植已有功能，新增其他功能',
        timestamp: '2022-4-28'
      },
      {
        content: '新底层框架V2版上线',
        timestamp: '2022-4-27'
      },
      {
        content: 'OCC在线平台V1版部署',
        timestamp: '2022-4-02'
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
</style>
