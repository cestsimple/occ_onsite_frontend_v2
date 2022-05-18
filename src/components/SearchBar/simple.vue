<template>
  <!-- 搜索与添加 -->
  <el-row :gutter="20" :style="{'margin-bottom': '15px'}">
    <el-col :span="2">
      <!-- 插槽 -->
      <slot name="before" />
    </el-col>
    <el-col :span="2">
      <el-button size="mini" @click="clearFilter">
        清空条件
      </el-button>
    </el-col>
    <el-col :span="4">
      <el-select v-model="query.confirm" placeholder="请选择" size="mini">
        <el-option
          v-for="item in confirmOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-select v-model="query.cal" placeholder="计入报表" size="mini">
        <el-option
          v-for="item in calOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
export default {
  data() {
    return {
      query: {
        region: '',
        name: '',
        confirm: '',
        cal: ''
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
      ],
      confirmOption: [
        {
          value: '',
          label: '所有确认状态'
        },
        {
          value: '1',
          label: '已确认'
        },
        {
          value: '0',
          label: '未确认'
        },
        {
          value: '-1',
          label: '已隐藏'
        }
      ],
      calOption: [
        {
          value: '',
          label: '所有计算状态'
        },
        {
          value: '1',
          label: '计算'
        },
        {
          value: '0',
          label: '不计算'
        }
      ]
    }
  },
  watch: {
    'query.region': function() {
      this.getItemList()
    },
    'query.name': function() {
      this.getItemList()
    },
    'query.confirm': function() {
      this.getItemList()
    },
    'query.cal': function() {
      this.getItemList()
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    getItemList() {
      this.$emit('queryChanged', this.query)
    },
    clearFilter() {
      this.query = {
        region: '',
        name: '',
        confirm: '',
        cal: ''
      }
      this.getItemList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
