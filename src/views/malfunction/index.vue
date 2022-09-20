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
          <el-button slot="before" size="mini" type="primary" @click="exportData">导出</el-button>
          <el-button slot="before" type="primary" size="mini" :style="checkPermission('malfunction_add')" @click="goAddPage">
            新增
          </el-button>
          <el-button slot="before" size="mini" type="primary" :style="{display: checkPermBool('malfunction_merge', 'malfunction_lock') ? '' : 'none'}" @click="showSelectBox">
            {{ selectButtonMsg }}
          </el-button>
          <el-button slot="before" size="mini" :disabled="!showSelect" :style="checkPermission('malfunction_merge')" @click="showMergeDialog">
            合并
          </el-button>
          <el-button slot="before" size="mini" :disabled="!showSelect" :style="checkPermission('malfunction_lock')" @click="adminConfirm">
            锁定
          </el-button>
        </search-bar>
        <el-row>
          <el-col :span="8" :style="{'font-size': '15px'}">
            停机原因过滤:
            <el-select
              v-model="query.reason"
              size="mini"
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in [...mainReasonOptions, {value: '',label: '未填写'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>

        </el-row>

        <!-- 表单区 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="list"
          border
          stripe
          size="mini"
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="showSelect"
            type="selection"
            width="39"
            align="center"
          />
          <el-table-column
            label="RTU Name"
            prop="rtu_name"
            width="130"
            :show-overflow-tooltip="true"
            fixed="left"
            sortable
          />
          <el-table-column
            label="开始时间"
            prop="t_start"
            width="125"
            sortable
          />
          <el-table-column
            label="结束时间"
            prop="t_end"
            width="125"
            sortable
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
            label="停机用液"
            prop="stop_consumption"
            width="75"
          />
          <el-table-column
            label="平均用液"
            prop="avg_con"
            width="75"
          />
          <el-table-column
            label="标志位"
            prop="stop_label"
            width="65"
          />
          <el-table-column
            label="停机报警"
            prop="stop_alarm"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="停机原因" prop="reason_main" :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              {{ translateReason(row.reason_main, 1) }}
            </template>
          </el-table-column>
          <el-table-column label="过程组原因" prop="reason_l1" :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              {{ translateReason(row.reason_l1, 0) }}
            </template>
          </el-table-column>
          <el-table-column label="设备原因" prop="reason_l2">
            <template slot-scope="{row}">
              {{ translateReason(row.reason_l2, 0) }}
            </template>
          </el-table-column>
          <el-table-column label="组件原因" prop="reason_l3">
            <template slot-scope="{row}">
              {{ translateReason(row.reason_l3, 0) }}
            </template>
          </el-table-column>
          <el-table-column label="部件原因" prop="reason_l4">
            <template slot-scope="{row}">
              {{ translateReason(row.reason_l4, 0) }}
            </template>
          </el-table-column>
          <el-table-column label="具体原因-1" prop="reason_detail_1" />
          <el-table-column label="具体原因-2" prop="reason_detail_2" />
          <el-table-column label="OCC备注" prop="occ_comment" :show-overflow-tooltip="true" />
          <el-table-column label="维修备注" prop="mt_comment" :show-overflow-tooltip="true" />
          <el-table-column label="操作" :width="rowWidth" fixed="right">
            <template slot-scope="scope">
              <!-- OCC修改按钮 -->
              <el-button
                :type="scope.row.confirm === 0? 'primary' : 'success'"
                icon="el-icon-edit"
                size="mini"
                :style="checkPermission('malfunction_occ')"
                @click="editMalfunctionOcc(scope.row)"
              />
              <!-- Maint修改按钮 -->
              <el-button
                :type="scope.row.reason_main === ''? 'warning' : 'success'"
                icon="el-icon-setting"
                size="mini"
                :style="checkPermission('malfunction_maint')"
                @click="editMalfunctionMaint(scope.row)"
              />
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :style="checkPermission('malfunction_del')"
                @click="deleteMalfunction(scope.row)"
              />
              <i class="el-icon-lock" :style="scope.row.confirm >= 2? '' : 'display:none'" />
              <i class="el-icon-lock" :style="scope.row.confirm === 3? '' : 'display:none'" />
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
        <el-divider />
        <el-row class="raw-text">
          当前页停机时长：{{ stop_statics.time }} ；用液消耗：{{ stop_statics.consumption }}
        </el-row>
      </el-card>
    </div>
    <!-- 编辑，新增弹层 -->
    <add-malfunction :show-dialog.sync="showAddDialog" />
    <edit-occ ref="editOcc" :show-dialog.sync="showEditOcc" />
    <edit-maint ref="editMaint" :show-dialog.sync="showEditMaint" />
    <el-dialog title="合并停机" :visible="showMergeForm" width="450px" :close-on-click-modal="false" @close="closeMergeDialog">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRule"
        label-width="130px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="气站设备名" prop="name">
          <el-input
            v-model="addForm.name"
            disabled
          />
        </el-form-item>
        <el-form-item label="停机时间" prop="t_start">
          <el-date-picker
            v-model="addForm.t_start"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          /> </el-form-item>
        <el-form-item label="开机时间" prop="t_end">
          <el-date-picker
            v-model="addForm.t_end"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          /> </el-form-item>
        <el-form-item label="停机次数" prop="stop_count">
          <el-input
            v-model.number="addForm.stop_count"
          /> </el-form-item><el-form-item label="停机时长" prop="stop_hour">
          <el-input
            v-model.number="addForm.stop_hour"
            type="number"
          /> </el-form-item>
        <el-form-item label="停机用液消耗" prop="stop_consumption">
          <el-input
            v-model.number="addForm.stop_consumption"
            type="number"
          /> </el-form-item>
        <el-form-item label="停机标志位" prop="stop_label">
          <el-select
            v-model="addForm.stop_label"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in stopLabelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> </el-form-item>
        <el-form-item label="停机报警" prop="stop_alarm">
          <el-input
            v-model="addForm.stop_alarm"
          /> </el-form-item>
        <el-form-item label="备注信息" prop="occ_comment">
          <el-input
            v-model="addForm.occ_comment"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeMergeDialog">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="mergeMalfunction"
        >提交记录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addMalfunction, getMalfunction, deleteMalfunction, lockMalfunction, getReason } from '@/api/malfunction'
import { Message } from 'element-ui'
import AddMalfunction from './add-malfunction'
import EditOcc from './edit-occ'
import EditMaint from './edit-maint'
import { mapGetters } from 'vuex'
export default {
  components: { AddMalfunction, EditOcc, EditMaint },
  data() {
    const dateRule = (rule, value, callback) => {
      if (this.addForm.t_end === '') {
        return callback(new Error('开机时间不能为空'))
      }
      Date.parse(this.addForm.t_end) < Date.parse(this.addForm.t_start) ? callback(new Error('开机时间不能小于停机时间')) : callback()
    }
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
        group: '',
        reason: []
      },
      rowWidth: '198px',
      loading: false,
      showAddDialog: false,
      showEditOcc: false,
      showEditMaint: false,
      // 主要原因选择
      mainReasonOptions: [
        {
          value: 'Budget Maintenance Interruptions',
          label: '计划内保养'
        },
        {
          value: 'Internal Involuntary Interruptions',
          label: '内部被动原因'
        },
        {
          value: 'Voluntary + Not Budget Interruptions',
          label: '主动无预算'
        },
        {
          value: 'External Interruptions',
          label: '外部原因'
        },
        {
          value: 'Disuse by Customer',
          label: '客户停用'
        }
      ],
      reasons_all: [],
      // 停机合并多选框显示
      showMergeForm: false,
      showSelect: false,
      selectedRows: [],
      selectButtonMsg: '多选',
      addForm: {
        name: '',
        apsa_id: null,
        t_start: '',
        t_end: '',
        stop_count: 1,
        stop_hour: 0.0,
        stop_consumption: 0.0,
        stop_label: '',
        stop_alarm: '',
        reason_main: '',
        reason_l1: '',
        reason_l2: '',
        reason_l3: '',
        reason_l4: '',
        reason_detail_1: '',
        reason_detail_2: '',
        mt_comment: '',
        occ_comment: '',
        change_user: ''
      },
      stopLabelOptions: [
        {
          value: 'DFT',
          label: 'DFT'
        },
        {
          value: 'AL',
          label: 'AL'
        },
        {
          value: '400V',
          label: '400V'
        }
      ],
      // 表单验证规则
      addFormRule: {
        t_start: [{ required: true, message: '停机时间不能为空', trigger: 'bulr' }],
        t_end: [{ required: true, validator: dateRule, trigger: 'bulr' }],
        stop_count: [{ required: true, message: '停机次数不能为空', trigger: 'bulr' },
          { type: 'number', min: 1, message: '停机次数必须是数字且大于1', trigger: 'bulr' }],
        stop_hour: [{ required: true, message: '停机时长不能为空', trigger: 'bulr' },
          { type: 'number', min: 0, message: '停机时长必须是数字且大于0', trigger: 'bulr' }],
        stop_consumption: [{ required: true, message: '停机用液消耗不能为空', trigger: 'bulr' },
          { type: 'number', min: 0, message: '停机时长必须是数字且大于等于0', trigger: 'bulr' }],
        stop_label: [{ required: true, message: '停机标志位不能为空', trigger: 'bulr' }]
      },
      // 停机页尾数据统计
      stop_statics: {
        time: 0,
        consumption: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'query.reason': function() {
      this.query.page = 1
      this.getMalfunction()
    }
  },
  created() {
    this.getReasonsAll()
    this.computeWidth()
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
      this.query.page = 1
      this.getMalfunction()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getMalfunction()
    },
    // 计算操作栏宽度
    computeWidth() {
      if (this.checkPermission('malfunction_occ').display === 'none') {
        this.rowWidth = '158px'
      }
      if (this.checkPermission('malfunction_del').display === 'none') {
        this.rowWidth = '108px'
      }
    },
    // Malfunction方法
    async getMalfunction() {
      this.loading = true
      try {
        const res = await getMalfunction(this.query)
        this.list = res.list
        this.total = res.total
        // 统计当前分页的停机时长和用液消耗
        this.stop_statics.time = 0
        this.stop_statics.consumption = 0
        for (const m of this.list) {
          this.stop_statics.time += m.stop_hour
          this.stop_statics.consumption += m.stop_consumption
        }
        this.stop_statics.time = this.stop_statics.time.toFixed(2)
        this.stop_statics.consumption = this.stop_statics.consumption.toFixed(2)
      } catch (error) {
        Message.error('获取停机列表失败')
      }
      this.loading = false
    },
    async deleteMalfunction(item) {
      // 判断记录是否被锁定
      console.log(item.confirm)
      if (item.confirm > 1 && this.userInfo.username !== 'admin') {
        return Message.error('已锁定的记录无法删除，请联系管理员')
      }
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
      if (this.needLock(item)) {
        return Message.error('该记录已被锁定,如需修改请联系管理员')
      }
      this.$refs.editOcc.getData(item)
      this.showEditOcc = true
    },
    async editMalfunctionMaint(item) {
      if (this.needLock(item)) {
        return Message.error('该记录已被锁定,如需修改请联系管理员')
      }
      await this.$refs.editMaint.getData(item)
      this.showEditMaint = true
    },
    // 导出数据
    exportData() {
      // 验证有无数据
      if (this.total === 0) {
        return Message.error('请先刷新数据后再下载')
      }
      // 定义表头对应json key
      const headers = {
        '区域': 'region',
        'RTU名': 'rtu_name',
        '资产编号': 'facility_fin',
        '开始时间': 't_start',
        '结束时间': 't_end',
        '停机时长': 'stop_hour',
        '停机液氮消耗': 'stop_consumption',
        '停机标志位': 'stop_label',
        '停机报警': 'stop_alarm',
        '停机原因': 'reason_main',
        '过程组原因': 'reason_l1',
        '设备原因': 'reason_l2',
        '组件原因': 'reason_l3',
        '部件原因': 'reason_l4',
        '具体原因-1': 'reason_detail_1_eng',
        '具体原因-2': 'reason_detail_2_eng',
        'OCC备注': 'occ_comment',
        '维修备注': 'mt_comment',
        '上次修改时间': 'change_date',
        '上次修改者': 'change_user'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        const res = await getMalfunction({ ...this.query, pagesize: this.total, page: 1 })
        // 转化Json数据至[[]]格式
        const data = this.formatJson(headers, res.list)
        // 导出
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: `停机报表_${this.query.start.split(' ')[0]}_${this.query.region === '' ? '全部区域' : this.query.region}`,
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
    },
    // 获取原因
    async getReasonsAll() {
      const res = await getReason({ all: 1 }).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.reasons_all = res.reason_list
    },
    // 英文原因转中文
    translateReason(eng, isMain) {
      try {
        if (eng === '') {
          return ''
        }
        if (isMain === 1) {
          return this.reasons_all.filter(x => x.value === eng)[0].label
        }
        return this.reasons_all.filter(x => x.ename === eng)[0].cname
      } catch (error) {
        return eng
      }
    },
    // 停机合并多选切换
    showSelectBox() {
      if (this.showSelect) {
        this.showSelect = false
        this.selectButtonMsg = '多选'
        this.selectedRows = []
        this.$refs.multipleTable.clearSelection()
        return
      }
      this.showSelect = true
      this.selectButtonMsg = '取消'
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 显示停机合并弹层
    showMergeDialog() {
      if (this.selectedRows.length < 2) {
        return Message.info('至少选择两条记录')
      }
      let apsa_id = -1
      for (const item of this.selectedRows) {
        if (apsa_id === -1) {
          this.addForm.apsa_id = item.apsa
          this.addForm.name = item.rtu_name + '-' + item.asset_name
          apsa_id = item.apsa
        } else {
          if (this.addForm.apsa_id !== item.apsa) {
            this.addForm.stop_hour = {
              name: '',
              apsa_id: null,
              t_start: '',
              t_end: '',
              stop_count: 1,
              stop_hour: 0.0,
              stop_consumption: 0.0,
              stop_label: '',
              stop_alarm: '',
              reason_main: '',
              reason_l1: '',
              reason_l2: '',
              reason_l3: '',
              reason_l4: '',
              reason_detail_1: '',
              reason_detail_2: '',
              mt_comment: '',
              occ_comment: '',
              change_user: ''
            }
            return Message.error('气站不相同,无法合并')
          }
        }
        this.addForm.stop_hour += item.stop_hour
        this.addForm.stop_consumption += item.stop_consumption
        this.addForm.stop_label = item.stop_label
      }
      this.showMergeForm = true
    },
    // 关闭停机合并弹层
    closeMergeDialog() {
      this.getMalfunction()
      this.showMergeForm = false
      this.selectedRows = []
      this.$refs.multipleTable.clearSelection()
      this.showSelect = false
      this.selectButtonMsg = '多选'
      this.addForm = {
        name: '',
        apsa_id: null,
        t_start: '',
        t_end: '',
        stop_count: 1,
        stop_hour: 0.0,
        stop_consumption: 0.0,
        stop_label: '',
        stop_alarm: '',
        reason_main: '',
        reason_l1: '',
        reason_l2: '',
        reason_l3: '',
        reason_l4: '',
        reason_detail_1: '',
        reason_detail_2: '',
        mt_comment: '',
        occ_comment: '',
        change_user: ''
      }
    },
    // 提交合并
    async mergeMalfunction() {
      try {
        await this.$confirm('合并会删除选中的原始记录! 是否继续')
        await this.$refs.addFormRef.validate()
        await addMalfunction({ ...this.addForm, confirm: 1, change_user: this.userInfo.username })
        for (const item of this.selectedRows) {
          await deleteMalfunction(item.id)
        }
        Message.success('添加合并成功')
        this.showMergeForm = false
        this.$refs.addFormRef.resetFields()
      } catch (error) {
        console.log(error)
        console.log(error.message)
        Message.error('添加合并失败' + error.response.data)
      }
    },
    // 提交管理员确认
    async adminConfirm() {
      let confirm_level = 0
      const id_list = []
      // 循环遍历所有item, 判断是否有权限锁定
      for (const item of this.selectedRows) {
        const c = item.confirm
        if (c === 0 || c === '0') {
          return Message.error('包含未确认的记录，请先确认再锁定')
        }
        if (c === 3 && this.userInfo.username !== 'admin') {
          return Message.error('包含已被管理员确认过的记录，您无权限锁定')
        }
        id_list.push(item.id)
      }

      // 确认提示
      if (this.userInfo.username === 'admin') {
        await this.$confirm('锁定后,除了admin外的所有用户将无法再对这些记录进行修改')
        confirm_level = 3
      } else {
        await this.$confirm('锁定后,除了您和admin外的所有用户将无法再对这些记录进行修改')
        confirm_level = 2
      }
      // 提交请求
      try {
        await lockMalfunction({ id_list: id_list, confirm: confirm_level })
        Message.success('锁定成功')
        this.closeMergeDialog()
      } catch (error) {
        console.log(error)
        Message.error('多选确认失败' + error.response.data)
      }
    },
    // 判断按钮图标是否需要变成锁
    needLock(item) {
      if (item.confirm === 2) {
        if (this.userInfo.points.some(x => x === 'malfunction_lock')) {
          return false
        } else {
          return true
        }
      }
      if (item.confirm === 3) {
        if (this.userInfo.username === 'admin') {
          return false
        } else {
          return true
        }
      }
      return false
    }

  }
}
</script>

<style scoped>
  ::v-deep .demo-table-expand {
      width: 80%;
      font-size: 0px;
  }
  ::v-deep .demo-table-expand label {
    width: 85px;
    color: #99a9bf;
  }
  ::v-deep .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    height: 32px;
  }
  .raw-text {
    font-family: "PingFang SC";
    font-size: 12px;
  }
</style>
