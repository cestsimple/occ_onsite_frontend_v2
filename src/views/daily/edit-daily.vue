<template>
  <el-dialog :title="`${editForm.rtu_name} - Daily数据修改`" :visible="showDialog" width="550px" @close="btnCancel">
    <!-- 表单 -->
    <el-alert
      :title="`当前用户:${userInfo.username}，上次编辑者: ${modForm.user}`"
      type="info"
      center
      show-icon
      :closable="false"
    />
    <table class="modTable" width="90%" style="font-size:75%">
      <thead>
        <tr>
          <th width="30%">变量名称</th>
          <th width="30%">原始值</th>
          <th width="30%">Mod值</th>
        </tr>
        <tr height="30px">
          <td>h_prod</td>
          <td>{{ originDaily['h_prod'] }}</td>
          <td width="250px">
            <el-input v-model.number="modForm.h_prod_mod" type="number" />
          </td>
        </tr>
        <tr>
          <td>h_stpal</td>
          <td>{{ originDaily['h_stpal'] }}</td>
          <td><el-input v-model.number="modForm.h_stpal_mod" type="number" /></td>
        </tr>
        <tr>
          <td>h_stpdft</td>
          <td>{{ originDaily['h_stpdft'] }}</td>
          <td><el-input v-model.number="modForm.h_stpdft_mod" type="number" /></td>
        </tr>
        <tr>
          <td>h_stp400v</td>
          <td>{{ originDaily['h_stp400v'] }}</td>
          <td><el-input v-model.number="modForm.h_stp400v_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_prod</td>
          <td>{{ originDaily['m3_prod'] }}</td>
          <td><el-input v-model.number="modForm.m3_prod_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_tot</td>
          <td>{{ originDaily['m3_tot'] }}</td>
          <td><el-input v-model.number="modForm.m3_tot_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_peak</td>
          <td>{{ originDaily['m3_peak'] }}</td>
          <td><el-input v-model.number="modForm.m3_peak_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_q1</td>
          <td>{{ originDaily['m3_q1'] }}</td>
          <td><el-input v-model.number="modForm.m3_q1_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_q5</td>
          <td>{{ originDaily['m3_q5'] }}</td>
          <td><el-input v-model.number="modForm.m3_q5_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_q6</td>
          <td>{{ originDaily['m3_q6'] }}</td>
          <td><el-input v-model.number="modForm.m3_q6_mod" type="number" /></td>
        </tr>
        <tr>
          <td>m3_q7</td>
          <td>{{ originDaily['m3_q7'] }}</td>
          <td><el-input v-model.number="modForm.m3_q7_mod" type="number" /></td>
        </tr>
        <tr>
          <td>lin_tot</td>
          <td>{{ originDaily['lin_tot'] }}</td>
          <td><el-input v-model.number="modForm.lin_tot_mod" type="number" /></td>
        </tr>
        <tr>
          <td>flow_meter</td>
          <td>{{ originDaily['flow_meter'] }}</td>
          <td><el-input v-model.number="modForm.flow_meter_mod" type="number" /></td>
        </tr>
      </thead>
    </table>
    <el-input
      v-model="modForm.comment"
      :style="{'width': '90%', 'margin-left': '5%'}"
      type="textarea"
      :rows="2"
      placeholder="请输入备注信息"
    />
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="mini"
        class="btnAdd"
        @click="btnCancel"
      >取消</el-button><el-button
        type="primary"
        size="mini"
        class="btnAdd"
        @click="updateDaily()"
      >更新数据</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getModify, getOrigin, updateModify, updateDaily } from '@/api/daily'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单验证规则
      editForm: {},
      modForm: {},
      originDaily: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    // 传入编辑值
    getData(item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.getOrigin(item.id)
      this.getModify(item.mod_id)
    },
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.editForm = {}
      this.modForm = {}
      this.originDaily = {}
    },
    async getModify(pk) {
      const res = await getModify(pk).catch(error => {
        Message.error('获取modify数据失败' + error)
      })
      this.modForm = res
    },
    async getOrigin(pk) {
      const res = await getOrigin(pk).catch(error => {
        Message.error('获取原始数据失败' + error)
      })
      this.originDaily = res
    },
    async updateDaily() {
      try {
        await updateModify({ ...this.modForm, 'user': this.userInfo.username })
        await updateDaily(this.editForm)
        // 通知父组件刷新数据
        this.$parent.getDaily()
        this.btnCancel()
      } catch (error) {
        console.log(error.response)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style scoped>
::v-deep .el-alert{
  margin-bottom: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
}
::v-deep .el-alert__title {
    font-size: 8px;
}
::v-deep .el-dialog__body {
  padding-top: 15px;
  padding-bottom: 10px;
}
::v-deep .el-dialog__footer {
  padding-right: 40px;
}
.el-dialog{
    margin-top: 1vh !important;
}
tr {
  text-align: center;
}
::v-deep .el-input__inner{
  width: 95%;
  height: 25px !important;
}
::v-deep .el-dialog{
    margin-top: 7vh !important;
}
::v-deep .el-textarea__inner {
  margin-top: 10px;
}
::v-deep input[type="number"]::-webkit-inner-spin-button{
  display: none!important;
}
</style>
