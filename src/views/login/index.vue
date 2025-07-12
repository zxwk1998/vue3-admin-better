<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="form"
      :rules="rules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          tabindex="1"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="form.password"
          :type="passwordType"
          tabindex="2"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <el-icon v-if="passwordType === 'password'">
            <Hide />
          </el-icon>
          <el-icon v-else>
            <View />
          </el-icon>
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        class="login-button"
        @click.prevent="handleLogin"
        >登录</el-button
      >
      <router-link to="/register">
        <div style="margin-top: 20px">注册</div>
      </router-link>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { title } from "@/config";
import { isPassword } from "@/utils/validate";
import { ElMessage } from "element-plus";

// 创建路由实例
const router = useRouter();
const store = useStore();

// 响应式状态
const state = reactive({
  form: {
    username: "admin",
    password: "admin",
  },
  rules: {
    username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
    password: [
      { required: true, trigger: "blur", message: "请输入密码" },
      {
        validator: (rule, value, callback) => {
          if (!isPassword(value)) {
            callback(new Error("密码长度必须大于等于6位"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
  },
  loading: false,
  passwordType: "password",
  redirect: undefined,
});

// 使用refs获取表单DOM引用
const loginForm = ref(null);
const password = ref(null);

// 计算属性
const otherQuery = computed(() => {
  return Object.keys(router.currentRoute.value.query).reduce((acc, cur) => {
    if (cur !== "redirect") {
      acc[cur] = router.currentRoute.value.query[cur];
    }
    return acc;
  }, {});
});

// 显示/隐藏密码
const showPwd = () => {
  state.passwordType = state.passwordType === "password" ? "" : "password";
  // 等待DOM更新后聚焦
  nextTick(() => {
    password.value?.focus();
  });
};

// 处理登录
const handleLogin = () => {
  loginForm.value?.validate(async (valid) => {
    if (valid) {
      if (!isPassword(state.form.password)) {
        ElMessage.error("密码长度必须大于等于6位");
        return;
      }

      state.loading = true;
      try {
        // 使用命名空间调用login action
        await store.dispatch("user/login", state.form);

        // 登录成功后，先获取用户权限信息
        try {
          // 获取用户权限
          const permissions = await store.dispatch("user/getUserInfo");
          console.log("获取到的用户权限:", permissions);

          // 根据权限加载路由
          let accessRoutes = [];
          const authentication =
            store.state.settings?.authentication || "intelligence";
          console.log("认证模式:", authentication);

          if (authentication === "intelligence") {
            accessRoutes = await store.dispatch(
              "routes/setRoutes",
              permissions,
            );
          } else if (authentication === "all") {
            accessRoutes = await store.dispatch("routes/setAllRoutes");
          }
          console.log("加载的路由:", accessRoutes);

          // 获取权限信息后，再跳转
          const { query } = router.currentRoute.value;
          const targetPath = query.redirect || "/";
          console.log("即将跳转到:", targetPath);

          // 使用replace而非push，防止返回到登录页
          router.replace({
            path: targetPath,
            query: otherQuery.value,
          });

          // 打印调试信息
          console.log("登录成功，路由跳转完成", {
            permissions,
            accessRoutes,
            currentRoute: router.currentRoute.value,
          });
        } catch (userInfoError) {
          console.error("获取用户信息失败:", userInfoError);
          ElMessage.error("获取用户信息失败，请重新登录");
          // 清除token
          await store.dispatch("user/resetAccessToken");
        }
      } catch (error) {
        console.error("登录失败:", error);
        ElMessage.error(error.message || "登录失败，请检查用户名和密码");
      } finally {
        state.loading = false;
      }
    }
  });
};

// 生命周期钩子
onMounted(() => {
  if (router.currentRoute.value.query.redirect) {
    state.redirect = router.currentRoute.value.query.redirect;
  }
});

// 暴露给模板的变量
const { form, rules, loading, passwordType, redirect } = toRefs(state);
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  background: url("~@/assets/login_images/background.jpg");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    width: 350px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .title-container {
      margin-bottom: 30px;

      .title {
        font-size: 24px;
        color: #333;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;
    }

    .login-button {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
