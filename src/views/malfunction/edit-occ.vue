<template>
  <el-dialog
    :title="editForm.rtu_name + ' - 修改停机记录'"
    :visible="showDialog"
    width="450px"
    top="30px"
    :close-on-click-modal="false"
    @close="btnCancel"
  >
    <el-alert
      :title="`当前用户:${userInfo.username}，上次编辑于: ${editForm.change_user} 在 ${editForm.change_date} `"
      type="info"
      center
      show-icon
      :closable="false"
    />
    <!-- 表单区域 -->
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRule"
      label-width="120px"
      size="mini"
    ><el-form-item label="停机时间" prop="t_start">
       <el-date-picker
         v-model="editForm.t_start"
         type="datetime"
         placeholder="选择日期时间"
         format="yyyy-MM-dd HH:mm"
         value-format="yyyy-MM-dd HH:mm"
       />
     </el-form-item>
      <el-form-item label="开机时间" prop="t_end">
        <el-date-picker
          v-model="editForm.t_end"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="停机次数" prop="stop_count">
        <el-input v-model.number="editForm.stop_count" type="number" />
      </el-form-item>
      <el-form-item label="停机时长" prop="stop_hour">
        <el-input v-model.number="editForm.stop_hour" type="number" />
      </el-form-item>
      <el-form-item label="停机用液消耗" prop="stop_consumption">
        <el-input v-model.number="editForm.stop_consumption" type="number" />
      </el-form-item>
      <el-form-item label="停机标志位" prop="stop_label">
        <el-select
          v-model="editForm.stop_label"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in stopLabelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="停机报警" prop="stop_alarm">
        <el-input v-model="editForm.stop_alarm" :disabled="editForm.stop_label === 'DFT' ? false : true" />
      </el-form-item>
      <el-form-item label="备注信息" prop="occ_comment">
        <el-input
          v-model="editForm.occ_comment"
          type="textarea"
        /> </el-form-item></el-form>
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
import { updateMalfunction } from '@/api/malfunction'
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
    // 自定义表单验证方法
    const dateRule = (rule, value, callback) => {
      if (this.editForm.t_end === '') {
        return callback(new Error('开机时间不能为空'))
      }
      Date.parse(this.editForm.t_end) < Date.parse(this.editForm.t_start) ? callback(new Error('开机时间不能小于停机时间')) : callback()
    }
    const alarmRule = (rule, value, callback) => {
      this.editForm.stop_label === 'DFT' && this.editForm.stop_alarm === '' ? callback(new Error('标志位为DFT时,停机报警不能为空')) : callback()
    }
    // 变量
    return {
      activeIndex: '1',
      // 表单数据
      editForm: {
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
      editFormRule: {
        t_start: [{ required: true, message: '停机时间不能为空', trigger: 'bulr' }],
        t_end: [{ required: true, validator: dateRule, trigger: 'bulr' }],
        stop_count: [{ required: true, message: '停机次数不能为空', trigger: 'bulr' },
          { type: 'number', min: 1, message: '停机次数必须是数字且大于1', trigger: 'bulr' }],
        stop_hour: [{ required: true, message: '停机时长不能为空', trigger: 'bulr' },
          { type: 'number', min: 0, message: '停机时长必须是数字且大于0', trigger: 'bulr' }],
        stop_consumption: [{ required: true, message: '停机用液消耗不能为空', trigger: 'bulr' },
          { type: 'number', min: 0, message: '停机时长必须是数字且大于0', trigger: 'bulr' }],
        stop_alarm: [{ validator: alarmRule, trigger: 'bulr' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    btnCancel() {
      this.editForm = {
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
      }
      this.$refs.editFormRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    getData(item) {
      this.editForm = JSON.parse(JSON.stringify(item))
    },
    async updateItem() {
      try {
        let is_occ = 0
        if (this.userInfo.region === 'occ') {
          is_occ = 1
        } else {
          is_occ = 0
        }
        await this.$refs.editFormRef.validate()
        await updateMalfunction({ ... this.editForm, confirm: is_occ, change_date: new Date().toLocaleString().replaceAll('/', '-'), change_user: this.userInfo.username })
        // 通知父组件刷新数据
        this.$parent.getMalfunction()
        this.btnCancel()
        Message.success('更新成功')
        this.$parent.showEditOcc = false
      } catch (error) {
        console.log(error)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-alert{
  margin-bottom: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
}
::v-deep .el-alert__title {
    font-size: 8px;
}
::v-deep .el-dialog__body {
  padding-top: 15px;
}
</style>
