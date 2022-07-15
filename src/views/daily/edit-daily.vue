<template>
  <div>
    <el-dialog :title="`${editForm.rtu_name} - Daily数据修改`" :visible="showDialog" width="550px" :close-on-click-modal="false" @close="btnCancel">
      <!-- 表单 -->
      <el-alert
        :title="`当前用户:${userInfo.username}，上次编辑者: ${modForm.user}`"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <table v-loading="loading" class="modTable" width="90%" style="font-size:75%">
        <thead>
          <tr>
            <th width="30%">变量名称</th>
            <th width="30%">原始值</th>
            <th width="30%">Mod值</th>
          </tr>
          <tr height="30px">
            <td>H_PROD</td>
            <td>{{ originDaily['h_prod'] }}</td>
            <td width="250px">
              <el-input v-model.number="modForm.h_prod_mod" type="number" />
            </td>
          </tr>
          <tr>
            <td>M3_PROD</td>
            <td>{{ originDaily['m3_prod'] }}</td>
            <td><el-input v-model.number="modForm.m3_prod_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_TOT</td>
            <td>{{ originDaily['m3_tot'] }}</td>
            <td><el-input v-model.number="modForm.m3_tot_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q1</td>
            <td>{{ originDaily['m3_q1'] }}</td>
            <td><el-input v-model.number="modForm.m3_q1_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q5</td>
            <td>{{ originDaily['m3_q5'] }}</td>
            <td><el-input v-model.number="modForm.m3_q5_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_PEAK</td>
            <td>{{ originDaily['m3_peak'] }}</td>
            <td><el-input v-model.number="modForm.m3_peak_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STPAL</td>
            <td>{{ originDaily['h_stpal'] }}</td>
            <td><el-input v-model.number="modForm.h_stpal_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STPDFT</td>
            <td>{{ originDaily['h_stpdft'] }}</td>
            <td><el-input v-model.number="modForm.h_stpdft_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STP400V</td>
            <td>{{ originDaily['h_stp400v'] }}</td>
            <td><el-input v-model.number="modForm.h_stp400v_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q6</td>
            <td>{{ originDaily['m3_q6'] }}</td>
            <td><el-input v-model.number="modForm.m3_q6_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q7</td>
            <td>{{ originDaily['m3_q7'] }}</td>
            <td><el-input v-model.number="modForm.m3_q7_mod" type="number" /></td>
          </tr>
          <tr>
            <td><el-button type="text" size="small" @click="showLintot">LIN_TOT</el-button></td>
            <td>{{ originDaily['lin_tot'] }}</td>
            <td><el-input v-model.number="modForm.lin_tot_mod" type="number" /></td>
          </tr>
          <tr>
            <td>FLOW_METER</td>
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
    <el-dialog title="Lintot详情" :visible="showLintotDialog" :width="LintotDetailList[0].error? '30%' :'70%'" @close="btnLintotCancel">
      <div v-if="LintotDetailList[0].error">
        <span>{{ LintotDetailList[0].msg }}</span>
      </div>
      <div v-else>
        <el-table :data="LintotDetailList" border stripe size="mini">
          <el-table-column
            label="资产名"
            prop="bulk_name"
          />
          <el-table-column
            label="储罐容积(M3)"
            prop="tank_size"
            width="105px"
          />
          <el-table-column
            label="0点液位1(%)"
            prop="l1"
            width="105px"
          />
          <el-table-column
            label="0点液位2(%)"
            prop="l2"
            width="105px"
          />
          <el-table-column
            label="Δ液体容积(液L)"
            prop="lin_bulk"
            width="105px"
          />
          <el-table-column
            label="充液量(液L)"
            prop="filling_quantity"
            width="105px"
          />
          <el-table-column
            label="LINTOT(NM)"
            prop="lin_tot"
            width="105px"
          />
        </el-table>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getModify, getOrigin, getLintotDetail, updateModify, updateDaily } from '@/api/daily'
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
      originDaily: {},
      loading: false,
      showLintotDialog: false,
      LintotDetailList: [{
        error: 0
      }]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    // 传入编辑值
    async getData(item) {
      this.editForm = JSON.parse(JSON.stringify(item))
      this.loading = true
      await this.getOrigin(item.id)
      await this.getModify(item.mod_id)
      this.loading = false
    },
    btnCancel() {
      this.$emit('update:showDialog', false)
      this.editForm = {}
      this.modForm = {}
      this.originDaily = {}
      this.btnLintotCancel()
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
    },
    async showLintot() {
      try {
        this.LintotDetailList = await getLintotDetail(this.editForm.id)
      } catch (error) {
        return Message.error('获取lintot详情失败')
      }
      this.showLintotDialog = true
    },
    btnLintotCancel() {
      this.LintotDetailList = [{
        error: 0
      }]
      this.showLintotDialog = false
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
  font-size: 75%;
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
