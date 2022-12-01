<template>
  <!-- 外层容器 -->
  <div class="page-component__scroll">
    <!-- 竖向折叠面板 -->
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="1">
        <template slot="title">
          <el-tag type="success" effect="dark">我申请的</el-tag>
        </template>
        <div class="app-container">
          <el-row class="search-bar">
            <el-col :span="22">
              任务状态:
              <el-select
                v-model="query.status"
                size="mini"
                placeholder="是否完成"
              >
                <el-option
                  :key="0"
                  label="所有"
                  :value="0"
                />
                <el-option
                  :key="1"
                  label="进行中"
                  :value="1"
                  selected
                />
                <el-option
                  :key="9"
                  label="已完成"
                  :value="9"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" @click="getMyTaskList">刷新</el-button>
            </el-col>
          </el-row>
          <div class="task-list-table">
            <el-table border stripe size="mini" :data="task_list">
              <el-table-column type="index" label="#" width="45px" />
              <el-table-column label="任务名" prop="name" />
              <el-table-column label="项目名称" prop="project_name" />
              <el-table-column label="当前环节" prop="current_node_name" />
              <el-table-column label="下一环节" prop="next_node_name" />
              <el-table-column label="下一环节负责人" prop="next_charge" />
              <el-table-column label="创建时间" prop="created_at" width="115px" />
              <el-table-column label="最后更新时间" prop="updated_at" width="115px" />
              <el-table-column label="任务状态" prop="status" width="70px">
                <template slot-scope="scope">
                  {{ scope.row.status === 1 ? '进行中' : '已结束' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="65px">
                <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-search"
                    size="mini"
                    @click="openTaskDialog(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页器 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 50]"
            :page-size="query.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_task_list"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-collapse-item>

      <!-- 2号风琴折页 -->
      <el-collapse-item name="2">
        <!-- 自定义风琴标题 -->
        <template slot="title">
          <el-badge :value="total_task_todo" class="item">
            <el-tag effect="dark">待我处理的</el-tag>
          </el-badge>

        </template>

        <div class="app-container">
          <!-- 搜索框 -->
          <el-row class="search-bar">
            <el-col :span="22">
              任务状态:
              <el-select
                v-model="todo_query.status"
                size="mini"
                placeholder="是否完成"
              >
                <el-option
                  :key="0"
                  label="所有"
                  :value="0"
                />
                <el-option
                  :key="1"
                  label="进行中"
                  :value="1"
                  selected
                />
                <el-option
                  :key="9"
                  label="已完成"
                  :value="9"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" @click="getMyTodoTask">刷新</el-button>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <div class="task-list-table">
            <el-table border stripe size="mini" :data="todo_task_list">
              <el-table-column type="index" label="#" width="45px" />
              <el-table-column label="任务名" prop="name" />
              <el-table-column label="项目名称" prop="project_name" />
              <el-table-column label="当前环节" prop="current_node_name" />
              <el-table-column label="下一环节" prop="next_node_name" />
              <el-table-column label="下一环节负责人" prop="next_charge" />
              <el-table-column label="创建时间" prop="created_at" width="115px" />
              <el-table-column label="最后更新时间" prop="updated_at" width="115px" />
              <el-table-column label="任务状态" prop="status" width="70px">
                <template slot-scope="scope">
                  {{ scope.row.status === 1 ? '进行中' : '已结束' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="65px">
                <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-thumb"
                    size="mini"
                    @click="openTaskDialog(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 回到顶部 -->
    <el-backtop :bottom="50" :visibility-height="100" />
  </div>
</template>

<script>
import { getTaskList, getTaskMyTodo } from '@/api/ticket'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      activeNames: ['1'],
      task_list: [],
      todo_task_list: [],
      total_task_list: 0,
      total_task_todo: 0,
      query: {
        page: 1,
        pagesize: 10,
        user: '',
        status: 1
      },
      todo_query: {
        user: '',
        status: 1
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'query.status': function() {
      this.getMyTaskList()
    }
  },
  created() {
    this.getMyTaskList()
    this.getMyTodoTask()
  },
  methods: {
    // 分页器方法
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.query.page = 1
      this.getMyTaskList()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getMyTaskList()
    },
    // 获取所有Task数据
    async  getMyTaskList() {
      this.loading = true
      this.query.user = this.userInfo.username
      const tasks_rsp = await getTaskList(this.query)
      this.total_task_list = tasks_rsp.total
      this.task_list = tasks_rsp.list
      this.loading = false
    },
    async getMyTodoTask() {
      this.loading = true
      this.todo_query.user = this.userInfo.username
      const tasks_rsp = await getTaskMyTodo(this.todo_query)
      this.total_task_todo = tasks_rsp.total
      this.todo_task_list = tasks_rsp.list
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
    // 查看弹窗
    openTaskDialog(scope) {
      console.log(scope)
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
