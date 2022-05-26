<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 搜索栏 -->
        <filter-bar @queryChanged="queryChanged" />

        <!-- 资产表区 -->
        <el-table :data="apsaList" border stripe size="mini">
          <el-table-column label="+" type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand" size="mini">
                <el-form-item label="资产名">
                  <el-tag>{{ scope.row.name }}</el-tag>
                </el-form-item>
                <el-form-item label="类型">
                  <el-tag>{{ scope.row.apsa.onsite_type }}</el-tag>
                </el-form-item>
                <el-form-item label="资产编号">
                  <el-tag>{{ scope.row.apsa.facility_fin }}</el-tag>
                </el-form-item>
                <el-form-item label="汽化器型号">
                  <el-tag>{{ scope.row.apsa.vap_type }}</el-tag>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" size="mini" @click="hideAsset(scope.row)">隐藏该资产</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="气站名" prop="site.name" />
          <el-table-column label="RTU名" prop="rtu_name" />
          <el-table-column
            label="型号"
            prop="apsa.onsite_series"
            width="50px"
          />
          <el-table-column
            label="区域"
            prop="site.engineer.region"
            width="90px"
          />
          <el-table-column
            label="组别"
            prop="site.engineer.group"
            width="65px"
          />
          <el-table-column
            label="合同产量"
            prop="apsa.norminal_flow"
            width="80px"
          />
          <el-table-column
            label="结算温度"
            prop="apsa.temperature"
            width="80px"
          />
          <el-table-column
            label="汽化器能力"
            prop="apsa.vap_max"
            width="95px"
          />
          <el-table-column
            label="计算Daily"
            prop="apsa.daily_js"
            width="85px"
          ><template slot-scope="scope">
            {{ scope.row.apsa.daily_js === 0 ? '不' : scope.row.apsa.daily_js === 1 ? '是' : '特殊' }}
          </template></el-table-column>
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="comment" width="70" />
          <el-table-column label="操作" width="65px" fixed="right">
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
        title="修改Apsa资产信息"
        :visible.sync="editVisible"
        width="550px"
        top="30px"
        :close-on-click-modal="false"
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
          ref="editApsaFormREF"
          :model="editInfo"
          :rules="editApsaFormRules"
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
                <el-select
                  v-model="editInfo.site.engineer.id"
                  clearable
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in engineerList"
                    :key="item.id"
                    :label="item.first_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="设备信息登记" name="2">
              <el-form-item label="RTU名" prop="rtu_name">
                <el-input v-model="editInfo.rtu_name" />
              </el-form-item>
              <el-form-item label="Onsite类型" prop="onsite_type">
                <el-select
                  v-model="editInfo.apsa.onsite_type"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in onsiteTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Onsite型号" prop="onsite_series">
                <el-select
                  v-model="editInfo.apsa.onsite_series"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in onsiteSeriesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="资产编号" prop="facility_fin">
                <el-input v-model="editInfo.apsa.facility_fin" />
              </el-form-item>
              <el-form-item label="合同产量" prop="norminal_flow">
                <el-input v-model="editInfo.apsa.norminal_flow" />
              </el-form-item>
              <el-form-item label="结算温度" prop="temperature">
                <el-input v-model="editInfo.apsa.temperature" />
              </el-form-item>
              <el-form-item label="汽化器型号" prop="vap_type">
                <el-input v-model="editInfo.apsa.vap_type" />
              </el-form-item>
              <el-form-item label="汽化器能力" prop="vap_max">
                <el-input v-model="editInfo.apsa.vap_max" />
              </el-form-item>
              <el-form-item label="备注" prop="comment">
                <el-input v-model="editInfo.comment" type="textarea" />
              </el-form-item>
              <el-form-item label="计算daily" prop="daily_js">
                <el-select
                  v-model="editInfo.apsa.daily_js"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dailyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <div v-if="editInfo.apsa.daily_js === 2">
                <el-form-item label="固定补冷值" prop="cooling_fixed">
                  <el-input v-model="editInfo.apsa.cooling_fixed" />
                </el-form-item>
                <el-form-item label="关联设备" prop="daily_bind">
                  <el-select
                    v-model="editInfo.apsa.daily_bind"
                    filterable
                    remote
                    placeholder="输入气站中文或RTU名"
                    :remote-method="getSeatchItem"
                    :loading="loading"
                    size="mini"
                    clearable
                  >
                    <el-option
                      v-for="item in serchItemList"
                      :key="item.id"
                      :label="item.site_name + '-' + item.asset_name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="变量登记" name="3">
              <el-row>
                <el-col :span="7">
                  <el-button size="mini" type="primary" @click="showEditInnerDialog({})">新增变量配对</el-button>
                </el-col>
                <el-col :span="17">
                  <el-tooltip class="item" effect="dark" :content="dailyMarkTip" placement="top-start">
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-table :data="variableMarkedList" border stripe size="mini">
                <el-table-column type="index" label="#" />
                <el-table-column label="IOT平台变量名" prop="name" />
                <el-table-column
                  label="Daily标识"
                  prop="daily_mark"
                />
                <el-table-column label="修改配对信息" width="120px">
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
        width="250px"
        :title="innerCreate === 0 ? '修改DailyMark' : '创建变量配对'"
        :visible.sync="innerVisible"
        top="50px"
        append-to-body
        :close-on-click-modal="false"
        @close="editInnerDialogClosed"
      >
        <el-form
          ref="editVariableRef"
          :model="editVariable"
          :rules="editVariableRules"
          label-width="120px"
          size="mini"
        >
          <div v-if="innerCreate===0">
            <el-form-item label="IOT平台变量名" prop="name">
              <el-input v-model="editVariable.name" disabled />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="IOT平台变量名" prop="name">
              <el-select v-model="editVariable.id" filterable clearable placeholder="从IOT变量中选择">
                <el-option
                  v-for="item in variableList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="匹配Daily标识" prop="daily_mark">
            <el-select v-model="editVariable.daily_mark" filterable clearable placeholder="选择">
              <el-option
                v-for="item in dailyMarkOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
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
import { getUser } from '@/api/user'
import { getApsa } from '@/api/apsa'
export default {
  data() {
    return {
      // 查询结果总数
      total: 0,
      // 查询集合
      querryInfo: {
        // 当前页数
        page: 1,
        // 页容量
        pagesize: 10,
        apsa: 1
      },
      // 接收apsa资产列表
      apsaList: [],
      // type选项
      onsiteTypeOptions: [
        {
          value: 'APSA',
          label: 'APSA'
        },
        {
          value: 'MOS',
          label: 'MOS'
        },
        {
          value: 'EOX',
          label: 'EOX'
        },
        {
          value: 'PSA',
          label: 'PSA'
        }
      ],
      // 型号选项
      onsiteSeriesOptions: [
        {
          value: 'T3',
          label: 'T3'
        },
        {
          value: 'T4',
          label: 'T4'
        },
        {
          value: 'T5',
          label: 'T5'
        },
        {
          value: 'T6',
          label: 'T6'
        },
        {
          value: 'T7',
          label: 'T7'
        },
        {
          value: 'S6',
          label: 'S6'
        },
        {
          value: 'S7',
          label: 'S7'
        },
        {
          value: 'S8',
          label: 'S8'
        },
        {
          value: 'MOS',
          label: 'MOS'
        },
        {
          value: 'EOX',
          label: 'EOX'
        },
        {
          value: 'PSA',
          label: 'PSA'
        }
      ],
      // 地区选项
      regionOptions: [
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
      // 维修选项
      engineerList: [],
      // daily计算选项
      dailyOptions: [
        {
          value: 1,
          label: '常规计算'
        },
        {
          value: 2,
          label: '特殊计算'
        },
        {
          value: 0,
          label: '不计算'
        }
      ],
      dailyMarkOptions: [
        'H_PROD',
        'H_STPAL',
        'H_STPDFT',
        'H_STP400V',
        'M3_TOT',
        'M3_PEAK',
        'M3_Q1',
        'M3_Q3',
        'M3_Q5',
        'M3_Q6',
        'M3_Q7',
        'FLOW_METER'
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
        apsa: {
          id: 1,
          onsite_type: '',
          onsite_series: '',
          facility_fin: '',
          daily_js: 0,
          temperature: 0,
          vap_max: 0,
          vap_type: '',
          norminal_flow: 0,
          daily_bind: 0,
          flow_meter: 0,
          cooling_fixed: 0
        },
        name: '',
        rtu_name: '',
        comment: ''
      },
      editVariable: {
        id: 0,
        name: '',
        confirm: 0,
        daily_mark: ''
      },
      variableList: [],
      variableMarkedList: [],
      editVisible: false,
      innerVisible: false,
      innerCreate: 0,
      editApsaFormRules: {
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
        ],
        engineer_name: [
          { required: true, message: '请选择维修', trigger: 'blur' }
        ]
      },
      editVariableRules: {
        daily_mark: [
          { required: true, message: '请填写daily标识', trigger: 'blur' }
        ],
        name: [{ required: true, message: '填写变量名', trigger: 'blur' }]
      },
      activeIndex: '1',
      // 搜索框内容
      loading: false,
      serchItemList: [],
      // tooltip
      dailyMarkTip: '11个变量:H_PROD,STP400V,STPAL,STPDFT. M3_PEAK,PROD,Q1,Q5,Q6,Q7,TOT. 可选流量计'
    }
  },
  watch: {
    'editInfo.site.engineer.id': function() {
      if (this.editInfo.site.engineer.id) {
        const engineer = this.engineerList.filter(x => x.id === this.editInfo.site.engineer.id)[0]
        this.editInfo.site.engineer.region = engineer.region
        this.editInfo.site.engineer.group = engineer.group
        this.editInfo.site.engineer.first_name = engineer.first_name
      } else {
        this.editInfo.site.engineer.region = ''
        this.editInfo.site.engineer.group = ''
        this.editInfo.site.engineer.first_name = ''
      }
    }
  },
  methods: {
    // 监听 页码 变化的函数
    handleSizeChange(newSize) {
      this.querryInfo.pagesize = newSize
      this.getApsaList()
    },
    handleCurrentChange(newPage) {
      this.querryInfo.page = newPage
      this.getApsaList()
    },
    // 搜索框触发搜索功能
    queryChanged(query) {
      this.querryInfo.name = query.name
      this.querryInfo.region = query.region
      this.querryInfo.confirm = query.confirm
      this.querryInfo.cal = query.cal
      this.querryInfo.page = 1
      this.getApsaList()
    },
    // 获取资产列表，工程师，变量信息
    async getApsaList() {
      const res = await getAsset(this.querryInfo).catch(error => {
        console.log(error)
        this.$message.error('无法获取资产列表')
      })
      this.apsaList = res.list
      this.total = res.total
    },
    async getVariableList(id) {
      const res = await getVariable({ 'asset': id }).catch(error => {
        console.log(error)
        this.$message.error('获取Variables信息失败')
      })
      this.variableList = res
      this.variableMarkedList = res.filter(x => x.daily_mark !== '')
    },
    async getEngineer() {
      const res = await getUser({ 'engineer': 1 }).catch(error => {
        console.log(error)
        this.$message.error('获取工程师信息失败')
      })
      this.engineerList = res
    },
    // 弹层控制
    showEditDialog(assetInfo) {
      this.editInfo = JSON.parse(JSON.stringify(assetInfo))
      this.getVariableList(assetInfo.id)
      this.getEngineer()
      this.editVisible = true
    },
    showEditInnerDialog(variableInfo) {
      if (variableInfo.id) {
        this.innerCreate = 0
      } else {
        this.innerCreate = 1
      }
      this.editVariable = JSON.parse(JSON.stringify(variableInfo))
      this.innerVisible = true
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
        apsa: {
          id: 1,
          onsite_type: '',
          onsite_series: '',
          facility_fin: '',
          daily_js: 0,
          temperature: 0,
          vap_max: 0,
          vap_type: '',
          norminal_flow: 0,
          daily_bind: 0,
          flow_meter: 0,
          cooling_fixed: 0
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
      this.getApsaList()
    },
    // 变量操作方法
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
        console.log(this.editVariable)
        const v = this.variableList.filter(x => x.name === this.editVariable.name)[0]
        console.log(v)
        this.editVariable.id = v.id
        console.log(this.editVariable)
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
    // 更新资产
    async updateAsset() {
      console.log(this.editInfo)
      // 验证工程师
      if (this.editInfo.site.engineer.id === '' || this.editInfo.site.engineer.id === 0) {
        return Message.error('缺少工程师信息')
      }
      // 验证变量总数
      if (this.variableMarkedList.length < 11 && this.editInfo.apsa.daily_js !== 0) {
        return Message.error('变量绑定数量错误,请确认')
      }
      // 验证两个400V
      if (this.variableMarkedList.filter(x => x.daily_mark === 'H_STP400V').length !== 1 && this.editInfo.apsa.daily_js !== 0) {
        return Message.error('H_STP400V变量重复,请修改')
      }
      // 验证不能自己绑定自己
      if (this.editInfo.apsa.daily_bind === this.editInfo.apsa.id) {
        return Message.error('不能自己绑定自己')
      }
      // 如果是普通计算，则清空bind和fixed
      if (this.editInfo.apsa.daily_js === 1) {
        this.editInfo.apsa.cooling_fixed = 0
        this.editInfo.apsa.daily_bind = -1
      }
      try {
        await this.$confirm('是否提交修改')
        await updateAsset({ ...this.editInfo, confirm: 1 })
        Message.success('提交成功')
        this.editVisible = false
        this.getApsaList()
      } catch (error) {
        Message.error('提交失败：' + error)
      }
    },
    // 设置隐藏
    async hideAsset(asset) {
      try {
        await this.$confirm('隐藏不会删除该资产,以后可过滤进行查看')
        await updateAsset({ ...asset, confirm: -1 })
        Message.info('已隐藏')
        this.getApsaList()
      } catch (error) {
        Message.error('隐藏失败：' + error)
      }
    },
    // 搜索框
    async getSeatchItem(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getApsa({ 'name': query }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message.error('无法获取资产列表')
      })
      this.serchItemList = res
      this.loading = false
    }
  }
}
</script>
<style scoped>
  ::v-deep .demo-table-expand {
      font-size: 0px;
  }
  ::v-deep .demo-table-expand label {
    color: #99a9bf;
  }
  ::v-deep .demo-table-expand .el-form-item {
    margin-right: 20px;
    margin-bottom: 0;
    height: 32px;
  }
  ::v-deep .el-step__title {
    font-size: 10px;
    margin-bottom: 12px;
  }
  .app-container {
    padding: 5px 5px 5px;
  }
</style>
