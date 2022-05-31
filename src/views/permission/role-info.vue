<template>
  <div class="dashboard-container">
    <div class="app-container">

      <el-card v-loading="loading">
        <!-- 区域过滤 新增用户-->
        <el-row :style="{'margin-bottom': '15px'}">
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="showAdd">
              新增角色
            </el-button>
          </el-col>
        </el-row>

        <!-- 表单区 -->
        <el-table :data="itemList" border stripe size="mini">
          <el-table-column align="center" label="序号" sortable="" type="index" width="45" />
          <el-table-column align="center" label="角色名称" sortable="" prop="name" />
          <el-table-column align="center" label="描述" sortable="" prop="description" />
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="showAssignPerm(scope.row)">分配权限</el-button>
              <el-button type="text" size="small" @click="deleteRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 弹层区 -->
    <el-dialog title="编辑角色" :visible="showEditDialog" width="350px" :close-on-click-modal="false" @close="btnCancel">
      <el-form
        ref="editFormRef"
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

    <el-dialog title="创建角色" :visible="showAddDialog" width="350px" :close-on-click-modal="false" @close="btnCancel">
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

    <el-dialog title="分配权限" :visible="showPermDialog" :close-on-click-modal="false" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRole, deleteRole, createRole, updateRole, getPermissionList, getRoleDetail, assignPerm } from '@/api/user'
import { Message } from 'element-ui'
import { transListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    const nameRule = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('角色名不能为空'))
      }
      this.itemList.some(x => x.name === value) ? callback(new Error('角色名已存在')) : callback()
    }
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
        name: [{ required: true, validator: nameRule, trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      },
      // 分配权限
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
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
    // 角色编辑弹层控制
    showEdit(item) {
      if (item.name === '管理员' && (this.userInfo.username !== 'admin' && this.userInfo.username !== 'hoowoo')) {
        Message.info('您无权限编辑管理员角色!')
        return
      }
      this.editForm = JSON.parse(JSON.stringify(item))
      this.showEditDialog = true
    },
    btnCancel() {
      this.showAddDialog = false
      this.showEditDialog = false
      this.editForm = {
        name: null,
        description: null
      }
      this.addForm = {
        name: null,
        description: null
      }
      this.$refs.addFormRef.resetFields()
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
    },
    // 权限分配弹窗控制
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    },
    // 点击分配权限
    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async showAssignPerm(item) {
      if (item.name === '管理员' && (this.userInfo.username !== 'admin' && this.userInfo.username !== 'hoowoo')) {
        Message.info('您无权限分配管理员的角色权限!')
        return
      }
      this.permData = transListToTreeData(await getPermissionList(), null) // 转化list到树形数据
      this.roleId = item.id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(item.id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async  btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
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
.app-container {
    padding-top: 5px;
  }
</style>
