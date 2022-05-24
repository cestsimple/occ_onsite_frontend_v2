<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/users/' }">用户管理 Users</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/users/role' }">角色管理 Roles</el-breadcrumb-item>
        <el-breadcrumb-item>角色权限管理 Role Permissions</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card v-loading="loading">
        <!-- 区域过滤 新增用户-->
        <el-row :style="{'margin-bottom': '15px'}">
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="showAdd">
              xxx
            </el-button>
          </el-col>
        </el-row>

        <!-- 表单区 -->
        <el-table :data="itemList" border stripe size="mini">
          <el-table-column label="序号" sortable="" type="index" width="45" />
          <el-table-column label="角色名称" sortable="" prop="name" />
          <el-table-column label="描述" sortable="" prop="description" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 弹层区 -->
    <el-dialog title="编辑角色" :visible="showEditDialog" width="350px" @close="btnCancel">
      <el-form
        :model="editForm"
        label-width="90px"
        size="mini"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" size="mini" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" size="mini" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建角色" :visible="showAddDialog" width="350px" @close="btnCancel">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="90px"
        size="mini"
        :rules="addFormRules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" size="mini" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" size="mini" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="createRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, deleteRole, createRole, updateRole } from '@/api/user'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      loading: false,
      itemList: [],
      showAddDialog: false,
      showEditDialog: false,
      editForm: {
        name: null,
        description: null
      },
      addForm: {
        name: null,
        description: null
      },
      addFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'querryInfo.region': function() {
      this.getRoleList()
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const res = await getRole()
        this.itemList = res
        this.loading = false
      } catch (error) {
        Message.error('获取角色列表失败')
        this.loading = false
      }
    },
    // 弹层控制
    showEdit(item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.showEditDialog = true
    },
    btnCancel() {
      this.showAddDialog = false
      this.showEditDialog = false
      this.$refs.addFormRef.resetFields()
      this.editForm = {
        name: null,
        description: null
      }
      this.addForm = {
        name: null,
        description: null
      }
    },
    showAdd() {
      this.showAddDialog = true
    },
    // 角色删除
    async deleteRole(item) {
      if (item.name === '管理员') {
        return Message.error('不可以删除管理员角色')
      }
      try {
        await this.$confirm('删除操作不可逆！ 且角色权限信息将一并删除,请确认')
        await deleteRole(item.id)
        this.getRoleList()
        Message.success('删除成功')
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    // 角色创建
    async createRole() {
      try {
        await this.$refs.addFormRef.validate()
        await createRole(this.addForm)
        this.getRoleList()
        this.showAddDialog = false
        Message.success('创建成功')
      } catch (error) {
        Message.error('创建失败：' + error)
      }
    },
    // 角色更新
    async updateRole() {
      try {
        await updateRole(this.editForm)
        this.getRoleList()
        this.showEditDialog = false
        Message.success('更新成功')
      } catch (error) {
        Message.error('更新失败：' + error)
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding-bottom: 0px;
}

::v-deep .el-dialog__body input {
  width: 200px;
}
</style>
