<template>
  <el-dialog title="新增充液记录" :visible="showDialog" width="340px" :close-on-click-modal="false" @close="btnCancel">
    <!-- 表单 -->
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRule"
      label-width="80px"
      label-position="left"
      size="mini"
    >
      <el-form-item label="充液储罐" prop="bulk">
        <el-select
          v-model="addForm.bulk"
          filterable
          remote
          placeholder="输入气站中文名或RTU名"
          :remote-method="getBulkList"
          :loading="loading"
          clearable
        >
          <el-option
            v-for="item in bulkList"
            :key="item.id"
            :label="item.site_name + '-' + item.asset_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="time_1">
        <el-date-picker
          v-model="addForm.time_1"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="开始液位" prop="level_1">
        <el-input
          v-model.number="addForm.level_1"
          type="number"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="time_2">
        <el-date-picker
          v-model="addForm.time_2"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="结束液位" prop="level_2">
        <el-input
          v-model.number="addForm.level_2"
          placeholder="仅填写数字"
          type="number"
        />
      </el-form-item>
      <el-form-item label="充液量" prop="quantity">
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
          @click="addFilling"
        >添加记录</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getBulk } from '@/api/bulk'
import { addFilling } from '@/api/filling'
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
      if (this.addForm.time_2 === '') {
        return callback(new Error('结束时间不能为空'))
      }
      Date.parse(this.addForm.time_2) < Date.parse(this.addForm.time_1) ? callback(new Error('结束时间不能小于开始时间')) : callback()
    }
    const levelRule = (rule, value, callback) => {
      if (this.addForm.level_2 === null) {
        return callback(new Error('结束液位不能为空'))
      }
      if (this.addForm.level_2 > 100 || this.addForm.level_2 < 0) {
        return callback(new Error('结束液位必须是0-100的数字'))
      }
      this.addForm.level_2 < this.addForm.level_1 ? callback(new Error('结束液位不能小于开始液位')) : callback()
    }
    return {
      // 表单数据
      addForm: {
        bulk: null,
        time_1: '',
        time_2: '',
        level_1: 0,
        level_2: 0,
        confirm: 1
      },
      // 表单验证规则
      addFormRule: {
        bulk: [{ required: true, message: '储罐不能为空', trigger: 'bulr' }],
        time_1: [{ required: true, message: '开始时间不能为空', trigger: 'bulr' }],
        time_2: [{ required: true, validator: timeRule, trigger: 'bulr' }],
        level_1: [{ required: true, type: 'number', min: 0, max: 100, message: '开始液位不能为空且是0-100的数字', trigger: 'bulr' }],
        level_2: [{ required: true, validator: levelRule, trigger: 'bulr' }]
      },
      // 储罐搜索-Loading标志位
      loading: false,
      // 储罐搜索-列表
      bulkList: []
    }
  },
  methods: {
    async getBulkList(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getBulk({ 'name': query }).catch(error => {
        this.$message.error('无法获取资产列表' + error)
        this.loading = false
        return
      })
      this.bulkList = res
      this.loading = false
    },
    async addFilling() {
      try {
        await this.$refs.addFormRef.validate()
        await addFilling(this.addForm)
        Message.success('添加成功')
        // 通知父组件刷新数据
        this.$parent.getFilling()
        this.btnCancel()
      } catch (error) {
        console.log(error)
        Message.error('添加失败')
      }
    },
    btnCancel() {
      this.addForm = {
        bulk: null,
        time_1: '',
        time_2: '',
        level_1: 0,
        level_2: 0,
        confirm: 1
      }
      this.bulkList = []
      this.$refs.addFormRef.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
.el-dialog{
    margin-top: 7vh !important;
}
</style>
