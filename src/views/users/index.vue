<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理 Users</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card v-loading="loading">
        <!-- 区域过滤 新增用户-->
        <el-row :style="{'margin-bottom': '15px'}">
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="showAdd">
              新增用户
            </el-button>
          </el-col>
          <el-col :span="21">
            <span>区域过滤：</span>
            <el-select v-model="querryInfo.region" placeholder="请选择" size="mini">
              <el-option
                v-for="item in regionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>

        <!-- 表单区 -->
        <el-table :data="itemList" border stripe size="mini">
          <el-table-column label="序号" sortable="" type="index" width="45" />
          <el-table-column label="账号" sortable="" prop="username" />
          <el-table-column label="姓名" sortable="" prop="first_name" />
          <el-table-column label="区域" sortable="" prop="region" width="115" />
          <el-table-column label="分组" sortable="" prop="group" width="90" />
          <el-table-column label="角色" prop="roles">
            <template slot-scope="{row}">
              <el-tag v-for="item, index in row.roles" :key="index" :type="item===1?'success':item===2? '' : 'info'" size="mini">
                {{ roleItems.filter(x=> x.id === item)[0].name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="showRoleEdit(scope.row)">角色分配</el-button>
              <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          :current-page="querryInfo.page"
          :page-sizes="[15, 20, 50, 999]"
          :page-size="querryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>

    <!-- 弹层区 -->
    <el-dialog title="编辑账户基础信息" :visible="showEditDialog" width="350px" :close-on-click-modal="false" @close="btnCancel">
      <el-form
        :model="editForm"
        label-width="70px"
        size="mini"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="editForm.username" size="mini" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="first_name">
          <el-input v-model="editForm.first_name" size="mini" />
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-select v-model="editForm.region" placeholder="请选择区域" size="mini">
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-input v-model="editForm.group" size="mini" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" size="mini" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="btnCancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="updateUser">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="创建用户" :visible="showAddDialog" width="350px" :close-on-click-modal="false" @close="btnCancel">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="70px"
        size="mini"
        :rules="addFormRules"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username" size="mini" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" size="mini" />
        </el-form-item>
        <el-form-item label="姓名" prop="first_name">
          <el-input v-model="addForm.first_name" size="mini" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" size="mini" />
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-select v-model="addForm.region" placeholder="请选择区域" size="mini">
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-input v-model="addForm.group" size="mini" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="10">
          <el-button size="mini" @click="btnCancel">取 消</el-button>
          <el-button type="primary" size="mini" @click="createUser">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配角色 -->
    <role-assign ref="editRoleRef" :show-dialog.sync="showRoleAssign" />
  </div>
</template>

<script>
import { getUser, updateUser, deleteUser, createUser, getRole } from '@/api/user'
import { Message } from 'element-ui'
import RoleAssign from './role-assign.vue'
import { mapGetters } from 'vuex'
export default {
  components: { RoleAssign },
  data() {
    return {
      loading: false,
      total: 0,
      querryInfo: {
        region: '',
        page: 1,
        pagesize: 20,
        engineer: null
      },
      itemList: [],
      regionOptions: [
        {
          value: '',
          label: '所有区域'
        },
        {
          value: 'OCC',
          label: 'OCC'
        },
        {
          value: 'ALEC_S_A',
          label: '华东A'
        },
        {
          value: 'ALEC_S_B',
          label: '华东B'
        },
        {
          value: 'ALJY',
          label: '江阴'
        },
        {
          value: 'ALYZ',
          label: '扬州'
        },
        {
          value: 'ALWH',
          label: '武汉'
        },
        {
          value: 'ALTJ',
          label: '天津'
        },
        {
          value: 'ALSD',
          label: '山东'
        },
        {
          value: 'ALCD',
          label: '成都'
        },
        {
          value: 'ALGD',
          label: '广东'
        }
      ],
      showAddDialog: false,
      showEditDialog: false,
      showRoleAssign: false,
      editForm: {
        id: null,
        username: null,
        first_name: null,
        region: null,
        group: null,
        email: null,
        password: null
      },
      addForm: {
        username: null,
        password: null,
        first_name: null,
        region: null,
        group: null,
        email: '',
        level: 0
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        first_name: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        region: [{ required: true, message: '请选择区域', trigger: 'blur' }]
      },
      roleItems: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'querryInfo.region': function() {
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    handleSizeChange(newSize) {
      this.querryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码 变化的函数
    handleCurrentChange(newPage) {
      this.querryInfo.page = newPage
      this.getUserList()
    },
    async getUserList() {
      this.loading = true
      const { total, list } = await getUser(this.querryInfo)
      this.total = total
      this.itemList = list
      this.loading = false
    },
    async getRoleList() {
      try {
        const res = await getRole()
        this.roleItems = res
      } catch (error) {
        Message.error('获取角色列表失败')
      }
    },
    // 弹层控制
    showEdit(user) {
      if (this.userInfo.username !== 'hoowoo' && this.userInfo.username !== 'admin') {
        Message.info('无权限修改管理员账户')
        return
      }
      this.editForm = JSON.parse(JSON.stringify(user))
      this.showEditDialog = true
    },
    btnCancel() {
      this.showAddDialog = false
      this.showEditDialog = false
      this.$refs.addFormRef.resetFields()
      this.editForm = {
        id: null,
        username: null,
        first_name: null,
        region: null,
        group: null,
        email: null,
        password: null
      }
      this.addForm = {
        username: null,
        password: null,
        first_name: null,
        region: null,
        group: null,
        email: null
      }
    },
    showAdd() {
      this.showAddDialog = true
    },
    // 用户操作
    async deleteUser(item) {
      if (item.username === 'admin') {
        return Message.error('不可以删除管理员账户')
      }
      try {
        await this.$confirm('删除操作不可逆！ 且角色信息将一并删除,请确认')
        await deleteUser(item.id)
        Message.success('删除成功')
        this.getUserList()
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    async updateUser() {
      if (this.editForm.group === null) {
        this.editForm.group = ''
      }
      this.editForm.region = this.editForm.region.toUpperCase()
      this.editForm.group = this.editForm.group.toUpperCase()
      try {
        await updateUser({ ...this.editForm, level: 0 })
        Message.success('信息更新成功')
        this.getUserList()
        this.showEditDialog = false
      } catch (error) {
        Message.error('信息更新失败：' + error)
      }
    },
    async createUser() {
      if (this.addForm.group === null) {
        this.addForm.group = ''
      }
      this.addForm.region = this.addForm.region.toUpperCase()
      this.addForm.group = this.addForm.group.toUpperCase()
      try {
        await this.$refs.addFormRef.validate()
        await createUser(this.addForm)
        Message.success('用户创建成功')
        this.getUserList()
        this.showAddDialog = false
      } catch (error) {
        Message.error('用户创建失败：' + error)
      }
    },
    // 编辑用户role
    async showRoleEdit(item) {
      if (this.userInfo.username !== 'hoowoo' && this.userInfo.username !== 'admin') {
        Message.info('无权限修改管理员账户')
        return
      }
      await this.$refs.editRoleRef.getUserInfo(item.id)
      this.showRoleAssign = true
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
