<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>停机报表 Malfunction</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 内容 -->
      <el-card>

        <!-- 搜索框 -->
        <search-bar @queryChanged="queryChanged">
          <el-button slot="before" size="mini" type="primary" @click="exportData">导出Excel</el-button>
          <el-button slot="before" type="primary" size="mini" @click="goAddPage">新增</el-button>
        </search-bar>

        <el-row>
          <el-col :span="24">
            停机原因过滤:
            <el-select
              v-model="query.reason"
              size="mini"
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in mainReasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>

        <!-- 表单区 -->
        <el-table
          v-loading="loading"
          :data="list"
          border
          stripe
          size="mini"
          :highlight-current-row="true"
        >
          <el-table-column type="index" label="#" width="35" />
          <el-table-column
            label="RTU Name"
            prop="rtu_name"
            width="130"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="开始时间"
            prop="t_start"
            width="125"
          />
          <el-table-column
            label="结束时间"
            prop="t_end"
            width="125"
          />
          <el-table-column
            label="停机次数"
            prop="stop_count"
            width="70"
          />
          <el-table-column
            label="停机时长"
            prop="stop_hour"
            width="70"
          />
          <el-table-column
            label="停机用液"
            prop="stop_consumption"
            width="75"
          />
          <el-table-column
            label="平均用液"
            prop="avg_con"
            width="75"
          />
          <el-table-column
            label="标志位"
            prop="stop_label"
            width="65"
          />
          <el-table-column
            label="停机报警"
            prop="stop_alarm"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="停机原因" prop="reason_main" :show-overflow-tooltip="true" />
          <el-table-column label="过程组原因" prop="reason_l1" :show-overflow-tooltip="true" />
          <el-table-column label="设备原因" prop="reason_l2" />
          <el-table-column label="组件原因" prop="reason_l3" />
          <el-table-column label="部件原因" prop="reason_l4" />
          <el-table-column label="具体原因-1" prop="reason_detail_1" />
          <el-table-column label="具体原因-2" prop="reason_detail_2" />
          <el-table-column label="OCC备注" prop="occ_comment" :show-overflow-tooltip="true" />
          <el-table-column label="维修备注" prop="mt_comment" :show-overflow-tooltip="true" />
          <el-table-column label="操作" :width="buttonColWidth" fixed="right">
            <template slot-scope="scope">
              <!-- OCC修改按钮 -->
              <el-button
                :type="scope.row.confirm === 0? 'primary' : 'success'"
                icon="el-icon-edit"
                size="mini"
                @click="editMalfunctionOcc(scope.row)"
              />
              <!-- Maint修改按钮 -->
              <el-button
                :type="scope.row.reason_main === ''? 'warning' : 'success'"
                icon="el-icon-setting"
                size="mini"
                @click="editMalfunctionMaint(scope.row)"
              />
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteMalfunction(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          :current-page="query.page"
          :page-sizes="[10, 15, 20, 50]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
    <!-- 编辑，新增弹层 -->
    <add-malfunction :show-dialog.sync="showAddDialog" />
    <edit-occ ref="editOcc" :show-dialog.sync="showEditOcc" />
    <edit-maint ref="editMaint" :show-dialog.sync="showEditMaint" />
  </div>
</template>

<script>
import { getMalfunction, deleteMalfunction } from '@/api/malfunction'
import { Message } from 'element-ui'
import AddMalfunction from './add-malfunction'
import EditOcc from './edit-occ'
import EditMaint from './edit-maint'
export default {
  components: { AddMalfunction, EditOcc, EditMaint },
  data() {
    return {
      list: [],
      total: 0,
      query: {
        page: 1,
        pagesize: 10,
        name: '',
        start: '',
        end: '',
        region: '',
        group: '',
        reason: []
      },
      loading: false,
      showAddDialog: false,
      showEditOcc: false,
      showEditMaint: false,
      buttonColWidth: '173px',
      // 主要原因选择
      mainReasonOptions: [
        {
          value: 'Budget Maintenance Interruptions',
          label: '计划内保养'
        },
        {
          value: 'Internal Involuntary Interruptions',
          label: '内部被动原因'
        },
        {
          value: 'Voluntary + Not Budget Interruptions',
          label: '主动无预算'
        },
        {
          value: 'External Interruptions',
          label: '外部原因'
        },
        {
          value: 'Disuse by Customer',
          label: '客户停用'
        }
      ]
    }
  },
  watch: {
    'query.reason': function() {
      this.getMalfunction()
    }
  },
  methods: {
    // 搜索框方法
    async queryChanged(query) {
      this.query.name = query.name
      this.query.start = query.start
      this.query.end = query.end
      this.query.region = query.region
      this.query.group = query.group
      this.query.page = 1
      this.getMalfunction()
    },
    // 新增按钮
    goAddPage() {
      this.showAddDialog = true
    },
    // 分页器方法
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getMalfunction()
    },
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getMalfunction()
    },
    // Malfunction方法
    async getMalfunction() {
      this.loading = true
      try {
        const res = await getMalfunction(this.query)
        this.list = res.list
        this.total = res.total
      } catch (error) {
        Message.error('获取停机列表失败')
      }
      this.loading = false
    },
    async deleteMalfunction(item) {
      try {
        await this.$confirm('确定删除该记录')
        await deleteMalfunction(item.id)
        Message.success('删除成功')
        this.getMalfunction()
      } catch (error) {
        Message.error('删除失败：' + error)
      }
    },
    editMalfunctionOcc(item) {
      this.$refs.editOcc.getData(item)
      this.showEditOcc = true
    },
    editMalfunctionMaint(item) {
      this.$refs.editMaint.getData(item)
      this.showEditMaint = true
    },
    // 导出数据
    exportData() {
      // 验证有无数据
      if (this.total === 0) {
        return Message.error('请先刷新数据后再下载')
      }
      // 定义表头对应json key
      const headers = {
        'RTU名': 'rtu_name',
        '资产编号': 'facility_fin',
        '开始时间': 't_start',
        '结束时间': 't_end',
        '停机时长': 'stop_hour',
        '停机液氮消耗': 'stop_consumption',
        '停机标志位': 'stop_label',
        '停机报警': 'stop_alarm',
        '停机原因': 'reason_main',
        '具体原因-1': 'reason_detail_1',
        '具体原因-2': 'reason_detail_2',
        '过程组原因': 'reason_l1',
        '设备原因': 'reason_l2',
        '组件原因': 'reason_l3',
        '部件原因': 'reason_l4',
        'OCC备注': 'occ_comment',
        '维修备注': 'mt_comment',
        '上次修改时间': 'change_date',
        '上次修改者': 'change_user'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        // 获取全部数据
        const res = await getMalfunction({ ...this.query, pagesize: this.total })
        // 转化Json数据至[[]]格式
        const data = this.formatJson(headers, res.list)
        // 导出
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: `停机报表_${this.query.start}_${this.query.region === '' ? '全部区域' : this.query.region}`,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是对象
        return Object.keys(headers).map(key => {
          return item[headers[key]]
        })
      })
    }
  }
}
</script>

<style scoped>
  ::v-deep .demo-table-expand {
      width: 80%;
      font-size: 0px;
  }
  ::v-deep .demo-table-expand label {
    width: 85px;
    color: #99a9bf;
  }
  ::v-deep .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    height: 32px;
  }
</style>
