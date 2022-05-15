<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>储罐管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <!-- 搜索栏 -->
        <filter-bar @queryChanged="queryChanged" />

        <!-- 资产表区 -->
        <el-table :data="bulkList" border stripe size="mini">
          <el-table-column type="index" label="#" />
          <el-table-column label="气站名" prop="site.name" />
          <el-table-column label="RTU名" prop="rtu_name" />
          <el-table-column label="资产名" prop="name" />
          <el-table-column
            label="有效容积"
            prop="bulk.tank_size"
            width="70px"
          />
          <el-table-column label="储罐功能" prop="bulk.tank_func" width="85px">
            <template slot-scope="scope">
              {{ scope.row.bulk.tank_func | tankFuncFilter }}
            </template></el-table-column>
          <el-table-column
            label="区域"
            prop="site.engineer.region"
            width="90px"
          />
          <el-table-column
            label="维修组别"
            prop="site.engineer.group"
            width="80px"
          />
          <el-table-column
            label="计算filling"
            prop="bulk.filling_js"
            width="95px"
          ><template slot-scope="scope">
            {{ scope.row.bulk.filling_js === 1 ? '是' : scope.row.bulk.filling_js === 2 ? '不计入daily' : '不' }}
          </template></el-table-column>
          <el-table-column label="备注" prop="comment" :show-overflow-tooltip="true" />
          <el-table-column label="操作" width="65px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
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
      </el-card>

      <!-- 最外层修改资产dialog -->
      <el-dialog
        title="修改资产"
        :visible.sync="editVisible"
        width="600px"
        top="30px"
        @close="editDialogClosed"
      >
        <!-- 进度条 -->
        <el-steps
          :space="800"
          :active="activeIndex - 0"
          finish-status="success"
          align-center
        >
          <el-step title="气站信息登记" />
          <el-step title="设备信息登记" />
          <el-step title="变量登记" />
        </el-steps>
        <!-- Tab栏 -->
        <el-form
          ref="editBulkFormREF"
          :model="editInfo"
          :rules="editBulkFormRules"
          label-width="100px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-tabs v-model="activeIndex" :tab-position="'left'">
            <el-tab-pane label="气站信息登记" name="1">
              <el-form-item label="气站名" prop="site_name">
                <el-input v-model="editInfo.site.name" disabled />
              </el-form-item>
              <el-form-item label="区域" prop="region">
                <el-input
                  v-model="editInfo.site.engineer.region"
                  disabled
                />
              </el-form-item>
              <el-form-item label="分组" prop="group">
                <el-input
                  v-model="editInfo.site.engineer.group"
                  disabled
                />
              </el-form-item>
              <el-form-item label="维修" prop="engineer_name">
                <el-input v-model="editInfo.site.engineer.first_name" disabled />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="储罐信息登记" name="2">
              <el-form-item label="RTU名" prop="rtu_name">
                <el-input v-model="editInfo.rtu_name" />
              </el-form-item>
              <el-form-item label="储罐大小" prop="tank_size">
                <el-input v-model="editInfo.bulk.tank_size" />
              </el-form-item>
              <el-form-item label="储罐功能" prop="onsite_type">
                <el-select
                  v-model="editInfo.bulk.tank_func"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in tankFuncOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="计算Filling" prop="filling_js">
                <el-select
                  v-model="editInfo.bulk.filling_js"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in fillingOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="LEVEL_A" prop="level_a">
                <el-input v-model="editInfo.bulk.level_a" />
              </el-form-item>
              <el-form-item label="LEVEL_B" prop="level_b">
                <el-input v-model="editInfo.bulk.level_b" />
              </el-form-item>
              <el-form-item label="LEVEL_C" prop="level_c">
                <el-input v-model="editInfo.bulk.level_c" />
              </el-form-item>
              <el-form-item label="LEVEL_D" prop="level_d">
                <el-input v-model="editInfo.bulk.level_d" />
              </el-form-item>
              <el-form-item label="备注" prop="comment">
                <el-input v-model="editInfo.comment" type="textarea" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="变量登记" name="3">
              <el-button size="mini" type="primary" @click="showEditInnerDialog({})">新增变量配对</el-button>
              <el-table :data="variableMarkedList" border stripe size="mini">
                <el-table-column type="index" label="#" />
                <el-table-column label="IOT变量名" prop="name" />
                <el-table-column
                  label="Daily标识"
                  prop="daily_mark"
                />
                <el-table-column label="修改配对信息">
                  <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteDailyMark(scope.row)"
                    />
                  </template>
                </el-table-column> </el-table></el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateAsset">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 内嵌修改变量dialog -->
      <el-dialog
        width="40%"
        :title="editVariable.id != null ? '修改变量filling标识' : '新增变量配对'"
        :visible.sync="innerVisible"
        top="50px"
        append-to-body
        @close="editInnerDialogClosed"
      >
        <el-form
          ref="editVariableRef"
          :model="editVariable"
          :rules="editVariableRules"
          label-width="120px"
          size="mini"
        >
          <div v-if="editVariable.id != null">
            <el-form-item label="IOT平台变量名" prop="name">
              <el-input v-model="editVariable.name" disabled />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="IOT平台变量名" prop="name">
              <el-select v-model="editVariable.name" filterable clearable placeholder="从IOT变量中选择">
                <el-option
                  v-for="item in variableList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="匹配filling标识" prop="daily_mark">
            <el-input v-model="editVariable.daily_mark" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editInnerDialogClosed">取 消</el-button>
          <el-button type="primary" @click="updateVariable">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAsset, updateAsset } from '@/api/asset'
import { getVariable, updateVariable } from '@/api/variable'
import { Message } from 'element-ui'
export default {
  filters: {
    tankFuncFilter(value) {
      if (value === 'both') {
        return '补峰+冷'
      }
      if (value === 'cooling') {
        return '补冷'
      }
      if (value === 'peak') {
        return '补峰'
      }
    }
  },
  data() {
    return {
      // 查询结果总数
      total: 0,
      // 查询集合
      querryInfo: {
        query: '',
        // 当前页数
        page: 1,
        // 页容量
        pagesize: 10,
        // 获取apsa还是bulk
        apsa: 0
      },
      // 接收bulk资产列表
      bulkList: [],
      // tank功能选项
      tankFuncOptions: [
        {
          value: 'cooling',
          label: '补冷'
        },
        {
          value: 'peak',
          label: '补峰'
        },
        {
          value: 'both',
          label: '补冷+补峰'
        }
      ],
      // filling计算选项
      fillingOptions: [
        {
          value: '1',
          label: '计算'
        },
        {
          value: '2',
          label: '计算但不计入daily'
        },
        {
          value: '0',
          label: '不计算'
        }
      ],
      editInfo: {
        id: 0,
        site: {
          id: 0,
          engineer: {
            id: 0,
            first_name: '',
            region: '',
            group: '',
            email: ''
          },
          name: '',
          confirm: 0
        },
        bulk: {
          id: 1,
          tank_size: 0,
          tank_func: '',
          level_a: 0,
          level_b: 0,
          level_c: 0,
          level_d: 0,
          filling_js: 0
        },
        name: '',
        rtu_name: '',
        comment: ''
      },
      editVariable: {
        id: 0,
        name: '',
        confirm: '',
        daily_mark: ''
      },
      variableList: [],
      variableMarkedList: [],
      editVisible: false,
      innerVisible: false,
      editBulkFormRules: {
        rtu_name: [
          { required: true, message: '请填写RTU名称', trigger: 'blur' }
        ],
        daily_js: [
          { required: true, message: '请选择daily计算模式', trigger: 'blur' }
        ],
        norminal_flow: [
          { required: true, message: '请填写合同产量', trigger: 'blur' }
        ],
        temperature: [
          { required: true, message: '请填写合同温度', trigger: 'blur' }
        ]
      },
      editVariableRules: {
        daily_mark: [
          { required: true, message: '请填写daily标识', trigger: 'blur' }
        ],
        name: [{ required: true, message: '填写变量名', trigger: 'blur' }]
      },
      activeIndex: '1'
    }
  },
  created() {
    this.getBulkList()
  },
  methods: {
    handleSizeChange(newSize) {
      this.querryInfo.pagesize = newSize
      this.getBulkList()
    },
    // 监听 页码 变化的函数
    handleCurrentChange(newPage) {
      this.querryInfo.page = newPage
      this.getBulkList()
    },
    queryChanged(query) {
      this.querryInfo.name = query.name
      this.querryInfo.region = query.region
      this.querryInfo.confirm = query.confirm
      this.querryInfo.cal = query.cal
      this.querryInfo.page = 1
      this.getBulkList()
    },
    async getBulkList() {
      const res = await getAsset(this.querryInfo)
        .catch((error) => {
          console.log(error)
          this.$message.error('无法获取资产列表')
        })
      this.bulkList = res.list
      this.total = res.total
    },
    editDialogClosed() {
      this.editVisible = false
      this.innerVisible = false
      this.variableList = []
      this.variableMarkedList = []
      this.editInfo = {
        id: 0,
        site: {
          id: 0,
          engineer: {
            id: 0,
            first_name: '',
            region: '',
            group: '',
            email: ''
          },
          name: '',
          confirm: 0
        },
        bulk: {
          id: 1,
          tank_size: 0,
          tank_func: '',
          level_a: 0,
          level_b: 0,
          level_c: 0,
          level_d: 0,
          filling_js: 0
        },
        name: '',
        rtu_name: '',
        comment: ''
      }
      this.activeIndex = '1'
      this.editInnerDialogClosed()
    },
    editInnerDialogClosed() {
      this.editVariable = {
        id: 0,
        name: '',
        confirm: '',
        daily_mark: ''
      }
      this.innerVisible = false
      this.getBulkList()
    },
    async getVariableList(id) {
      const res = await getVariable({ 'asset': id }).catch(error => {
        console.log(error)
        this.$message.error('获取Variables信息失败')
      })
      this.variableList = res
      this.variableMarkedList = res.filter(x => x.daily_mark !== '')
    },
    showEditDialog(assetInfo) {
      this.editInfo = assetInfo
      this.getVariableList(assetInfo.id)
      this.editVisible = true
    },
    showEditInnerDialog(variableInfo) {
      this.editVariable = variableInfo
      this.innerVisible = true
    },
    async deleteDailyMark(varibaleInfo) {
      try {
        await this.$confirm('是否删除该配对')
        await updateVariable({ ...varibaleInfo, daily_mark: '' })
        Message.success('删除成功')
        this.getVariableList(this.editInfo.id)
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    async updateVariable() {
      if (this.editVariable.id === undefined) {
        const v = this.variableList.filter(x => x.name === this.editVariable.name)[0]
        this.editVariable.id = v.id
      }
      try {
        await updateVariable({ ...this.editVariable, 'confirm': 1 })
        Message.success('提交成功')
        this.editInnerDialogClosed()
        this.getVariableList(this.editInfo.id)
      } catch (error) {
        console.log(error)
        Message.error('提交失败：' + error)
      }
    },
    async updateAsset() {
      try {
        await updateAsset(this.editInfo)
        Message.success('提交成功')
        this.editDialogClosed()
      } catch (error) {
        Message.error('提交失败：' + error)
      }
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-step__title {
    font-size: 10px;
    margin-bottom: 12px;
  }
  ::v-deep .el-dialog .el-input__inner {
    width: 230px;
  }
  ::v-deep .el-dialog .el-textarea__inner {
    width: 230px;
  }
</style>
