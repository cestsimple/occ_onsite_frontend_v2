<template>
  <el-dialog
    :title="addForm.rtu_name + ' - 修改停机记录'"
    :visible="showDialog"
    width="450px"
    top="30px"
    @close="btnCancel"
  >
    <!-- 表单区域 -->
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRule"
      label-width="130px"
      label-position="left"
      size="mini"
    >
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
          </el-select></el-form-item>
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
    </el-form>

    <!-- 底部按钮区 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="btnCancel">取 消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="updateItem"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateMalfunction, getReason, getReasonDetail } from '@/api/malfunction'
import { Message } from 'element-ui'
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
    },
    getData(item) {
      this.addForm = item
    },
    async updateItem() {
      if (
        this.addForm.reason_main !== 'internal_involuntary' &&
        this.addForm.reason_main !== 'voluntary_no_budget'
      ) {
        // 不需要填写，清空内容
        this.addForm.reason_l1 = ''
        this.addForm.reason_l2 = ''
        this.addForm.reason_l3 = ''
        this.addForm.reason_l4 = ''
      } else {
        // 根据ID获取字符串内容
        this.addForm.reason_l1 = this.levelOneOptions.filter(x => x.id === this.addFormReasonId.l1_id)[0].cname
        this.addForm.reason_l2 = this.levelTwoOptions.filter(x => x.id === this.addFormReasonId.l2_id)[0].cname
        this.addForm.reason_l3 = this.levelThreeOptions.filter(x => x.id === this.addFormReasonId.l3_id)[0].cname
        this.addForm.reason_l4 = this.levelFourOptions.filter(x => x.id === this.addFormReasonId.l4_id)[0].cname
        this.addForm.reason_detail_1 = this.DetailOneOptions.filter(x => x.id === this.addFormDetailId.l1_id)[0].cname
        this.addForm.reason_detail_2 = this.DetailTwoOptions.filter(x => x.id === this.addFormDetailId.l2_id)[0].cname
      }
      try {
        await updateMalfunction(this.addForm)
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
        Message.success('更新成功')
        this.$parent.showEditMaint = false
      } catch (error) {
        console.log(error.response)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style>

</style>
