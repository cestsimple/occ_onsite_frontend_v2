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
        <search-bar @queryChanged="queryChanged" />

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
            width="90"
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
          />
          <el-table-column
            label="Nornimal"
            prop="norminal"
            width="78"
          />
          <el-table-column
            label="H Prod"
            prop="h_prod"
            width="75"
          />
          <el-table-column
            label="H Missing"
            prop="h_missing"
            width="83"
          />
          <el-table-column
            label="Generator Prod"
            prop="m3_prod"
            width="115"
          />
          <el-table-column
            label="Ave Prod"
            prop="avg_prod"
            width="80"
          />
          <el-table-column
            label="Cust Consume"
            prop="cus_consume"
            width="110"
          />
          <el-table-column
            label="Ave Consume"
            prop="avg_consume"
            width="105"
          />
          <el-table-column
            label="Vpeak"
            prop="v_peak"
            width="65"
          />
          <el-table-column label="Peak" prop="peak" width="70" />
          <el-table-column
            label="lin_tot"
            prop="lin_tot"
            width="70"
          />
          <el-table-column
            label="Cooling"
            prop="cooling"
            width="100"
            sortable
          />
          <el-table-column
            label="Vpeak-Peak"
            prop="dif_peak"
            width="92"
          />
          <el-table-column
            label="H Stop"
            prop="h_stop"
            width="65"
          />
          <el-table-column
            label="Lin Consume"
            prop="lin_consume"
            width="100"
          />
          <el-table-column
            label="Filling"
            prop="filling"
            width="70"
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
                  @click="editDaily(scope.row)"
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
    <edit-daily :show-dialog.sync="showEditDialog" :edit-item="editItem" />
  </div>
</template>

<script>
import { getDaily } from '@/api/daily'
import EditDaily from './edit-daily'
export default {
  components: { EditDaily },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        pagesize: 15,
        name: '',
        start: '',
        end: ''
      },
      loading: false,
      showEditDialog: false,
      editItem: null
    }
  },
  methods: {
    // 搜索框方法
    async queryChanged(query) {
      this.query.name = query.name
      this.query.start = query.start
      this.query.end = query.end
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
      const res = await getDaily(this.query)
      this.list = res.list
      this.total = res.total
      this.loading = false
    },
    editDaily(item) {
      this.editItem = item
      this.showEditDialog = true
    }
  }
}
</script>

<style>

</style>
