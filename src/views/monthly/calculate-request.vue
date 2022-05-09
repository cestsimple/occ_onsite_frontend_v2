<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 充液月报 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>月度充液 Monthly Filling</span>
          <el-button style="float: right; padding: 3px 20px" type="text" @click="calculateFillingMonthly">发送请求</el-button>
        </div>
        <el-row>
          <el-col :span="8">
            <el-date-picker
              v-model="fillingQuery.date"
              type="month"
              placeholder="选择月份"
              size="mini"
              value-format="yyyy-MM"
            />
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="fillingQuery.region"
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
        </el-row>

      </el-card>

      <!-- Invoice变量 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>开票变量 Invoice Diff</span>
          <el-button style="float: right; padding: 3px 20px" type="text" @click="calculateInvoiceDiff">发送请求</el-button>
        </div>
        <el-row>
          <el-col :span="8">
            <el-date-picker
              v-model="invoiceQuery.date"
              type="date"
              placeholder="选择日期"
              size="mini"
              value-format="yyyy-MM-dd"
            />
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="invoiceQuery.region"
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
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { calculateFillingMonthly, calculateInvoiceDiff } from '@/api/manuel'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      fillingQuery: {
        date: '',
        region: ''
      },
      invoiceQuery: {
        date: '',
        region: ''
      },
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
      ]
    }
  },
  methods: {
    checkDate(date) {
      const today = new Date()

      if (today.getMonth() + 1 === parseInt(date.split('-')[1])) {
        return today.getDay() <= 20
      }
      if (today.getMonth() + 1 > parseInt(date.split('-')[1])) {
        return 0
      }
      return 1
    },
    async calculateFillingMonthly() {
      if (this.fillingQuery.date === '') {
        return Message.error('请选择日期')
      }
      if (this.checkDate(this.fillingQuery.date)) {
        return Message.error('未达到计算日期')
      }
      await calculateFillingMonthly(this.fillingQuery).catch(error => {
        Message.error('请求失败')
        console.log(error)
        Message.info(error.response)
      })
      Message.success('请求成功')
    },
    async calculateInvoiceDiff() {
      if (this.invoiceQuery.date === '') {
        return Message.error('请选择日期')
      }
      if (this.checkDate(this.invoiceQuery.date)) {
        return Message.error('未达到计算日期')
      }
      await calculateInvoiceDiff(this.invoiceQuery).catch(error => {
        Message.error('请求失败')
        Message.info(error.response)
      })
      Message.success('请求成功')
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-card {
    margin-bottom: 20px;
    width: 85%;
  }
</style>
