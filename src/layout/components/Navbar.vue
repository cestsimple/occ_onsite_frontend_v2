<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="app-breadcrumb">
      IMOCC在线平台V2
      <span class="breadBtn" @click="showVersionDialog">Version {{ version }}</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/common/bigUserHeader.png" class="user-avatar">
          <span class="name">您好, {{ userInfo.name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" @click="showDialog">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible="showEditPassword" width="350px" :close-on-click-modal="false" @close="btnCancel">
      <el-form
        :model="editForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="输入旧密码" prop="old_password">
          <el-input v-model="editForm.old_password" size="mini" type="password" />
        </el-form-item>
        <el-form-item label="验证身份">
          <el-button type="primary" size="mini" @click="login">{{ auth_msg }}</el-button>
        </el-form-item>
        <div v-show="auth">
          <el-form-item label="输入新密码" prop="new_password_1">
            <el-input v-model="editForm.new_password_1" size="mini" type="password" />
          </el-form-item>
          <el-form-item label="再次输入" prop="new_password_2">
            <el-input v-model="editForm.new_password_2" size="mini" type="password" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`版本详情 - 当前版本为V${version}`" width="500px" :visible="versionDetailDialog" class="version-div" @close="hideVersionDialog">
      <div>
        <span>1.5.1</span><br>
        修复因IOT SSL证书验证导致无法抓取刷新资产的问题<br>
        <el-divider />
      </div>
      <div>
        <span>1.5.0</span><br>
        新增资产及其变量刷新功能，适用于类似iot更换设备后日报计算变量报错的情况<br>
        <el-divider />
      </div>
      <div>
        <span>1.4.5</span><br>
        导入daily历史数据<br>
        优化数据库查询性能<br>
        <el-divider />
      </div>
      <div>
        <span>1.4.4</span><br>
        修复daily详情页lintot详情中手动添加数据点失败的问题<br>
        修复停机修改时间格式错误导致无法提交的问题<br>
        优化对于浏览器的适配<br>
        <el-divider />
      </div>
      <div>
        <span>1.4.3</span><br>
        修复apsa从机无法更新daily数据的问题<br>
        <el-divider />
      </div>
      <div>
        <span>1.4.2</span><br>
        修复手动添加资产缺少标志位的问题<br>
        优化手动添加资产页面反馈
        <el-divider />
      </div>
      <div>
        <span>1.4.1</span><br>
        新增停机页面下方当前搜索记录的停机时间和用液消耗统计
        <el-divider />
      </div>
      <div>
        <span>1.4.0</span><br>
        更换手动抓取apsa/bulk资产方式<br>
        优化后台操作页面布局流程
        <el-divider />
      </div>
      <div>
        <span>1.3.1</span><br>
        优化性能<br>
        增加daily编辑弹窗日期显示<br>
        导入历史停机数据
        <el-divider />
      </div>
      <div>
        <span>1.3.0</span><br>
        新增daily报表bulk相关原始记录添加功能<br>
        新增job手动清理功能
        <el-divider />
      </div>
      <div>
        <span>1.2.1</span><br>
        修复记录总数限制导致的报表导出缺失问题<br>
        修复daily修改页面无法输入?.0?格式数字的问题
        <el-divider />
      </div>
      <div>
        <span>1.2.0</span><br>
        规范化Daily相关API接口<br>
        优化交互反馈<br>
        搜索功能支持使用CN_(支持大小写)开头的全称进行精确搜索
        <el-divider />
      </div>
      <div>
        <span>1.1.2</span><br>
        停机报表导出具体原因字段由中文改为英文
        <el-divider />
      </div>
      <div>
        <span>1.1.1</span><br>
        修复一个api请求刷新数据失败的问题
        <el-divider />
      </div>
      <div>
        <span>1.1.0</span>
        新增job详情,可以记录job请求的用户和参数
        <el-divider />
      </div>
      <div>
        <span>1.0.0</span><br>
        正式版上线
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { login, setPassword } from '@/api/user'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      version: '1.5.1',
      showEditPassword: false,
      editForm: {
        new_password_1: '',
        new_password_2: '',
        old_password: ''
      },
      auth: false,
      auth_msg: '提交',
      versionDetailDialog: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'userInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async login() {
      if (this.auth === '验证通过，填写新密码') {
        return
      }
      try {
        await login({ username: this.userInfo.username, password: this.editForm.old_password })
      } catch (error) {
        this.auth_msg = '验证失败，点击后再次提交'
        return
      }
      this.auth = true
      this.auth_msg = '验证通过，填写新密码'
    },
    async updatePassword() {
      if (this.editForm.new_password_1 !== this.editForm.new_password_2) {
        return this.$message.error('两次密码不相同')
      }
      if (this.editForm.new_password_1 === this.editForm.old_password) {
        return this.$message.error('新密码与旧密码相同，无需修改')
      }
      try {
        await setPassword({ id: this.userInfo.id, password: this.editForm.new_password_1 })
        this.$message.success('更新成功')
        this.showEditPassword = false
      } catch (error) {
        this.$message.error('更新失败' + error)
      }
    },
    showDialog() {
      this.showEditPassword = true
    },
    btnCancel() {
      this.editForm = {
        new_password: '',
        old_password: ''
      }
      this.showEditPassword = false
      this.auth = false
      this.auth_msg = '提交'
    },
    showVersionDialog() {
      this.versionDetailDialog = true
    },
    hideVersionDialog() {
      this.versionDetailDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #ffffff;
  cursor: text;
  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

   .name {
          color: #fff;
          vertical-align: middle;
          margin-left:5px;
   }
   .user-dropdown {
           color: #fff;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;

        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
          color: #fff;
        }
      }
    }

    .version-div div {
      font-size: 12px;
      transform: scale(0.8);
    }
  }
}
</style>
