<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/apsa' }">设备资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备资产Invoice变量管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <!-- 区域过滤 新增变量-->
        <el-row :gutter="20" :style="{'margin-bottom': '15px'}">
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="showAddNew">
              添加变量
            </el-button>
          </el-col>
          <el-col :span="22">
            <span>区域过滤：</span>
            <el-select v-model="querryInfo.region" placeholder="请选择" size="mini">
              <el-option
                v-for="item in regionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span :style="{'margin-left': '20px'}">用途过滤：</span>
            <el-select v-model="querryInfo.usage" placeholder="请选择" size="mini">
              <el-option
                v-for="item in usageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>

        <!-- 表格区 -->
        <el-table :data="itemList" border stripe size="mini">
          <el-table-column label="RTU名 (点击添加该气站变量)" prop="rtu_name">
            <template slot-scope="scope">
              <a @click="showAdd(scope.row)">{{ scope.row.rtu_name }}</a>
            </template>
          </el-table-column>
          <el-table-column label="变量名" prop="variable_name" />
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
          :page-sizes="[15, 20, 50, 999]"
          :page-size="querryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>

    </div>
    <!-- 弹层区 -->
    <el-dialog :title="`添加INVOICE计算变量 - ${addForm.rtu_name}`" :visible="showAddDialog" width="350px" :close-on-click-modal="false" @close="btnCancel">
      <el-form
        :model="addForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="RTU_NAME" prop="rtu_name">
          <el-input v-model="addForm.rtu_name" size="mini" disabled />
        </el-form-item>
        <el-form-item label="IOT平台变量" prop="variable_name">
          <el-select v-model="addForm.variable" filterable size="mini" clearable placeholder="从IOT变量中选择">
            <el-option
              v-for="item in variableList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="变量用途">
          <el-checkbox-group v-model="addForm.usage">
            <el-checkbox v-for="item in usageOptions.slice(1)" :key="item.value" :label="item.label" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="addVariable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加INVOICE计算变量" :visible="showAddNewDialog" width="350px" @close="btnCancel">
      <el-form>
        <el-form-item label="搜索选择APSA" prop="apsa" size="mini">
          <el-select
            v-model="addForm.apsa"
            filterable
            remote
            placeholder="输入气站中文或RTU名"
            :remote-method="getApsaList"
            :loading="loading"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in apsaList"
              :key="item.id"
              :label="item.site_name + '-' + item.asset_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="IOT平台变量" prop="variable_name">
          <el-select
            v-model="addForm.variable"
            filterable
            clearable
            size="mini"
            placeholder="从IOT变量中选择"
          >
            <el-option
              v-for="item in variableList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="变量用途">
          <el-checkbox-group v-model="addForm.usage">
            <el-checkbox v-for="item in usageOptions.slice(1)" :key="item.value" :label="item.label" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="addVariable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceVariable, deleteInvoiceVariable, addInvoiceVariable } from '@/api/invoice-diff'
import { Message } from 'element-ui'
import { getApsa } from '@/api/apsa'
import { getVariable } from '@/api/variable'
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
      usageOptions: [
        {
          value: '',
          label: '所有'
        },
        {
          value: 'INVOICE',
          label: '开票'
        },
        {
          value: 'MONTHLY',
          label: '月报'
        }
      ],
      showAddDialog: false,
      addForm: {
        rtu_name: '',
        apsa: null,
        variable: null,
        usage: []
      },
      variableList: [],
      apsaList: [],
      showAddNewDialog: false,
      loading: false
    }
  },
  watch: {
    'querryInfo.region': function() {
      this.getItemList()
    },
    'querryInfo.usage': function() {
      this.getItemList()
    },
    'addForm.apsa': function() {
      if (this.showAddNewDialog === true || this.showAddDialog === true) {
        this.getVariableList(this.addForm.apsa)
      }
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
    // 弹层控制
    showAdd(apsa) {
      this.addForm.apsa = apsa.apsa
      this.addForm.rtu_name = apsa.rtu_name
      this.showAddDialog = true
    },
    btnCancel() {
      this.showAddDialog = false
      this.showAddNewDialog = false
      this.addForm = {
        rtu_name: '',
        apsa: null,
        variable: null,
        usage: []
      }
      this.variableList = []
      this.apsaList = []
    },
    showAddNew() {
      this.showAddNewDialog = true
    },
    // 删除功能
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
    // 添加功能
    async addVariable() {
      // 是否为空
      if (this.addForm.apsa === null || this.addForm.variable === null || this.addForm.usage.length === 0) {
        return Message.error('必填不能为空')
      }
      // 检查是否重复
      const p = await this.addBeforeCheck()
      if (p) {
        return Message.error('该变量已存在')
      }
      try {
        await addInvoiceVariable(this.addForm)
        Message.success('新增成功')
        this.getItemList()
        this.showAddDialog = false
      } catch (error) {
        Message.error('新增失败：' + error)
      }
    },
    // 添加前查询功能
    async addBeforeCheck() {
      const res = await getInvoiceVariable({ ...this.querryInfo, pagesize: 999 }).catch(error => {
        console.log(error)
        return this.$message.error('网络不佳，请稍后重试')
      })
      return res.list.some(x => x.apsa === this.addForm.apsa && x.variable === this.addForm.variable)
    },
    // 弹层搜索功能
    async getApsaList(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getApsa({ 'name': query }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message.error('无法获取资产列表')
      })
      this.apsaList = res
      this.loading = false
    },
    async getVariableList(id) {
      const res = await getVariable({ 'apsa': id }).catch(error => {
        console.log(error)
        this.$message.error('获取Variables信息失败')
      })
      this.variableList = res
      this.variableMarkedList = res.filter(x => x.daily_mark !== '')
    }
  }
}
</script>

<style scoped>
    ::v-deep span {
        font-size: small;
    }
</style>
