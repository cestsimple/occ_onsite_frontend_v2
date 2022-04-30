<template>
  <el-dialog :title="`修改Daily - ${editForm.rtu_name}`" :visible="showDialog" width="35%" @close="btnCancel">
    <!-- 表单 -->
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
            <el-input v-model="modForm.h_prod_mod" />
          </td>
        </tr>
        <tr>
          <td>h_stpal</td>
          <td>{{ originDaily['h_stpal'] }}</td>
          <td><el-input v-model="modForm.h_stpal_mod" /></td>
        </tr>
        <tr>
          <td>h_stpdft</td>
          <td>{{ originDaily['h_stpdft'] }}</td>
          <td><el-input v-model="modForm.h_stpdft_mod" /></td>
        </tr>
        <tr>
          <td>h_stp400v</td>
          <td>{{ originDaily['h_stp400v'] }}</td>
          <td><el-input v-model="modForm.h_stp400v_mod" /></td>
        </tr>
        <tr>
          <td>m3_prod</td>
          <td>{{ originDaily['m3_prod'] }}</td>
          <td><el-input v-model="modForm.m3_prod_mod" /></td>
        </tr>
        <tr>
          <td>m3_tot</td>
          <td>{{ originDaily['m3_tot'] }}</td>
          <td><el-input v-model="modForm.m3_tot_mod" /></td>
        </tr>
        <tr>
          <td>m3_q1</td>
          <td>{{ originDaily['m3_q1'] }}</td>
          <td><el-input v-model="modForm.m3_q1_mod" /></td>
        </tr>
        <tr>
          <td>m3_peak</td>
          <td>{{ originDaily['m3_peak'] }}</td>
          <td><el-input v-model="modForm.m3_peak_mod" /></td>
        </tr>
        <tr>
          <td>m3_q5</td>
          <td>{{ originDaily['m3_q5'] }}</td>
          <td><el-input v-model="modForm.m3_q5_mod" /></td>
        </tr>
        <tr>
          <td>m3_q6</td>
          <td>{{ originDaily['m3_q6'] }}</td>
          <td><el-input v-model="modForm.m3_q6_mod" /></td>
        </tr>
        <tr>
          <td>m3_q7</td>
          <td>{{ originDaily['m3_q7'] }}</td>
          <td><el-input v-model="modForm.m3_q7_mod" /></td>
        </tr>
        <tr>
          <td>lin_tot</td>
          <td>{{ originDaily['lin_tot'] }}</td>
          <td><el-input v-model="modForm.lin_tot_mod" /></td>
        </tr>
        <tr>
          <td>flow_meter</td>
          <td>{{ originDaily['flow_meter'] }}</td>
          <td><el-input v-model="modForm.flow_meter_mod" /></td>
        </tr>
      </thead>
    </table>
    <el-input
      v-model="modForm.comment"
      :style="{'width': '90%', 'margin-left': '5%'}"
      type="textarea"
      :rows="3"
      placeholder="请输入备注信息"
    />
    <!-- 底部按钮 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
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
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getModify, getOrigin, updateModify, updateDaily } from '@/api/daily'
import { Message } from 'element-ui'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {
        }
      }
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
  watch: {
    editItem: function() {
      if (this.editItem.rtu_name === '') {
        return
      }
      this.editForm = this.editItem
      this.getOrigin(this.editItem.id)
      this.getModify(this.editItem.mod_id)
    }
  },
  methods: {
    btnCancel() {
      this.editForm = {}
      this.modForm = {}
      this.originDaily = {}
      this.editItem = {
        'rtu_name': ''
      }
      this.$emit('update:showDialog', false)
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
        await updateModify(this.modForm)
        await updateDaily(this.editForm)
        // 通知父组件刷新数据
        this.$parent.getDaily()
        this.editForm = {}
        this.modForm = {}
        this.originDaily = {}
        this.editItem = {
          'rtu_name': ''
        }
        this.$parent.showEditDialog = false
      } catch (error) {
        console.log(error.response)
        Message.error('更新失败')
      }
    }
  }
}
</script>

<style scoped>
.el-dialog{
    margin-top: 1vh !important;
}
tr {
  text-align: center;
}

/deep/.el-input__inner{
  width: 65%;
  height: 25px !important;
}
</style>
