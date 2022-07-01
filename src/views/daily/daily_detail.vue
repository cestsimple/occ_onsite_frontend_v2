<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/daily/' }">日报浏览 Daily View</el-breadcrumb-item>
        <el-breadcrumb-item>详情编辑 Detail</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 内容 -->
      <el-card>
        <!-- 搜索框 -->
        <search-bar @queryChanged="queryChanged">
          <el-button slot="before" size="mini" type="primary" @click="exportData">导出Excel</el-button>
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
            label="Date"
            prop="date"
            width="85"
            sortable
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="Region"
            prop="region"
            width="80"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="RTU"
            prop="rtu_name"
            :show-overflow-tooltip="true"
            :min-width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.mark.includes('noflowmeter')">
                <el-tooltip content="无流量计" placement="left">
                  <div :style="{'color': 'blue'}">{{ scope.row.rtu_name }}</div>
                </el-tooltip>
              </div>
              <div v-else>{{ scope.row.rtu_name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="Series"
            prop="series"
            width="58"
            align="right"
          />
          <el-table-column
            label="Nornimal"
            prop="norminal"
            width="75"
            align="right"
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
            label="H Prod"
            prop="h_prod"
            width="67"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.h_prod | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="H Missing"
            prop="h_missing"
            width="80"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.h_missing | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Generator Prod"
            prop="m3_prod"
            width="110"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.m3_prod | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Ave Prod"
            prop="avg_prod"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.avg_prod | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Cust Consume"
            prop="cus_consume"
            width="106"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.cus_consume | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Ave Consume"
            prop="avg_consume"
            width="102"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.avg_consume | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column label="Peak" prop="peak" width="73" align="right">
            <template slot-scope="scope">
              {{ scope.row.peak | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Vpeak"
            prop="v_peak"
            width="73"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.v_peak | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="lin_tot"
            prop="lin_tot"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.lin_tot | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Cooling"
            prop="cooling"
            width="66"
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
            label="H Stop"
            prop="h_stop"
            width="65"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.h_stop | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Lin Consume"
            prop="lin_consume"
            width="97"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.lin_consume | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="Filling"
            prop="filling"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              {{ scope.row.filling | twoDigits }}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="comment"
            width="85"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" width="60" fixed="right">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-badge
                :value="scope.row.comment ? 1 : 0"
                is-dot
                :hidden="scope.row.comment ? false : true"
                class="item"
              >
                <el-button
                  :type="scope.row.confirm ? 'success' : scope.row.success ? 'primary' : 'danger'"
                  icon="el-icon-edit"
                  size="mini"
                  :plain="scope.row.confirm ? true : false"
                  round
                  @click="showEditDaily(scope.row)"
                />
              </el-badge>
            </template>
          </el-table-column>
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
    <!-- 放置组件弹层 -->
    <edit-daily ref="editDaily" :show-dialog.sync="showEditDialog" />
  </div>
</template>

<script>
import { getDaily } from '@/api/daily'
import EditDaily from './edit-daily'
import { Message } from 'element-ui'
export default {
  components: { EditDaily },
  filters: {
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
        region: ''
      },
      loading: false,
      showEditDialog: false
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
    },
    // 弹层控制
    async showEditDaily(item) {
      await this.$refs.editDaily.getData(item)
      this.showEditDialog = true
    },
    // 导出数据
    exportData() {
      // 验证有无数据
      if (this.total === 0) {
        return Message.error('请先刷新数据后再下载')
      }
      // 定义表头对应json key
      const headers = {
        'date': 'date',
        'region': 'region',
        'rtu_name': 'rtu_name',
        'series': 'series',
        'norminal': 'norminal',
        'h prod': 'h_prod',
        'h missing': 'h_missing',
        'generator production': 'm3_prod',
        'avege production': 'avg_prod',
        'customer consumption': 'cus_consume',
        'avege consumption': 'avg_consume',
        'peak': 'peak',
        'vpeak': 'v_peak',
        'lin tot': 'lin_tot',
        'cooling': 'cooling',
        'vpeak-peak': 'dif_peak',
        'h stop': 'h_stop',
        'lin_consume': 'lin_consume',
        'filling': 'filling',
        'comment': 'comment'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        const res = await getDaily({ ...this.query, pagesize: this.total, page: 1 })
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

<style scoped>
  ::v-deep .el-badge__content {
    top: 4px;
  }
</style>
