<template>
  <el-dialog :title="`修改充液记录- ${editForm.rtu_name}`" :visible="showDialog" width="35%" @close="btnCancel">
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
        <el-input v-model="editForm.asset_name" />
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
          v-model="editForm.level_1"
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
          v-model="editForm.level_2"
          placeholder="仅填写数字"
        />
      </el-form-item>
      <el-form-item label="充液量" prop="level_1">
        <el-input disabled placeholder="自动计算，无需填写" />
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
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
      </el-col>
    </el-row>
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
    },
    editItem: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      // 表单验证规则
      editFormRule: {},
      editForm: {}
    }
  },
  watch: {
    editItem: function() {
      this.editForm = this.editItem
    }
  },
  methods: {
    btnCancel() {
      this.editForm = {
        rtu_name: ''
      }
      this.$refs.editFormRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    async updateFilling() {
      try {
        await updateFilling(this.editForm)
        // 通知父组件刷新数据
        this.$parent.getFilling()
        this.editForm = {
          rtu_name: ''
        }
        this.$refs.editFormRef.resetFields()
        this.$parent.showEditDialog = false
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
