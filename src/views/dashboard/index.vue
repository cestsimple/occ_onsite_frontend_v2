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
            <span :style="{'white-space': 'pre-line'}">
              {{ activity.content.join('') }}
            </span>
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
          content: ['修复malfunction信息登记功能若干bug,修复逻辑错误;',
            '\n新增malfunction,filling所有报表单提交详细数据验证;',
            '\n修复daily重跑后报错信息不清空,多个daily_bind会相互覆盖lintot的问题;',
            '\n修复daily,filling报表点击修改无法正确加载数据的问题;',
            '\n修改daily报表导出内容及顺序'],
          timestamp: '2022-5-19'
        },
        {
          content: ['新增日报，停机报表导出功能;\n新增设备管理表asset name字段以作区分;',
            '\n新增设备管理表可以隐藏不计入报表的资产;',
            '\n修复apsa设备登记相关bug(特殊计算绑定自己，常规计算有绑定值);'],
          timestamp: '2022-5-18'
        },
        {
          content: ['导入invoice变量配对;\n新增后台手动从IOT抓取并刷新信息;',
            '\n对抓取数据进行限时1h,超时取消任务,防止后续任务无法进行;'],
          timestamp: '2022-5-17'
        },
        {
          content: ['新增用户页面,可以对用户进行增删改;\napsa开票变量新增用途多选;\n后台操作页面细化操作分类;'],
          timestamp: '2022-5-16'
        },
        {
          content: ['新增Invoice变量页面和相应功能 (入口: APSA设置页面->左上角开票变量按钮)'],
          timestamp: '2022-5-14'
        },
        {
          content: ['迁移项目'],
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
::v-deep .el-timeline-item__content {
  font-size: 13px;
  line-height: 20px;
}
</style>
