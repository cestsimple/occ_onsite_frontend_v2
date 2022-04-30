<template>
  <el-dialog title="新增停机记录" :visible="showDialog" width="45%" @close="btnCancel">
    <el-steps
      :space="830"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="选择停机设备" />
      <el-step title="填写停机信息" />
      <el-step title="填写原因详情" />
    </el-steps>
    <!-- 标签页Tab -->
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRule"
      label-width="130px"
      label-position="left"
      size="mini"
    >
      <el-tabs
        v-model="activeIndex"
        :tab-position="'left'"
        style="height: 100%"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="搜索停机设备" prop="apsa">
            <el-select
              v-model="addForm.apsa_id"
              filterable
              remote
              placeholder="输入气站中文或RTU名"
              :remote-method="getSeatchItem"
              :loading="loading"
              size="mini"
              clearable
            >
              <el-option
                v-for="item in serchItemList"
                :key="item.id"
                :label="item.site_name + '-' + item.asset_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="t_start">
            <el-date-picker
              v-model="addForm.t_start"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            /> </el-form-item>
          <el-form-item label="结束时间" prop="t_end">
            <el-date-picker
              v-model="addForm.t_end"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            /> </el-form-item>
          <el-form-item label="停机次数" prop="stop_count">
            <el-input
              v-model="addForm.stop_count"
            /> </el-form-item><el-form-item label="停机时长" prop="stop_hour">
            <el-input
              v-model="addForm.stop_hour"
            /> </el-form-item>
          <el-form-item label="停机用液消耗" prop="stop_consumption">
            <el-input
              v-model="addForm.stop_consumption"
            /> </el-form-item>
          <el-form-item label="停机标志位" prop="stop_label">
            <el-select
              v-model="addForm.stop_label"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in stopLabelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> </el-form-item>
          <el-form-item label="停机报警" prop="stop_alarm">
            <el-input
              v-model="addForm.stop_alarm"
            /> </el-form-item>
          <el-form-item label="备注信息" prop="occ_comment">
            <el-input
              v-model="addForm.occ_comment"
              type="textarea"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="原因详情" name="2">
          <el-form-item label="停机原因" prop="reason_main">
            <el-select
              v-model="addForm.reason_main"
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
          </el-form-item>
          <div
            v-if="
              addForm.reason_main === 'internal_involuntary' ||
                addForm.reason_main === 'voluntary_no_budget'
            "
          >
            <el-form-item label="过程组原因" prop="reason_l1">
              <el-select
                v-model="addFormReasonId.l1_id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelOneOptions"
                  :key="item.id"
                  :label="item.cname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备原因" prop="reason_l2">
              <el-select
                v-model="addFormReasonId.l2_id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelTwoOptions"
                  :key="item.id"
                  :label="item.cname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="组件原因" prop="reason_l3">
              <el-select
                v-model="addFormReasonId.l3_id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelThreeOptions"
                  :key="item.id"
                  :label="item.cname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="部件原因" prop="reason_l4">
              <el-select
                v-model="addFormReasonId.l4_id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in levelFourOptions"
                  :key="item.id"
                  :label="item.cname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="具体原因-1" prop="reason_detail_1">
            <el-select
              v-model="addFormDetailId.l1_id"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in DetailOneOptions"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="具体原因-2" prop="reason_detail_2">
            <el-select
              v-model="addFormDetailId.l2_id"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in DetailTwoOptions"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="mt_comment">
            <el-input
              v-model="addForm.mt_comment"
              type="textarea"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="btnAdd"
            @click="addMalfunction"
          >提交记录</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form></el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { getApsa } from '@/api/apsa'
import { getReason, getReasonDetail, addMalfunction } from '@/api/malfunction'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: '1',
      // 表单数据
      addForm: {
        apsa_id: null,
        t_start: '',
        t_end: '',
        stop_count: 0,
        stop_hour: 0.0,
        stop_consumption: 0.0,
        stop_label: '',
        stop_alarm: '',
        reason_main: '',
        reason_l1: '',
        reason_l2: '',
        reason_l3: '',
        reason_l4: '',
        reason_detail_1: '',
        reason_detail_2: '',
        mt_comment: '',
        occ_comment: '',
        change_user: ''
      },
      addFormReasonId: {
        l1_id: null,
        l2_id: null,
        l3_id: null,
        l4_id: null
      },
      addFormDetailId: {
        l1_id: null,
        l2_id: null
      },
      // 表单验证规则
      addFormRule: {},
      // 储罐搜索-Loading标志位
      loading: false,
      // 储罐搜索-列表
      serchItemList: [],
      // 停机标志位选择
      stopLabelOptions: [
        {
          value: 'DFT',
          label: 'DFT'
        },
        {
          value: 'AL',
          label: 'AL'
        },
        {
          value: '400V',
          label: '400V'
        }
      ],
      // 主要原因选择
      mainReasonOptions: [
        {
          value: 'budget_maint',
          label: '计划内保养'
        },
        {
          value: 'internal_involuntary',
          label: '内部被动原因'
        },
        {
          value: 'voluntary_no_budget',
          label: '主动无预算'
        },
        {
          value: 'external',
          label: '外部原因'
        },
        {
          value: 'customer_disuse',
          label: '客户停用'
        }
      ],
      // 各级停机原因选择
      levelOneOptions: [],
      levelTwoOptions: [],
      levelThreeOptions: [],
      levelFourOptions: [],
      DetailOneOptions: [],
      DetailTwoOptions: []
    }
  },
  watch: {
    // 监听各级原因发生变化
    'addFormReasonId.l1_id': async function() {
      const levelId = this.addFormReasonId.l1_id
      if (levelId) {
        const res = await getReason({ 'parent': levelId }).catch(() => {
          this.addFormReasonId.l3_id = null
          this.addFormReasonId.l4_id = null
          this.$message.error('获取原因失败')
        })
        this.levelTwoOptions = res.sub_data.subs
        this.levelThreeOptions = []
        this.levelFourOptions = []
        this.addFormReasonId.l3_id = null
        this.addFormReasonId.l4_id = null
      }
    },
    'addFormReasonId.l2_id': async function() {
      const levelId = this.addFormReasonId.l2_id
      if (levelId) {
        const res = await getReason({ 'parent': levelId }).catch(() => {
          this.addFormReasonId.l4_id = null
          this.$message.error('获取原因失败')
        })
        this.levelThreeOptions = res.sub_data.subs
        this.levelFourOptions = []
        this.addFormReasonId.l4_id = null
      }
    },
    'addFormReasonId.l3_id': async function() {
      const levelId = this.addFormReasonId.l3_id
      const res = await getReason({ 'parent': levelId }).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.levelFourOptions = res.sub_data.subs
    },
    'addFormDetailId.l1_id': async function() {
      const levelId = this.addFormDetailId.l1_id
      const res = await getReasonDetail({ 'parent': levelId }).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.DetailTwoOptions = res.sub_data.subs
      this.addFormDetailId.l2_id = null
    }
  },
  created() {
    this.getLevelOneReasons()
    this.getLevelOneDetails()
  },
  methods: {
    async getSeatchItem(query) {
      if (query === null || query === '') {
        return
      }
      this.loading = true
      const res = await getApsa({ 'name': query }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message.error('无法获取资产列表')
      })
      this.serchItemList = res
      this.loading = false
    },
    btnCancel() {
      this.addForm = {
        apsa_id: null,
        t_start: '',
        t_end: '',
        stop_count: 0,
        stop_hour: 0.0,
        stop_consumption: 0.0,
        stop_label: '',
        stop_alarm: '',
        reason_main: '',
        reason_l1: '',
        reason_l2: '',
        reason_l3: '',
        reason_l4: '',
        reason_detail_1: '',
        reason_detail_2: '',
        mt_comment: '',
        occ_comment: '',
        change_user: ''
      }
      this.$refs.addFormRef.resetFields()
      this.$emit('update:showDialog', false)
      this.activeIndex = '1'
    },
    beforeTabLeave(newName, oldName) {
      if (oldName === '1' && this.addForm.apsa_id == null) {
        this.$message.error('必须先选择停机设备')
        return false
      }
    },
    // 获取一级原因数据
    async getLevelOneReasons() {
      const res = await getReason({}).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.levelOneOptions = res.reason_list
    },
    async getLevelOneDetails() {
      const res = await getReasonDetail({}).catch(() => {
        this.$message.error('获取原因失败')
      })
      this.DetailOneOptions = res.reason_list
    },
    async addMalfunction() {
      if (
        this.addForm.reason_main !== 'internal_involuntary' &&
        this.addForm.reason_main !== 'voluntary_no_budget'
      ) {
        // 如果需要填写，清空已填内容
        this.addForm.reason_l1 = ''
        this.addForm.reason_l2 = ''
        this.addForm.reason_l3 = ''
        this.addForm.reason_l4 = ''
      } else {
        if (this.addFormReasonId.l1_id) {
          this.addForm.reason_l1 = this.levelOneOptions.filter(x => x.id === this.addFormReasonId.l1_id)[0].cname
        }
        if (this.addFormReasonId.l2_id) {
          this.addForm.reason_l2 = this.levelTwoOptions.filter(x => x.id === this.addFormReasonId.l2_id)[0].cname
        }
        if (this.addFormReasonId.l3_id) {
          this.addForm.reason_l3 = this.levelThreeOptions.filter(x => x.id === this.addFormReasonId.l3_id)[0].cname
        }
        if (this.addFormReasonId.l4_id) {
          this.addForm.reason_l4 = this.levelFourOptions.filter(x => x.id === this.addFormReasonId.l4_id)[0].cname
        }
      }
      this.addForm.reason_detail_1 = this.DetailOneOptions.filter(x => x.id === this.addFormDetailId.l1_id)[0].cname
      this.addForm.reason_detail_2 = this.DetailTwoOptions.filter(x => x.id === this.addFormDetailId.l2_id)[0].cname
      try {
        await this.$refs.addFormRef.validate()
        await addMalfunction(this.addForm)
        // 通知父组件刷新数据
        this.$parent.getMalfunction()
        this.addForm = {
          apsa_id: null,
          t_start: '',
          t_end: '',
          stop_count: 0,
          stop_hour: 0.0,
          stop_consumption: 0.0,
          stop_label: '',
          stop_alarm: '',
          reason_main: '',
          reason_l1: '',
          reason_l2: '',
          reason_l3: '',
          reason_l4: '',
          reason_detail_1: '',
          reason_detail_2: '',
          mt_comment: '',
          occ_comment: '',
          change_user: ''
        }
        this.$refs.addFormRef.resetFields()
        this.$parent.showAddDialog = false
      } catch (error) {
        console.log(error)
        Message.error('添加失败')
      }
    }
  }
}
</script>

<style scoped>
/deep/.el-dialog{
    margin-top: 7vh !important;
}

/deep/.el-step__title {
    font-size: 10px;
    margin-bottom: 15px;
}
</style>
