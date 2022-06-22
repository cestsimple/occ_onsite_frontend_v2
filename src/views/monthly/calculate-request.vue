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
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              :default-time="['00:00:00', '23:59:59']"
              :style="{'width': '260px'}"
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
        date: [],
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
    checkDate(date, day_limit) {
      if (date === '') {
        return true
      }
      let add_day = ''
      if (day_limit !== 0) {
        add_day = `-${day_limit}`
      } else {
        add_day = ''
      }
      return Date.parse(date + add_day) > Date.parse(new Date())
    },
    async calculateFillingMonthly() {
      if (this.checkDate(this.fillingQuery.date, 21)) {
        return Message.error('日期为空或未达到计算日期')
      }
      try {
        await calculateFillingMonthly(this.fillingQuery)
        Message.success('请求成功')
      } catch (error) {
        Message.error('请求失败')
        Message.info(error.response)
      }
    },
    async calculateInvoiceDiff() {
      if (this.checkDate(this.invoiceQuery.date, 0)) {
        return Message.error('日期为空或未达到计算日期')
      }
      try {
        await calculateInvoiceDiff(this.invoiceQuery)
        Message.success('请求成功')
      } catch (error) {
        Message.error('请求失败')
        Message.info(error.response)
      }
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
