<template>
  <div>
    <el-card v-loading="loading">
      <el-form
        ref="apsaFormRef"
        :model="apsaRefresh"
        :rules="apsaFormRules"
        label-width="160px"
        size="mini"
      >
        <el-form-item>
          <el-form-item label="部分刷新气站原始数据" prop="apsa_list">
            <el-select
              v-model="apsaRefresh.apsa_list"
              filterable
              remote
              multiple
              placeholder="输入气站中文或RTU名"
              :remote-method="getSeatchItem"
              :loading="loading"
              size="mini"
            >
              <el-option
                v-for="item in serchItemList"
                :key="item.id"
                :label="item.site_name + '-' + item.asset_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围(跨度≤6个月)" prop="time_list">
            <el-date-picker
              v-model="apsaRefresh.time_list"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              :style="{'width': '260px'}"
            />
          </el-form-item>
        </el-form-item>
        <span class="dialog-footer">
          <el-button size="mini" @click="clearSelect">清空</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="getRecord({...apsaRefresh})"
          >提交请求</el-button>
        </span>
      </el-form>
    </el-card>
  </div>
</template>

import { Message } from 'element-ui'
export default {
  data() {
    return {
      car: [],
      apsaRefresh: {
        apsa_list: [],
        time_list: []
      },
      intervalJob: null,
      loading: false,
      serchItemList: [],
      apsaFormRules: {}
    }
  }
}
