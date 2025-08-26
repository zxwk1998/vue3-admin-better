<template>
  <el-dropdown @command="handleCommand" trigger="click">
    <div
      class="avatar-container"
      :class="{ 'horizontal-layout': isHorizontalLayout }"
    >
      <div class="avatar-wrapper">
        <img :src="avatar" alt="用户头像" class="user-avatar" />
      </div>
      <div class="user-info">
        <div class="username">{{ username }}</div>
        <div class="user-role">管理员</div>
      </div>
      <!-- 直接使用图标组件 -->
      <ArrowDown class="avatar-dropdown-icon" />
    </div>

    <template #dropdown>
      <el-dropdown-menu class="custom-dropdown">
        <div class="dropdown-header">
          <img :src="avatar" alt="用户头像" class="header-avatar" />
          <div class="header-info">
            <div class="header-username">{{ username }}</div>
            <div class="header-email">admin@example.com</div>
          </div>
        </div>

        <el-dropdown-item command="personalCenter" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <User class="dropdown-icon" />
          <span>个人中心</span>
        </el-dropdown-item>

        <el-dropdown-item command="settings" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Setting class="dropdown-icon" />
          <span>系统设置</span>
        </el-dropdown-item>

        <el-divider></el-divider>

        <el-dropdown-item command="github" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>GitHub 地址</span>
        </el-dropdown-item>

        <el-dropdown-item command="gitee" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>码云地址</span>
        </el-dropdown-item>

        <el-dropdown-item command="pro" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>Admin Pro 地址</span>
        </el-dropdown-item>

        <el-dropdown-item command="plus" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>Admin Plus 地址</span>
        </el-dropdown-item>

        <el-dropdown-item command="shop" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>Shop Vite 地址</span>
        </el-dropdown-item>

        <el-dropdown-item command="job" class="dropdown-item">
          <!-- 直接使用图标组件 -->
          <Link class="dropdown-icon" />
          <span>好工作就业参考网</span>
        </el-dropdown-item>

        <el-divider></el-divider>

        <el-dropdown-item command="logout" class="dropdown-item logout-item">
          <!-- 直接使用图标组件 -->
          <SwitchButton class="dropdown-icon" />
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { recordRoute } from "@/config";
import {
  ArrowDown,
  User,
  Setting,
  Link,
  SwitchButton,
} from "@element-plus/icons-vue";

defineOptions({
  name: "VabAvatar",
});

const store = useStore();
const router = useRouter();
const route = useRoute();

// 计算属性
const avatar = computed(() => store.getters["user/avatar"]);
const username = computed(() => store.getters["user/username"]);
const layout = computed(() => store.getters["settings/layout"]);
const isHorizontalLayout = computed(() => layout.value === "horizontal");

// 方法
const handleCommand = (command) => {
  switch (command) {
    case "logout":
      logout();
      break;
    case "personalCenter":
      personalCenter();
      break;
    case "settings":
      settings();
      break;
    case "github":
      window.open("https://github.com/zxwk1998/vue-admin-better");
      break;
    case "gitee":
      window.open("https://gitee.com/chu1204505056/vue-admin-better");
      break;
    case "pro":
      window.open("https://vuejs-core.cn/admin-pro/");
      break;
    case "plus":
      window.open("https://vuejs-core.cn/admin-plus/");
      break;
    case "shop":
      window.open("https://vuejs-core.cn/shop-vite/");
      break;
    case "job":
      window.open("https://job.vuejs-core.cn/");
      break;
  }
};

const personalCenter = () => {
  router.push("/personalCenter/personalCenter");
};

const settings = () => {
  ElMessage.info("系统设置功能开发中...");
};

const logout = () => {
  store.dispatch("user/logout");
  if (recordRoute) {
    const fullPath = route.fullPath;
    router.push(`/login?redirect=${fullPath}`);
  }
};
</script>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;

  &.horizontal-layout {
    .user-info {
      .username,
      .user-role {
        color: rgba(255, 255, 255, 0.9) !important;
      }
    }

    .avatar-dropdown-icon {
      color: rgba(255, 255, 255, 0.9) !important;
    }
  }

  .avatar-wrapper {
    position: relative;
    margin-right: 12px;

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .user-info {
    flex: 1;
    min-width: 0;

    .username {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      color: #666;
      opacity: 0.8;
    }
  }

  .avatar-dropdown-icon {
    margin-left: 5px;
    color: #666;
  }
}

.custom-dropdown {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  padding: 0;
  min-width: 220px;

  .dropdown-header {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background: linear-gradient(135deg, #409EFF 0%, #69C0FF 100%);
    border-radius: 12px 12px 0 0;
    color: white;

    .header-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      margin-right: 12px;
      object-fit: cover;
    }

    .header-info {
      flex: 1;

      .header-username {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .header-email {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    transition: background-color 0.2s;

    &.logout-item {
      color: #f56c6c;
    }
  }

  .el-divider {
    margin: 8px 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .avatar-container {
    padding: 6px 8px;

    .user-info {
      display: none;
    }

    .dropdown-icon {
      display: none;
    }
  }

  .custom-dropdown {
    min-width: 200px;
  }
}

// 隐藏下拉菜单箭头
:deep() .popper__arrow {
  display: none !important;
}
</style>
