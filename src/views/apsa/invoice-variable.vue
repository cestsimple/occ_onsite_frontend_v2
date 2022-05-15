<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/apsa' }">设备资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备资产Invoice变量管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card />

      <!-- 表格区 -->
      <el-table :data="itemList" border stripe size="mini">
        <el-table-column label="RTU名 (点击添加变量)" prop="rtu_name">
          <template slot-scope="scope">
            <a @click="showAdd(scope.row)">{{ scope.row.rtu_name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="变量名" prop="variable" />
        <el-table-column label="用途" prop="usage" />
        <el-table-column label="操作" width="65px" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteVariable(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        :current-page="querryInfo.page"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="querryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹层区 -->
    <el-dialog :title="`添加INVOICE计算变量 - ${addForm.rtu_name}`" :visible="showAddDialog" width="35%" @close="btnCancel">
      <el-form
        :model="addForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="RTU_NAME" prop="rtu_name">
          <el-input v-model="addForm.rtu_name" disabled />
        </el-form-item>
        <el-form-item label="IOT平台变量" prop="name">
          <el-select v-model="addForm.id" filterable clearable placeholder="从IOT变量中选择">
            <el-option
              v-for="item in variableList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="addVariable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceVariable, deleteInvoiceVariable, addInvoiceVariable } from '@/api/invoice-diff'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      total: 0,
      querryInfo: {
        region: '',
        page: 1,
        pagesize: 20,
        usage: 'invoice'
      },
      itemList: [],
      showAddDialog: false,
      addForm: {
        rtu_name: '',
        apsa: 0,
        variable: 10,
        usage: 'INVOICE'
      },
      variableList: []
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    handleSizeChange(newSize) {
      this.querryInfo.pagesize = newSize
      this.getItemList()
    },
    // 监听 页码 变化的函数
    handleCurrentChange(newPage) {
      this.querryInfo.page = newPage
      this.getItemList()
    },
    async getItemList() {
      const res = await getInvoiceVariable(this.querryInfo).catch(error => {
        console.log(error)
        this.$message.error('无法获取资产变量列表')
      })
      this.itemList = res.list
      this.total = res.total
    },
    showAdd(apsa) {
      console.log(apsa)
      this.addForm.apsa = apsa.apsa
      this.addForm.rtu_name = apsa.rtu_name
      this.showAddDialog = true
    },
    btnCancel() {
      this.showAddDialog = false
      this.addForm = {
        rtu_name: '',
        apsa: 0,
        variable: 0,
        usage: 'INVOICE'
      }
      this.variableList = []
    },
    async deleteVariable(item) {
      try {
        await this.$confirm('是否删除该变量')
        await deleteInvoiceVariable(item.id)
        Message.success('删除成功')
        this.getItemList()
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    async addVariable() {
      try {
        await addInvoiceVariable(this.addForm)
        Message.success('新增成功')
        this.getItemList()
        this.showAddDialog = false
      } catch (error) {
        Message.error('新增失败：' + error)
      }
    }
  }
}
</script>

<style scoped>

</style>
