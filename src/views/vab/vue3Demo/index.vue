<template>
  <div class="vue3-demo-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>Vue 3 setup 语法糖示例</h3>
        </div>
      </template>
      <div>
        <p>计数器: {{ count }}</p>
        <el-button type="primary" @click="increment"> 增加 </el-button>
        <el-button type="danger" @click="decrement"> 减少 </el-button>
      </div>
      <el-divider />
      <div>
        <h4>用户信息</h4>
        <p>用户名: {{ user.name }}</p>
        <p>邮箱: {{ user.email }}</p>
        <el-input v-model="user.name" placeholder="输入用户名" />
        <el-input v-model="user.email" placeholder="输入邮箱" />
      </div>
      <el-divider />
      <div>
        <h4>计算属性示例</h4>
        <p>全名: {{ fullName }}</p>
      </div>
      <el-divider />
      <div>
        <h4>Element Plus组件示例</h4>
        <el-date-picker v-model="date" type="date" placeholder="选择日期" />
        <div style="margin-top: 20px">
          <el-tag v-if="date"> 选择的日期: {{ formatDate(date) }} </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

// 响应式变量
const count = ref(0);
const date = ref("");

// 响应式对象
const user = reactive({
  name: "张三",
  email: "zhangsan@example.com",
});

// 计算属性
const fullName = computed(() => {
  return `${user.name} (${user.email})`;
});

// 方法
const increment = () => {
  count.value++;
  ElMessage.success(`计数器增加到: ${count.value}`);
};

const decrement = () => {
  if (count.value > 0) {
    count.value--;
    ElMessage.info(`计数器减少到: ${count.value}`);
  } else {
    ElMessage.warning("计数器已经为0");
  }
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};
</script>

<style lang="scss" scoped>
.vue3-demo-container {
  padding: 20px;

  .box-card {
    max-width: 600px;
    margin: 0 auto;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-input {
      margin-bottom: 10px;
    }
  }
}
</style>
