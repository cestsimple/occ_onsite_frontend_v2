<template>
  <div>
    <el-dialog :title="`${editForm.date}  ${editForm.rtu_name} - Daily数据修改`" :visible="showDialog" width="550px" :close-on-click-modal="false" @close="btnCancel">
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
              <el-input v-model="modForm.h_prod_mod" type="number" />
            </td>
          </tr>
          <tr>
            <td>M3_PROD</td>
            <td>{{ originDaily['m3_prod'] }}</td>
            <td><el-input v-model="modForm.m3_prod_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_TOT</td>
            <td>{{ originDaily['m3_tot'] }}</td>
            <td><el-input v-model="modForm.m3_tot_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q1</td>
            <td>{{ originDaily['m3_q1'] }}</td>
            <td><el-input v-model="modForm.m3_q1_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q5</td>
            <td>{{ originDaily['m3_q5'] }}</td>
            <td><el-input v-model="modForm.m3_q5_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_PEAK</td>
            <td>{{ originDaily['m3_peak'] }}</td>
            <td><el-input v-model="modForm.m3_peak_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STPAL</td>
            <td>{{ originDaily['h_stpal'] }}</td>
            <td><el-input v-model="modForm.h_stpal_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STPDFT</td>
            <td>{{ originDaily['h_stpdft'] }}</td>
            <td><el-input v-model="modForm.h_stpdft_mod" type="number" /></td>
          </tr>
          <tr>
            <td>H_STP400V</td>
            <td>{{ originDaily['h_stp400v'] }}</td>
            <td><el-input v-model="modForm.h_stp400v_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q6</td>
            <td>{{ originDaily['m3_q6'] }}</td>
            <td><el-input v-model="modForm.m3_q6_mod" type="number" /></td>
          </tr>
          <tr>
            <td>M3_Q7</td>
            <td>{{ originDaily['m3_q7'] }}</td>
            <td><el-input v-model="modForm.m3_q7_mod" type="number" /></td>
          </tr>
          <tr>
            <td><el-button type="text" size="small" @click="showLintot">LIN_TOT</el-button></td>
            <td>{{ originDaily['lin_tot'] }}</td>
            <td><el-input v-model="modForm.lin_tot_mod" type="number" /></td>
          </tr>
          <tr>
            <td>FLOW_METER</td>
            <td>{{ originDaily['flow_meter'] }}</td>
            <td><el-input v-model="modForm.flow_meter_mod" type="number" /></td>
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
            label="库存差(NM)"
            prop="lin_bulk"
            width="105px"
          />
          <el-table-column
            label="充液量(NM)"
            prop="filling_quantity"
            width="105px"
          />
          <el-table-column
            label="LINTOT(NM)"
            prop="lin_tot"
            width="105px"
          />
          <el-table-column
            label="添加记录"
            width="55px"
          >
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showAddRecord(scope.row)">+</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-dialog>
    <el-dialog title="添加原始记录 Record" :visible="showAddRecordDialog" :close-on-click-modal="false" @close="btnAddRecordCancel">
      <el-alert
        title="手动添加变量历史记录"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <el-form :model="addRecordForm" label-width="80px" size="mini">
        <el-form-item label="记录时间">
          <el-date-picker
            v-model="addRecordForm.dt"
            type="datetime"
            placeholder="选择日期时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item label="记录数值">
          <el-input v-model="addRecordForm.value" type="number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="addRecord"
        >添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getModify, getOrigin, getLintotDetail, updateModify, updateDaily, addRecord } from '@/api/daily'
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
      showAddRecordDialog: false,
      LintotDetailList: [{
        error: 0
      }],
      addRecordForm: {
        variable_id: 0,
        dt: '',
        value: 0
      }
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
      const res = await getModify(pk).catch(() => {
        return Message.error('获取modify数据失败, 可能是网络问题，请稍后重试')
      })
      this.modForm = res
    },
    async getOrigin(pk) {
      const res = await getOrigin(pk).catch(() => {
        return Message.error('获取日报原始数据失败, 可能是网络问题，请稍后重试')
      })
      this.originDaily = res
    },
    async updateDaily() {
      try {
        const res1 = await updateModify({ ...this.modForm, 'user': this.userInfo.username })
        console.log(res1)
        if (res1 !== null) {
          const res2 = await updateDaily(this.editForm)
          if (res2 !== null) {
            // 通知父组件刷新数据
            this.$parent.getDaily()
            this.btnCancel()
            return Message.success('更新数据成功')
          }
        }
      } catch (error) {
        console.log(error)
        Message.error('更新失败, 可能是网络问题，请稍后重试')
      }
    },
    async showLintot() {
      try {
        const res = await getLintotDetail(this.editForm.id)
        this.LintotDetailList = res
      } catch (error) {
        return Message.error('获取lintot详情失败, 可能是网络问题，请稍后重试')
      }
      this.showLintotDialog = true
    },
    btnLintotCancel() {
      this.LintotDetailList = [{
        error: 0
      }]
      this.showLintotDialog = false
    },
    showAddRecord(row) {
      this.addRecordForm.variable_id = row.variable_id
      this.showAddRecordDialog = true
    },
    btnAddRecordCancel() {
      this.showAddRecordDialog = false
      this.addRecordForm = {
        variable_id: 0,
        dt: '',
        value: 0 }
    },
    async addRecord() {
      try {
        const res = await addRecord(this.addRecordForm)
        if (res !== null) {
          Message.success('添加成功')
          this.showLintot()
          this.showAddRecordDialog = false
        }
      } catch (e) {
        console.log(e)
        Message.error('请求失败，可能是网络问题，请稍后重试')
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
