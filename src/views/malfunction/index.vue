<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>停机报表 Malfunction</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 内容 -->
      <el-card>

        <!-- 搜索框 -->
        <search-bar @queryChanged="queryChanged">
          <el-button slot="before" type="primary" size="mini" @click="goAddPage">新增</el-button>
        </search-bar>

        <!-- 表单区 -->
        <el-table
          v-loading="loading"
          :data="list"
          border
          stripe
          size="mini"
          :highlight-current-row="true"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand" size="mini">
                <el-form-item label="停机原因">
                  <el-tag>{{ scope.row.reason_main }}</el-tag>
                </el-form-item>
                <el-form-item label="具体原因-1">
                  <el-tag>{{ scope.row.reason_detail_1 }}</el-tag>
                </el-form-item>
                <el-form-item label="具体原因-2">
                  <el-tag>{{ scope.row.reason_detail_2 }}</el-tag>
                </el-form-item>
                <el-form-item label="过程组原因">
                  <el-tag>{{ scope.row.reason_l1 }}</el-tag>
                </el-form-item>
                <el-form-item label="设备原因">
                  <el-tag>{{ scope.row.reason_l2 }}</el-tag>
                </el-form-item>
                <el-form-item label="组件原因">
                  <el-tag>{{ scope.row.reason_l3 }}</el-tag>
                </el-form-item>
                <el-form-item label="部件原因">
                  <el-tag>{{ scope.row.reason_l4 }}</el-tag>
                </el-form-item>
                <el-form-item label="维修备注">
                  <el-tag>{{ scope.row.mt_comment }}</el-tag>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="35" />
          <el-table-column
            label="RTU Name"
            prop="rtu_name"
            width="160"
          />
          <el-table-column
            label="资产名"
            prop="asset_name"
            width="75"
          />
          <el-table-column
            label="开始时间"
            prop="t_start"
            width="125"
          />
          <el-table-column
            label="结束时间"
            prop="t_end"
            width="125"
          />
          <el-table-column
            label="停机次数"
            prop="stop_count"
            width="70"
          />
          <el-table-column
            label="停机时长"
            prop="stop_hour"
            width="70"
          />
          <el-table-column
            label="用液消耗"
            prop="stop_consumption"
            width="75"
          />
          <el-table-column
            label="标志位"
            prop="stop_label"
            width="75"
          />
          <el-table-column
            label="停机报警"
            prop="stop_alarm"
            width="120"
          />
          <el-table-column label="备注" prop="occ_comment" />
          <el-table-column label="操作" :width="buttonColWidth" fixed="right">
            <template slot-scope="scope">
              <!-- OCC修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editMalfunctionOcc(scope.row)"
              />
              <!-- Maint修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="editMalfunctionMaint(scope.row)"
              />
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteMalfunction(scope.row)"
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
    <!-- 编辑，新增弹层 -->
    <add-malfunction :show-dialog.sync="showAddDialog" />
    <edit-occ ref="editOcc" :show-dialog.sync="showEditOcc" />
    <edit-maint ref="editMaint" :show-dialog.sync="showEditMaint" />
  </div>
</template>

<script>
import { getMalfunction, deleteMalfunction } from '@/api/malfunction'
import { Message } from 'element-ui'
import AddMalfunction from './add-malfunction'
import EditOcc from './edit-occ'
import EditMaint from './edit-maint'
export default {
  components: { AddMalfunction, EditOcc, EditMaint },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        pagesize: 10,
        name: '',
        start: '',
        end: ''
      },
      loading: false,
      showAddDialog: false,
      showEditOcc: false,
      showEditMaint: false,
      buttonColWidth: '180px'
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
      this.getMalfunction()
    },
    // 新增按钮
    goAddPage() {
      this.showAddDialog = true
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getMalfunction()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getMalfunction()
    },
    // Malfunction方法
    async getMalfunction() {
      this.loading = true
      try {
        const res = await getMalfunction(this.query)
        this.list = res.list
        this.total = res.total
      } catch (error) {
        Message.error('获取停机列表失败')
      }
      this.loading = false
    },
    async deleteMalfunction(item) {
      try {
        await this.$confirm('确定删除该记录')
        await deleteMalfunction(item.id)
        Message.success('删除成功')
        this.getMalfunction()
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    editMalfunctionOcc(item) {
      this.$refs.editOcc.getData(item)
      this.showEditOcc = true
    },
    editMalfunctionMaint(item) {
      this.$refs.editMaint.getData(item)
      this.showEditMaint = true
    }
  }
}
</script>

<style scoped>
  /deep/.demo-table-expand {
      width: 80%;
      font-size: 0px;
  }
  /deep/.demo-table-expand label {
    width: 85px;
    color: #99a9bf;
  }
  /deep/.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    height: 32px;
  }
</style>
