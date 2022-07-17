<template>
  <div>
    <el-card v-loading="loading">
      <h3>成功车辆信息登记</h3>
      <div v-for="(item) in carsOwned" :key="item.plate" class="ludanForm">
        <el-form label-width="120px" :model="item.form" size="mini">
          <el-form-item label="车牌号" prop="plate">
            <el-input v-model="item.plate" disabled />
          </el-form-item>
          <el-form-item label="计划类型" prop="plan_type">
            <el-select v-model="item.form.plan_type">
              <el-option
                v-for="op in planTypeList"
                :key="op.value"
                :label="op.label"
                :value="op.value"
              />
            </el-select>
          </el-form-item>
          <div v-show="item.form.plan_type === 'working'">
            <el-form-item label="驾驶员" prop="driver">
              <el-input v-model="item.form.driver" />
            </el-form-item>
            <el-form-item label="押运员" prop="super">
              <el-input v-model="item.form.super" />
            </el-form-item>
            <el-form-item label="客户" prop="addrs">
              <el-input v-model="item.form.addrs" type="textarea" :rows="10" placeholder="可多行粘贴excel中的客户信息,自动识别" />
            </el-form-item>
          </div>
          <div v-show="item.form.plan_type === 'maint'">
            <el-form-item label="维修时间备注" prop="plate">
              <el-input v-model="item.form.comment" placeholder="请填写24小时制信息(例如: 默认6:00-23:00)" />
            </el-form-item>
          </div>
        </el-form>
        <el-button type="primary" size="mini">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carsOwned: [
        { plate: '1019', form: {
          plan_type: '',
          driver: '',
          super: '',
          addrs: '',
          comment: ''
        }},
        { plate: '1022', form: {
          plan_type: '',
          driver: '',
          super: '',
          addrs: '',
          comment: ''
        }},
        { plate: '1032', form: {
          plan_type: '',
          driver: '',
          super: '',
          addrs: '',
          comment: ''
        }}
      ],
      loading: false,
      planTypeList: [
        {
          value: 'working',
          label: '正常出车'
        },
        {
          value: 'idle',
          label: '无业务停驶'
        },
        {
          value: 'maint',
          label: '计划(继续)维修'
        }
      ]
    }
  }
}
</script>
<style scoped>
  ::v-deep .ludanForm {
    padding-left: 5%;
    padding-right: 5%;
    margin-top: 50px;
  }
  ::v-deep .ludanForm input {
    margin-left: 35px;
    margin-right: 35px;
    width: 65%;
  }
  ::v-deep .ludanForm textarea {
    margin-left: 35px;
    margin-right: 35px;
    width: 65%;
  }
</style>

