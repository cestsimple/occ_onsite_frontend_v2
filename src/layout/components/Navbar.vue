<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="app-breadcrumb">
      IMOCC在线平台V2
      <span class="breadBtn">Public Beta</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/common/bigUserHeader.png" class="user-avatar">
          <span class="name">您好, {{ userInfo.username }}</span>
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
      showEditPassword: false,
      editForm: {
        new_password_1: '',
        new_password_2: '',
        old_password: ''
      },
      auth: false,
      auth_msg: '提交'
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
  }
}
</style>
