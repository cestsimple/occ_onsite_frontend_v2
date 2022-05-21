<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>充液报表 Filling</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 内容 -->
      <el-card>

        <!-- 搜索框 -->
        <search-bar @queryChanged="queryChanged">
          <el-button slot="before" type="primary" size="mini" @click="goAddPage">新增</el-button>
        </search-bar>

        <!-- 表单区 -->
        <el-table v-loading="loading" :data="list" border stripe size="mini" :highlight-current-row="true">
          <el-table-column type="index" label="#" width="40" />
          <el-table-column label="RTU Name" prop="rtu_name" />
          <el-table-column
            label="资产名"
            prop="asset_name"
            width="150"
          />
          <el-table-column
            label="储罐容积"
            prop="tank_size"
            width="75"
          />
          <el-table-column
            label="开始时间"
            prop="time_1"
            width="135"
          />
          <el-table-column
            label="结束时间"
            prop="time_2"
            width="135"
          />
          <el-table-column
            label="开始液位"
            prop="level_1"
            width="80"
          />
          <el-table-column
            label="结束液位"
            prop="level_2"
            width="80"
          />
          <el-table-column
            label="充液量(升L)"
            prop="quantity"
            width="100"
          />
          <el-table-column label="操作" width="173">
            <template slot-scope="scope">
              <!-- 确认按钮 -->
              <el-button
                :type="scope.row.confirm ? 'success' :''"
                icon="el-icon-check"
                size="mini"
                @click="confirmFilling(scope.row)"
              />
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditFilling(scope.row)"
              />
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteFilling(scope.row)"
              />
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
    <add-filling :show-dialog.sync="showAddDialog" />
    <edit-filling ref="editfilling" :show-dialog.sync="showEditDialog" />
  </div>
</template>

<script>
import { getFilling, deleteFilling, confirmFilling } from '@/api/filling'
import { Message } from 'element-ui'
import AddFilling from './add-filling'
import EditFilling from './edit-filling'
export default {
  components: { AddFilling, EditFilling },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        pagesize: 10,
        name: '',
        start: '',
        end: '',
        region: '',
        group: ''
      },
      loading: false,
      showAddDialog: false,
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
      this.query.region = query.region
      this.query.group = query.group
      this.query.page = 1
      this.getFilling()
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getFilling()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getFilling()
    },
    // Filling增删改查
    async getFilling() {
      this.loading = true
      const res = await getFilling(this.query)
      this.list = res.list
      this.total = res.total
      this.loading = false
    },
    async deleteFilling(item) {
      try {
        await this.$confirm('确定删除该记录')
        await deleteFilling(item.id)
        Message.success('删除成功')
        this.getFilling()
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    async confirmFilling(item) {
      if (item.confirm === 1) {
        return Message.warning('已确认记录只能修改或删除')
      }
      try {
        await this.$confirm('确定提交该记录')
        await confirmFilling(item)
        this.getFilling()
      } catch (error) {
        Message.error('提交失败：' + error)
      }
    },
    // 控制编辑弹层
    showEditFilling(item) {
      this.$refs.editfilling.getData(item)
      this.showEditDialog = true
    },
    // 新增按钮
    goAddPage() {
      this.showAddDialog = true
    }
  }
}
</script>

<style>

</style>
