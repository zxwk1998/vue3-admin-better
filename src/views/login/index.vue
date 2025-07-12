<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" tabindex="1" type="text" />
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
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" class="login-button" @click.prevent="handleLogin">登录</el-button>
      <router-link to="/register">
        <div style="margin-top: 20px">注册</div>
      </router-link>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, toRefs, onMounted, computed, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/pinia/modules/user'
  import { title } from '@/config'
  import { isPassword } from '@/utils/validate'

  // 创建路由实例
  const router = useRouter()
  const userStore = useUserStore()

  // 响应式状态
  const state = reactive({
    form: {
      username: 'admin',
      password: 'admin',
    },
    rules: {
      username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
      password: [
        { required: true, trigger: 'blur', message: '请输入密码' },
        { validator: isPassword, trigger: 'blur' },
      ],
    },
    loading: false,
    passwordType: 'password',
    redirect: undefined,
  })

  // 使用refs获取表单DOM引用
  const loginForm = ref(null)
  const password = ref(null)

  // 计算属性
  const otherQuery = computed(() => {
    return Object.keys(router.currentRoute.value.query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = router.currentRoute.value.query[cur]
      }
      return acc
    }, {})
  })

  // 显示/隐藏密码
  const showPwd = () => {
    state.passwordType = state.passwordType === 'password' ? '' : 'password'
    // 等待DOM更新后聚焦
    nextTick(() => {
      password.value?.focus()
    })
  }

  // 处理登录
  const handleLogin = () => {
    loginForm.value?.validate(async (valid) => {
      if (valid) {
        state.loading = true
        try {
          await userStore.login(state.form)
          const { query } = router.currentRoute.value
          router.push({
            path: query.redirect || '/',
            query: otherQuery.value,
          })
          state.loading = false
        } catch (error) {
          state.loading = false
        }
      }
    })
  }

  // 生命周期钩子
  onMounted(() => {
    if (router.currentRoute.value.query.redirect) {
      state.redirect = router.currentRoute.value.query.redirect
    }
  })

  // 暴露给模板的变量
  const { form, rules, loading, passwordType, redirect } = toRefs(state)
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    width: 100vw;
    background: url('~@/assets/login_images/background.jpg');
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
