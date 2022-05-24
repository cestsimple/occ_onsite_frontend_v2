<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- 多选框组 -->
    <el-checkbox-group>
      <!-- 循环选项 -->
      <el-checkbox v-for="item in roleItems" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
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
import { getUserById, getRole } from '@/api/user'
import { Message } from 'element-ui'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleItems: []
    }
  },
  methods: {
    // 传入用户id查询数据
    async getUserInfo(id) {
      try {
        // 先获取角色列表
        await this.getRole()
        const res = await getUserById(id)
        this.userInfo = res
      } catch (error) {
        Message.error('获取用户信息失败')
      }
    },
    // 查询角色信息
    async getRole() {
      try {
        const res = await getRole()
        this.roleItems = res
      } catch (error) {
        Message.error('获取角色列表失败')
      }
    }
  }
}
</script>

<style>

</style>
