<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- 多选框组 -->
    <el-checkbox-group>
      <!-- 循环选项 -->
    </el-checkbox-group>
    <!-- footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="mini">取消</el-button>
        <el-button type="primary" size="mini">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getUserById } from '@/api/user'
import { Message } from 'element-ui'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getUserInfo(id) {
      try {
        const res = await getUserById(id)
        this.userInfo = res
      } catch (error) {
        Message.error('获取用户信息失败')
      }
    }
  }
}
</script>

<style>

</style>
