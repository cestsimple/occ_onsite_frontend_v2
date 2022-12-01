<template>
  <div class="dashboard-container">
    <div class="app-container">
      申请
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      itemList: []
    }
  },
  methods: {
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding-bottom: 0px;
}

::v-deep .el-dialog__body input {
  width: 200px;
}
.app-container {
    padding-top: 5px;
  }
</style>
