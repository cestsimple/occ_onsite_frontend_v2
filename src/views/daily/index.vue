<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>日报浏览 Daily View</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容 -->
      <el-card>
        <!-- 搜索框 -->
        <search-bar @queryChanged="queryChanged">
          <el-button slot="before" type="primary" size="mini" :style="checkPermission('daily_detail')" @click="goDetailPage">详情页</el-button>
          <el-button slot="before" type="primary" size="mini" :style="checkPermission('daily_export')" @click="exportSimple">导出</el-button>
        </search-bar>

        <!-- 表单区 -->
        <el-table
          v-loading="loading"
          :data="list"
          border
          stripe
          size="mini"
          :highlight-current-row="true"
          :row-style="{ height: '33px' }"
          :cell-style="{ padding: '0px' }"
        >
          <el-table-column
            label="日期"
            prop="date"
            width="90"
            sortable
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="区域"
            prop="region"
            width="80"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="型号"
            prop="series"
            width="50"
          />
          <el-table-column
            label="RTU名称"
            prop="rtu_name"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.mark.includes('noflowmeter')">
                <el-tooltip content="无流量计" placement="top">
                  <div :style="{'color': 'blue'}">{{ scope.row.rtu_name }}</div>
                </el-tooltip>
              </div>
              <div v-else>{{ scope.row.rtu_name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="合同量"
            prop="norminal"
            width="65"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.mark.includes('hasextraflow')">
                <el-tooltip content="有额外用液" placement="top">
                  <div :style="{'color': 'blue'}">{{ scope.row.norminal }}</div>
                </el-tooltip>
              </div>
              <div v-else>{{ scope.row.norminal }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="平均产量"
            prop="avg_prod"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.avg_prod | toInt }}
            </template>
          </el-table-column>
          <el-table-column
            label="平均用量"
            prop="avg_consume"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.avg_consume | toInt }}
            </template>
          </el-table-column>
          <el-table-column
            label="Cooling"
            prop="cooling"
            width="90"
            sortable
            align="right"
          >
            <template slot-scope="scope">
              <div :style="scope.row.cooling > 5 || scope.row.cooling < 0? {'color': 'red'} : ''">{{ scope.row.cooling | twoDigits }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="Vpeak-Peak"
            prop="dif_peak"
            width="92"
            align="right"
          >
            <template slot-scope="scope">
              <div :style="scope.row.dif_peak < 0 ? {'color': 'red'} : ''">{{ scope.row.dif_peak | twoDigits }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="停机时长"
            prop="h_stop"
            width="70"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.h_stop | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="停机用液"
            prop="lin_consume"
            width="70"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.lin_consume | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="汽化器能力"
            prop="vap_max"
            width="85"
            align="center"
          >
            <template slot-scope="scope">
              <div :style="scope.row.avg_consume > scope.row.vap_max ? {'color': 'red'} : ''">{{ scope.row.vap_max }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="comment"
            width="85"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          :current-page="query.page"
          :page-sizes="[10, 15, 20, 50]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getDaily } from '@/api/daily'
export default {
  filters: {
    toInt(value) {
      return Math.round(value)
    },
    twoDigits(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        pagesize: 15,
        name: '',
        start: '',
        end: '',
        region: '',
        group: ''
      },
      loading: false
    }
  },
  methods: {
    // 搜索框方法
    async queryChanged(query) {
      this.query.name = query.name
      this.query.start = query.start
      this.query.end = query.end
      this.query.region = query.region
      this.query.group = query.group
      this.query.page = 1
      this.getDaily()
    },
    // 详细按钮
    goDetailPage() {
      this.$router.push('/daily/detail/')
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.query.page = 1
      this.getDaily()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getDaily()
    },
    // Daily增删改查
    async getDaily() {
      this.loading = true
      try {
        const res = await getDaily(this.query)
        this.list = res.list
        this.total = res.total
      } catch (error) {
        this.loading = false
        return this.$message.error('请求失败，可能网络不佳，请稍后重试')
      }
      this.loading = false
    },
    // 导出简单页报表
    exportSimple() {
      // 验证有无数据
      if (this.total === 0) {
        return Message.error('请先刷新数据后再下载')
      }
      // 定义表头对应json key
      const headers = {
        '日期': 'date',
        '区域': 'region',
        '型号': 'series',
        'RTU名称': 'rtu_name',
        '合同量': 'norminal',
        '平均产量': 'avg_prod',
        '平均用量': 'avg_consume',
        'Cooling': 'cooling',
        'Vpeak-Peak': 'dif_peak',
        '停机时长': 'h_stop',
        '停机用液': 'lin_consume',
        '汽化器能力': 'vap_max'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        let res = null
        try {
          res = await getDaily({ ...this.query, pagesize: this.total, page: 1 })
        } catch (error) {
          return this.$message.error('请求失败，可能网络不佳，请稍后重试')
        }
        // 转化Json数据至[[]]格式
        const data = this.formatJson(headers, res.list)
        // 导出
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: `日报表_${this.query.start}_${this.query.region === '' ? '全部区域' : this.query.region}`,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是对象
        return Object.keys(headers).map(key => {
          return item[headers[key]]
        })
      })
    }
  }
}
</script>

<style>
</style>
