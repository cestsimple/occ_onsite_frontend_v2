<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="6">
          <el-date-picker
            v-model="query.date"
            type="date"
            placeholder="选择日期"
            size="mini"
            value-format="yyyy-MM-dd"
          />
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="query.region"
            size="mini"
            clearable
            placeholder="请选择地区"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button size="mini" type="primary" @click="getItemList">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 报表区 -->
      <el-table :data="itemList" border stripe size="mini" empty-text="暂无数据，请添加条件后搜索">
        <el-table-column type="index" label="#" width="35" />
        <el-table-column
          label="日期"
          prop="date"
          width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="RTU Name" prop="rtu_name" />
        <el-table-column label="变量名" prop="variable_name" />
        <el-table-column
          label="上月数值"
          prop="start"
          align="right"
        >
          <template slot-scope="scope">
            <div :style="scope.row.start === 0 ? {'color': 'red'} : ''">{{ scope.row.start }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="本月数值"
          prop="end"
          align="right"
        >
          <template slot-scope="scope">
            <div :style="scope.row.end === 0 ? {'color': 'red'} : ''">{{ scope.row.end }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="差值"
          prop="diff"
          align="right"
        >
          <template slot-scope="scope">
            {{ scope.row.diff | twoDigits }}
          </template>
        </el-table-column>
        <el-table-column label="修正" width="65" fixed="right">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        :current-page="query.page"
        :page-sizes="[15, 20, 50, 100, 999]"
        :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹层 -->
    <el-dialog :title="`${editForm.rtu_name} ${editForm.variable_name}`" :visible="showDialog" width="20%" @close="btnCancel">
      <!-- 表单区 -->
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRule"
        label-width="80px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="上月数值" prop="start">
          <el-input
            v-model="editForm.start"
          />
        </el-form-item>
        <el-form-item label="本月数值" prop="end">
          <el-input
            v-model="editForm.end"
          />
        </el-form-item>
        <el-form-item label="差值(自动计算)" prop="quantity">
          <el-input
            v-model="editForm.diff"
            disabled
          />
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col>
          <el-button
            type="danger"
            size="mini"
            class="btnAdd"
            @click="btnCancel"
          >取消</el-button><el-button
            type="primary"
            size="mini"
            class="btnAdd"
            @click="updateItem"
          >提交修改</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getInvoiceDiff, updateInvoiceDiff } from '@/api/invoice-diff'
import { Message } from 'element-ui'
export default {
  filters: {
    twoDigits(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      total: 0,
      query: {
        page: 1,
        pagesize: 15,
        date: '',
        region: '',
        usage: 'invoice'
      },
      itemList: [],
      regionOptions: [
        {
          value: '',
          label: '所有区域'
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
      editForm: {
        id: 0,
        date: '',
        rtu_name: '',
        start: 0.0,
        end: 0.0,
        diff: 0.0,
        confirm: 0
      },
      editFormRule: {},
      showDialog: false,
      originDiff: {
        start: 0,
        end: 0
      }
    }
  },
  methods: {
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getItemList()
    },
    // 监听 页码 变化的函数
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getItemList()
    },
    async getItemList() {
      if (this.query.date === '') {
        return Message.error('请选择日期')
      }
      const res = await getInvoiceDiff(this.query).catch(() => {
        Message.error('获取数据失败')
      })
      this.itemList = res.list
      this.total = res.total
    },
    showEditDialog(item) {
      this.originDiff.start = item.start
      this.originDiff.end = item.end
      this.editForm = JSON.parse(JSON.stringify(item))
      this.showDialog = true
    },
    btnCancel() {
      this.showDialog = false
      this.editForm = {
        id: 0,
        date: '',
        rtu_name: '',
        start: 0.0,
        end: 0.0,
        diff: 0.0,
        confirm: 0
      }
      this.originDiff = {
        start: 0,
        end: 0
      }
    },
    calDiff() {
      const originD = (this.originDiff.start - this.originDiff.end) * this.editForm.tank_size / 100
      const nowD = (this.editForm.start - this.editForm.end) * this.editForm.tank_size / 100
      this.editForm.quantity -= originD - nowD
      this.originDiff.start = this.editForm.start
      this.originDiff.end = this.editForm.end
    },
    async updateItem() {
      this.calDiff()
      await updateInvoiceDiff(this.editForm).catch(() => {
        Message.error('更新失败')
      })
      Message.success('更新成功')
      this.getItemList()
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-row {
    margin-bottom: 15px;
  }
</style>
