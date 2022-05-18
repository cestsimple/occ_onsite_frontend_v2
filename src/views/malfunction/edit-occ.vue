<template>
  <el-dialog
    :title="editForm.rtu_name + ' - 修改停机记录'"
    :visible="showDialog"
    width="450px"
    top="30px"
    @close="btnCancel"
  >
    <!-- 表单区域 -->
    <el-form
      ref="editFormRef"
      :model="editForm"
      label-width="100px"
      size="mini"
    ><el-form-item label="开始时间" prop="t_start">
       <el-date-picker
         v-model="editForm.t_start"
         type="datetime"
         placeholder="选择日期时间"
         format="yyyy-MM-dd HH:mm"
         value-format="yyyy-MM-dd HH:mm"
       />
     </el-form-item>
      <el-form-item label="结束时间" prop="t_end">
        <el-date-picker
          v-model="editForm.t_end"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="停机次数" prop="stop_count">
        <el-input v-model="editForm.stop_count" />
      </el-form-item>
      <el-form-item label="停机时长" prop="stop_hour">
        <el-input v-model="editForm.stop_hour" />
      </el-form-item>
      <el-form-item label="停机用液消耗" prop="stop_consumption">
        <el-input v-model="editForm.stop_consumption" />
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
        <el-input v-model="editForm.stop_alarm" />
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
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
      ]
    }
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
        await updateMalfunction(this.editForm)
        // 通知父组件刷新数据
        this.$parent.getMalfunction()
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
        Message.success('更新成功')
        this.$parent.showEditOcc = false
      } catch (error) {
        console.log(error.response)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style>

</style>
