<template>
  <el-dialog :title="`修改充液记录- ${editForm.rtu_name}`" :visible="showDialog" width="340px" :close-on-click-modal="false" @close="btnCancel">
    <!-- 表单 -->
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRule"
      label-width="80px"
      label-position="left"
      size="mini"
    >
      <el-form-item label="充液储罐" prop="bulk">
        <el-input v-model="editForm.asset_name" disabled />
      </el-form-item>
      <el-form-item label="开始时间" prop="time_1">
        <el-date-picker
          v-model="editForm.time_1"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="开始液位" prop="level_1">
        <el-input
          v-model.number="editForm.level_1"
          type="number"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="time_2">
        <el-date-picker
          v-model="editForm.time_2"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束液位" prop="level_2">
        <el-input
          v-model.number="editForm.level_2"
          type="number"
          placeholder="仅填写数字"
        />
      </el-form-item>
      <el-form-item label="充液量" prop="quantity">
        <el-input disabled placeholder="自动计算，无需填写" />
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="mini"
        class="btnAdd"
        @click="btnCancel"
      >取消</el-button><el-button
        type="primary"
        size="mini"
        class="btnAdd"
        @click="updateFilling"
      >更新数据</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateFilling } from '@/api/filling'
import { Message } from 'element-ui'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const timeRule = (rule, value, callback) => {
      if (this.editForm.time_2 === '') {
        return callback(new Error('结束时间不能为空'))
      }
      Date.parse(this.editForm.time_2) < Date.parse(this.editForm.time_1) ? callback(new Error('结束时间不能小于开始时间')) : callback()
    }
    const levelRule = (rule, value, callback) => {
      if (this.editForm.level_2 === null) {
        return callback(new Error('结束液位不能为空'))
      }
      if (this.editForm.level_2 > 100 || this.editForm.level_2 < 0) {
        return callback(new Error('结束液位必须是0-100的数字'))
      }
      this.editForm.level_2 < this.editForm.level_1 ? callback(new Error('结束液位不能小于开始液位')) : callback()
    }
    return {
      // 表单验证规则
      editFormRule: {
        time_1: [{ required: true, message: '开始时间不能为空', trigger: 'bulr' }],
        time_2: [{ required: true, validator: timeRule, trigger: 'bulr' }],
        level_1: [{ required: true, type: 'number', min: 0, max: 100, message: '开始液位不能为空且是0-100的数字', trigger: 'bulr' }],
        level_2: [{ required: true, validator: levelRule, trigger: 'bulr' }]
      },
      editForm: {}
    }
  },
  methods: {
    // 传入编辑值
    getData(item) {
      this.editForm = JSON.parse(JSON.stringify(item))
    },
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.editForm = {
        rtu_name: ''
      }
      this.$refs.editFormRef.resetFields()
    },
    async updateFilling() {
      try {
        await this.$refs.editFormRef.validate()
        await updateFilling(this.editForm)
        Message.success('修改成功')
        // 通知父组件刷新数据
        this.$parent.getFilling()
        this.btnCancel()
      } catch (error) {
        console.log(error.response)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style>
.el-dialog{
    margin-top: 7vh !important;
}
</style>
