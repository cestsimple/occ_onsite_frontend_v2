<template>
  <el-dialog :title="`分配角色 - ${userInfo.first_name}`" :visible="showDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
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
        <el-button size="mini" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="assignRole">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getUserById, getRole, assignRole } from '@/api/user'
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
      userInfo: {
        id: null,
        username: null,
        region: null,
        group: null,
        level: null,
        first_name: '',
        email: '',
        is_staff: null
      },
      roleItems: [],
      roleIds: []
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
        this.roleIds = res.roles
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
    },
    // 关闭弹层
    btnCancel() {
      this.roleIds = []
      this.userInfo = {
        id: null,
        username: null,
        region: null,
        group: null,
        level: null,
        first_name: '',
        email: '',
        is_staff: null
      }
      this.$emit('update:showDialog', false)
    },
    // 设置用户角色
    async assignRole() {
      try {
        await assignRole({ id: this.userInfo.id, roleIds: this.roleIds })
        Message.success('设置成功')
        this.btnCancel()
        this.$parent.getUserList()
      } catch (error) {
        Message.error('设置失败')
      }
    }

  }
}
</script>

<style>

</style>
