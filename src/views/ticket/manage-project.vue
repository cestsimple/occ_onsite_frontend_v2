<template>
  <div class="dashboard-container">
    <div class="app-container">
      后台管理
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: []
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .app-container {
    padding-top: 5px;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
