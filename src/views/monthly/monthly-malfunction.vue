<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="5">
          <el-date-picker
            v-model="query.date"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            size="mini"
            :default-time="['00:00:00', '23:59:59']"
            :style="{'width': '260px'}"
          />
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="query.region"
            size="mini"
            clearable
            placeholder="请选择区域"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="query.name"
            placeholder="输入RTU名或气站中文名进行搜索"
            clearable
            size="mini"
            @keyup.enter.native="getItemList"
          />
        </el-col>
        <el-col :span="5">
          <el-button size="mini" type="primary" @click="getItemList">搜索</el-button>
        </el-col>
        <el-col :span="6">
          <el-button v-loading.fullscreen.lock="fullscreenLoading" size="mini" type="primary" @click="exportData">导出Excel</el-button>
        </el-col>
      </el-row>

      <!-- 报表区 -->
      <el-table v-loading="loading" :data="itemList" border stripe size="mini" empty-text="暂无数据，请添加条件后搜索">
        <el-table-column
          label="结束日期"
          prop="date"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="RTU Name" prop="rtu_name" width="150px" />
        <el-table-column
          label="统计项名称"
          prop="item"
        />
        <el-table-column
          label="数值"
          prop="value"
          width="150px"
        />
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        :current-page="query.page"
        :page-sizes="[10, 15, 20, 50, 100]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getMontlyMalfunction } from '@/api/monthly'
import { Message } from 'element-ui'
export default {
  filters: {
    twoDigits(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      total: 0,
      query: {
        page: 1,
        pagesize: 15,
        date: [],
        region: '',
        name: ''
      },
      itemList: [],
      regionOptions: [
        {
          value: '',
          label: '所有区域'
        },
        {
          value: 'ALEC_S_A',
          label: '华东A'
        },
        {
          value: 'ALEC_S_B',
          label: '华东B'
        },
        {
          value: 'ALJY',
          label: '江阴'
        },
        {
          value: 'ALYZ',
          label: '扬州'
        },
        {
          value: 'ALWH',
          label: '武汉'
        },
        {
          value: 'ALTJ',
          label: '天津'
        },
        {
          value: 'ALSD',
          label: '山东'
        },
        {
          value: 'ALCD',
          label: '成都'
        },
        {
          value: 'ALGD',
          label: '广东'
        }
      ],
      loading: false,
      fullscreenLoading: false
    }
  },
  watch: {
    'query.region': function() {
      this.query.page = 1
    },
    'query.name': function() {
      this.query.page = 1
    }
  },
  methods: {
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.query.page = 1
      this.getItemList()
    },
    // 监听 页码 变化的函数
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getItemList()
    },
    async getItemList() {
      if (this.query.date.length !== 2) {
        return Message.error('请选择日期')
      }
      this.loading = true
      const res = await getMontlyMalfunction(this.query).catch(() => {
        Message.error('获取数据失败')
        this.loading = false
        return
      })
      this.itemList = res.list
      this.total = res.total
      this.loading = false
    },
    exportData() {
      // 验证有无数据
      if (this.total === 0) {
        return Message.error('请先刷新数据后再下载')
      }
      // 定义表头对应json key
      const headers = {
        'RTU名': 'rtu_name',
        '统计项名称': 'item',
        '数值': 'value'
      }
      // 全屏显示loading画面
      this.fullscreenLoading = true
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        const res = await getMontlyMalfunction({ ...this.query, pagesize: this.total, page: 1 })
        // 转化Json数据至[[]]格式
        const data = this.formatJson(headers, res.list)
        // 导出
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: `停机月度汇总_${this.query.date}_${this.query.region === '' ? '全部区域' : this.query.region}`,
          bookType: 'xlsx'
        })
        // 关闭loading
        this.fullscreenLoading = false
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
  ::v-deep .el-row {
    margin-bottom: 15px;
  }
</style>
