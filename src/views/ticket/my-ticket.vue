<template>
  <div class="dashboard-container">
    <div class="app-container">

      <el-card v-loading="loading">
        <!-- 新增按钮-->
        <el-row :style="{'margin-bottom': '15px'}">
          <el-col :span="3">
            <el-button type="primary" size="mini" @click="addPermission(null)">
              新增页面访问权
            </el-button>
          </el-col>
        </el-row>

        <!-- 表单区 -->
        <el-table :data="list" border="" row-key="id" size="mini">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="路径或标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button v-if="row.parent === null" type="text" @click="addPermission(row.id)">添加权限点</el-button>
              <el-button type="text" @click="editPermission(row)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>

      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="showText" :visible="showDialog" width="380px" :close-on-click-modal="false" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perFormRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="路径或标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="12">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, updatePermission, createPermission, deletePermission } from '@/api/user'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      loading: false,
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        parent: '' // 因为做的是树 需要知道添加到哪个节点下了
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      if (this.formData.id) {
        if (this.formData.parent === null) {
          return '编辑页面访问权'
        }
        return '编辑权限点'
      } else {
        if (this.formData.parent === null) {
          return '新增页面访问权'
        }
        return '新增权限点'
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所有权限数据
    async  getPermissionList() {
      this.loading = true
      const perm_list = await getPermissionList()
      this.list = transListToTreeData(perm_list, null)
      this.loading = false
    },
    // 关闭弹层
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        parent: '' // 因为做的是树 需要知道添加到哪个节点下了
      }
      this.$refs.perFormRef.resetFields()
      this.showDialog = false
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await deletePermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
        this.$message.success('删除失败')
      }
    },
    // 提交修改或创建
    btnOK() {
      this.$refs.perFormRef.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return createPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    // 新增弹窗
    addPermission(pid) {
      this.formData.parent = pid
      this.showDialog = true
    },
    // 编辑弹窗
    async editPermission(data) {
      // 根据获取id获取详情
      this.formData = JSON.parse(JSON.stringify(data))
      this.showDialog = true
    }
  }
}
</script>

<style scoped>
  .app-container {
    padding-top: 5px;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
