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
          content: ['新增从设备Lin_tot可以自动计算lin_tot且会联动同步到主设备lin_tot Mod值;',
            '\n修复从IOT抓取变量时会因总数量不变造成更新失败的问题;',
            '\n调整月报变量页面展示内容;',
            '\n修复月报变量功能保存为中文而不是英文的问题;',
            '\n修复日报页面刷新会假死的问题;',
            '\n修复过滤条日期清空会报错的问题;'],
          timestamp: '2022-5-30'
        },
        {
          content: ['新增IOT刷新时间选择;',
            '\n调整页面布局及路由匹配;',
            '\n调整维修表关联隐藏;',
            '\n修复filling添加完不刷新页面的问题,修复月报变量登记不为英文的问题;'],
          timestamp: '2022-5-26'
        },
        {
          content: ['完成用户页面角色显示;',
            '\n修改malfunction提交原因为英文,表格调整;',
            '\n修改时间筛选至日期,新增malfunction原因过滤;',
            '\n新增用户角色页面及功能;',
            '\n完成权限管理页面,角色权限页面的功能;',
            '\n完成角色权限的增删改查功能,用户角色的相关表的关联删除;'],
          timestamp: '2022-5-25'
        },
        {
          content: ['新增用户角色api;',
            '\n新增停机confirm处理;',
            '\n修复filling更新lintot时根据site查找会找到多台apsa的问题;',
            '\n新增用户角色页面及功能;',
            '\n修改停机页面布局,标准化停机原因,修改所有弹层不可鼠标点击空白取消;',
            '\n修改searchbar默认HHmm设定,调整daily页面样式;',
            '\n修改malfunction页面表单验证规则;'],
          timestamp: '2022-5-24'
        },
        {
          content: ['增加record刷新多线程监控;',
            '\n调整Task执行逻辑和时间;'],
          timestamp: '2022-5-23'
        },
        {
          content: ['修复月报数据生成时间限制错误;',
            '\n修复因-0.05等微小负值导致无法计算lintot的问题;',
            '\n调整弹层为固定宽度;'],
          timestamp: '2022-5-21'
        },
        {
          content: ['新增数据部分刷新功能( 入口:后台操作->抓取IOT数据 );',
            '\nAPSA登记变量mark改为下拉选择;',
            '\n新增Job查看管理功能( 入口:后台操作->Job管理 );'],
          timestamp: '2022-5-20'
        },
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
