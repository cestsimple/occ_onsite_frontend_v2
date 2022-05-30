<template>
  <el-dialog
    :title="addForm.rtu_name + ' - 修改停机记录'"
    :visible="showDialog"
    width="450px"
    top="30px"
    :close-on-click-modal="false"
    @close="btnCancel"
  >
    <!-- 信息提示 -->
    <el-alert
      :title="`当前用户:${userInfo.username}，上次编辑于: ${addForm.change_user} 在 ${addForm.change_date} `"
      type="info"
      center
      show-icon
      :closable="false"
    />
    <!-- 表单区域 -->
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRule"
      label-width="130px"
      label-position="left"
      size="mini"
    >
      <el-form-item label="停机原因" prop="reason_main">
        <el-select
          v-model="addForm.reason_main"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in mainReasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div
        v-if="
          addForm.reason_main === 'Internal Involuntary Interruptions' ||
            addForm.reason_main === 'Voluntary + Not Budget Interruptions'
        "
      >
        <el-form-item label="过程组原因" prop="reason_l1">
          <el-select
            v-model="addForm.reason_l1"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in levelOneOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.ename"
            />
          </el-select></el-form-item>
        <el-form-item label="设备原因" prop="reason_l2">
          <el-select
            v-model="addForm.reason_l2"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in levelTwoOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.ename"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="组件原因" prop="reason_l3">
          <el-select
            v-model="addForm.reason_l3"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in levelThreeOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.ename"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部件原因" prop="reason_l4">
          <el-select
            v-model="addForm.reason_l4"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in levelFourOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.ename"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="具体原因-1" prop="reason_detail_1">
          <el-select
            v-model="addForm.reason_detail_1"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in DetailOneOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.cname"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="具体原因-2" prop="reason_detail_2">
          <el-select
            v-model="addForm.reason_detail_2"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in DetailTwoOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.cname"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="备注信息" prop="mt_comment">
        <el-input
          v-model="addForm.mt_comment"
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <!-- 底部按钮区 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="btnCancel">取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="updateItem"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateMalfunction, getReason, getReasonDetail } from '@/api/malfunction'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const reasonRule = (rule, value, callback) => {
      if (this.addForm.reason_main === 'Internal Involuntary Interruptions' ||
            this.addForm.reason_main === 'Voluntary + Not Budget Interruptions') {
        value === '' || value === null ? callback(new Error('请填写所有原因')) : callback()
      }
    }
    return {
      firstTime: true,
      // 表单数据
      addForm: {
        apsa_id: null,
        t_start: '',
        t_end: '',
        stop_count: 0,
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
      // 表单验证规则
      addFormRule: {
        reason_main: [{ required: true, message: '停机原因不能为空', trigger: 'change' }],
        reason_l1: [{ validator: reasonRule, trigger: 'bulr' }],
        reason_l2: [{ validator: reasonRule, trigger: 'bulr' }],
        reason_l3: [{ validator: reasonRule, trigger: 'bulr' }],
        reason_l4: [{ validator: reasonRule, trigger: 'bulr' }],
        reason_detail_1: [{ validator: reasonRule, trigger: 'bulr' }],
        reason_detail_2: [{ validator: reasonRule, trigger: 'bulr' }]
      },
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
      // 各级停机原因选择
      levelOneOptions: [],
      levelTwoOptions: [],
      levelThreeOptions: [],
      levelFourOptions: [],
      DetailOneOptions: [],
      DetailTwoOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'addForm.reason_detail_1': { handler: 'getDetailLevel2' },
    'addForm.reason_l1': { handler: 'getLevel2' },
    'addForm.reason_l2': { handler: 'getLevel3' },
    'addForm.reason_l3': { handler: 'getLevel4' }
  },
  created() {
    this.getLevelOneReasons()
    this.getLevelOneDetails()
  },
  methods: {
    // 获取数据
    getData(item) {
      this.addForm = JSON.parse(JSON.stringify(item))
      this.firstTime = false
    },
    // 获取一级初始化
    async getLevelOneReasons() {
      const res = await getReason({}).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.levelOneOptions = res.reason_list
    },
    async getLevelOneDetails() {
      const res = await getReasonDetail({}).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.DetailOneOptions = res.reason_list
    },
    // 关闭事件
    btnCancel() {
      this.firstTime = true
      this.$emit('update:showDialog', false)
      this.$refs.addFormRef.resetFields()
      // 清空原因列表
      this.levelTwoOptions = []
      this.levelThreeOptions = []
      this.levelFourOptions = []
      this.DetailTwoOptions = []
    },
    // 更新
    async updateItem() {
      try {
        await this.$refs.addFormRef.validate()
      } catch (error) {
        Message.error('表单数据验证失败')
        return
      }

      if (
        this.addForm.reason_main !== 'Internal Involuntary Interruptions' &&
        this.addForm.reason_main !== 'Voluntary + Not Budget Interruptions'
      ) {
        // 不需要填写，清空内容
        this.addForm.reason_l1 = ''
        this.addForm.reason_l2 = ''
        this.addForm.reason_l3 = ''
        this.addForm.reason_l4 = ''
      }
      try {
        await updateMalfunction({ ... this.addForm, change_date: new Date().toLocaleString().replaceAll('/', '-'), change_user: this.userInfo.username })
        // 通知父组件刷新数据
        this.$parent.showEditMaint = false
        Message.success('更新成功')
        this.$parent.getMalfunction()
        this.btnCancel()
      } catch (error) {
        console.log(error)
        Message.error('更新失败')
      }
    },
    // 监控各级原因
    async getDetailLevel2() {
      if (this.addForm.reason_detail_1 === '') {
        this.DetailTwoOptions = []
        this.addForm.reason_detail_2 = ''
        return
      }
      // 获取reasonId
      const levelId = this.DetailOneOptions.filter(x => x.cname === this.addForm.reason_detail_1)[0].id
      // 发送请求
      const res = await getReasonDetail({ 'parent': levelId }).catch(() => {
        Message.error('获取原因失败')
      })
      this.DetailTwoOptions = res.sub_data.subs
      // 如果二级原因出现在例表里则不需要重置
      if (!this.DetailTwoOptions.some(x => x.cname === this.addForm.reason_detail_2)) {
        this.addForm.reason_detail_2 = ''
      }
    },
    async getLevel2() {
      if (this.firstTime === true) {
        return
      }
      if (this.addForm.reason_l1 === '') {
        this.levelTwoOptions = []
        this.addForm.reason_l2 = ''
        return
      }
      const levelId = this.levelOneOptions.filter(x => x.ename === this.addForm.reason_l1)[0].id
      const res = await getReason({ 'parent': levelId }).catch(() => {
        this.$message.error('获取二级原因失败')
      })
      this.levelTwoOptions = res.sub_data.subs
      if (!this.levelTwoOptions.some(x => x.ename === this.addForm.reason_l2)) {
        this.addForm.reason_l2 = ''
      }
    },
    async getLevel3() {
      if (this.firstTime === true) {
        return
      }
      if (this.addForm.reason_l2 === '') {
        this.levelThreeOptions = []
        this.addForm.reason_l3 = ''
        return
      }
      if (this.levelTwoOptions.length === 0) {
        return
      }
      const levelId = this.levelTwoOptions.filter(x => x.ename === this.addForm.reason_l2)[0].id
      const res = await getReason({ 'parent': levelId }).catch(() => {
        this.$message.error('获取三级原因失败')
      })
      this.levelThreeOptions = res.sub_data.subs
      if (!this.levelThreeOptions.some(x => x.ename === this.addForm.reason_l3)) {
        this.addForm.reason_l3 = ''
      }
    },
    async getLevel4() {
      if (this.firstTime === true) {
        return
      }
      if (this.addForm.reason_l3 === '') {
        this.addForm.reason_l4 = ''
        return
      }
      if (this.levelThreeOptions.length === 0) {
        return
      }
      const levelId = this.levelThreeOptions.filter(x => x.ename === this.addForm.reason_l3)[0].id
      const res = await getReason({ 'parent': levelId }).catch(() => {
        this.$message.error('获取四级原因失败')
      })
      this.levelFourOptions = res.sub_data.subs
      if (!this.levelFourOptions.some(x => x.ename === this.addForm.reason_l4)) {
        this.addForm.reason_l4 = ''
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-alert{
  margin-bottom: 15px;
  padding-top: 3px;
  padding-bottom: 4px;
}
::v-deep .el-alert__title {
    font-size: 8px;
}
::v-deep .el-dialog__body {
  padding: 12px 20px 5px !important;
}
</style>
