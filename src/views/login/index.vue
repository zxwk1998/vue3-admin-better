<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-form-container">
        <div class="logo-container">
          <h2 class="welcome-text">欢迎回来</h2>
          <h3 class="system-title">{{ title }}</h3>
        </div>

        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              tabindex="1"
              type="text"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
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
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <el-icon v-if="passwordType === 'password'">
                <Hide />
              </el-icon>
              <el-icon v-else>
                <View />
              </el-icon>
            </span>
          </el-form-item>

          <div class="form-actions">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <a href="javascript:;" class="forgot-password">忘记密码?</a>
          </div>

          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click.prevent="handleLogin"
          >
            登录
          </el-button>

          <div class="register-link">
            <span>还没有账号?</span>
            <router-link to="/register" class="create-account">
              立即注册
            </router-link>
          </div>
        </el-form>
      </div>

      <div class="login-image">
        <div class="overlay">
          <h2 class="slogan">高效 · 便捷 · 安全</h2>
          <p class="description">基于Vue3的现代化管理系统</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { title } from "@/config";
import { isPassword } from "@/utils/validate";
import { ElMessage } from "element-plus";
import { Hide, View, User, Lock } from "@element-plus/icons-vue";

// 创建路由实例
const router = useRouter();
const store = useStore();

// 响应式状态
const state = reactive({
  form: {
    username: "admin",
    password: "123456",
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
const rememberMe = ref(false);

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

        // 登录成功后，让导航守卫处理路由跳转
        // 不需要手动获取用户信息和添加路由，导航守卫会处理
        const { query } = router.currentRoute.value;
        const targetPath = query.redirect || "/";

        // 跳转到目标页面
        router.replace({
          path: targetPath,
          query: otherQuery.value,
        });

        // 不再手动处理后续逻辑，让导航守卫处理
      } catch (error) {
        console.error("登录失败:", error);
        ElMessage.error(error.message || "登录失败，请检查用户名和密码");
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
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 80%;
  max-width: 1000px;
  height: 700px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  background-color: #fff;
}

.login-form-container {
  width: 50%;
  padding: 50px;
  display: flex;
  flex-direction: column;
}

.logo-container {
  margin-bottom: 40px;
  text-align: center;

  .welcome-text {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .system-title {
    font-size: 18px;
    color: #666;
    font-weight: 400;
  }
}

.login-form {
  flex: 1;

  .el-form-item {
    margin-bottom: 24px;
  }

  .el-input {
    height: 50px;

    :deep(.el-input__wrapper) {
      padding-left: 15px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
    }

    :deep(.el-input__prefix) {
      color: #909399;
      font-size: 18px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 15px;
    top: 14px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .forgot-password {
    color: #409eff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-button {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #409eff 0%, #007aff 100%);
  border: none;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(90deg, #007aff 0%, #409eff 100%);
  }
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;

  .create-account {
    color: #409eff;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-image {
  width: 50%;
  position: relative;
  background: url("~@/assets/login_images/background.jpg") center center
    no-repeat;
  background-size: cover;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;

    .slogan {
      color: #fff;
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 20px;
      text-align: center;
    }

    .description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      text-align: center;
    }
  }
}

// 响应式设计
@media screen and (max-width: 992px) {
  .login-box {
    width: 100%;
    max-width: 100%;
    flex-direction: column;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }

  .login-form-container,
  .login-image {
    width: 100%;
  }

  .login-image {
    height: 200px;
    order: -1;
  }
}

@media screen and (max-width: 576px) {
  .login-container {
    padding: 0;
    height: 100%;
    background: #fff;
  }

  .login-box {
    width: 100%;
    max-width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .login-form-container {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .logo-container {
    margin-bottom: 20px;

    .welcome-text {
      font-size: 24px;
    }

    .system-title {
      font-size: 16px;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 15px;
      width: 100%;
    }

    :deep(.el-input) {
      width: 100%;

      .el-input__wrapper {
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

  .login-button {
    height: 45px;
    font-size: 15px;
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .forgot-password {
      margin-top: 8px;
    }
  }
}

// 添加额外的小屏幕适配
@media screen and (max-width: 375px) {
  .login-form-container {
    padding: 15px 10px;
  }

  .login-image {
    height: 150px;
  }
}
</style>
