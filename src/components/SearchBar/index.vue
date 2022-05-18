<template>
  <!-- 搜索与添加 -->
  <el-row :gutter="20" :style="{'margin-bottom': '15px'}">
    <el-col :span="4">
      <!-- 插槽 -->
      <slot name="before" /></el-col>
    <el-col :span="8">
      <el-date-picker
        v-model="date"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        :default-time="['00:00:00', '23:59:59']"
        size="mini"
        :style="{'width': '345px'}"
      />
    </el-col>
    <el-col :span="3">
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
    <el-col
      :span="groupFilterWidth"
    ><el-select
      v-model="query.group"
      placeholder="请选具体维修/分组"
      size="mini"
    >
      <el-option
        v-for="item in groupOptions"
        :key="item.first_name"
        :label="item.group + ' ' + item.first_name"
        :value="item.group"
      /> </el-select></el-col>
    <el-col :span="7">
      <el-input
        v-model="query.name"
        placeholder="输入RTU名或气站中文名进行搜索"
        clearable
        size="mini"
        @keyup.enter.native="getItemList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getItemList"
        />
      </el-input>
    </el-col>
  </el-row>
</template>

<script>
import { getEngineer } from '@/api/searchbar'
export default {
  data() {
    return {
      query: {
        group: '',
        region: '',
        name: '',
        start: '',
        end: ''
      },
      groupFilterWidth: 0,
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
      date: ['', ''],
      groupOptions: []
    }
  },
  watch: {
    date: function() {
      if (this.date === [] || this.date === null) {
        this.date = ['', '']
      }
      this.query.start = this.date[0]
      this.query.end = this.date[1]
    },
    'query.region': async function() {
      if (this.query.region === '') {
        this.groupOptions = []
        this.groupFilterWidth = 0
        this.query.group = ''
        this.getItemList()
        return
      }
      const res = await getEngineer(this.query.region).catch(error => {
        this.message.error('获取地区分组失败' + error)
      })
      this.groupOptions = res
      this.groupOptions.unshift({
        first_name: '所有分组/工程师',
        group: ''
      })
      this.groupFilterWidth = 4
      this.getItemList()
    },
    'query.start': function() {
      this.getItemList()
    },
    'query.end': function() {
      this.getItemList()
    },
    'query.group': function() {
      this.getItemList()
    }
  },
  created() {
    this.set_date()
    this.getItemList()
  },
  methods: {
    set_date() {
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      const year = yesterday.getFullYear() // 年
      const month = yesterday.getMonth() + 1 // 月
      const start = year + '-' + month + '-' + yesterday.getDate() + ' 00:00'
      const end = year + '-' + month + '-' + today.getDate() + ' 00:00'
      this.date = [start, end]
      this.query.start = start
      this.query.end = end
    },
    getItemList() {
      this.$emit('queryChanged', this.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
