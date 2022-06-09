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
          <el-button slot="before" type="primary" size="mini" @click="goDetailPage">详情页</el-button>
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
          />
          <el-table-column
            label="合同量"
            prop="norminal"
            width="65"
            align="center"
          />
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
        this.$message.error('daily获取失败')
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
