<template>
  <div class="page-header" :class="customClass">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon v-if="icon && icon.length" class="header-icon">
            <component :is="convertIcon(icon)" />
          </el-icon>
          {{ title }}
        </h1>
        <p v-if="description" class="page-description">
          {{ description }}
        </p>
      </div>
      <div v-if="rightIcon || rightText" class="header-right">
        <slot name="right">
          <el-icon v-if="rightIcon && rightIcon.length" class="header-icon">
            <component :is="convertIcon(rightIcon)" />
          </el-icon>
          <span v-if="rightText">{{ rightText }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { faToElIcon } from "@/utils/vab";

export default {
  name: "VabPageHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: Array,
      default: () => [],
    },
    rightIcon: {
      type: Array,
      default: () => [],
    },
    rightText: {
      type: String,
      default: "",
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  methods: {
    convertIcon(icon) {
      return faToElIcon(icon);
    },
  },
};
</script>

<style lang="scss">
.page-header {
  background: linear-gradient(135deg, #409EFF 0%, #69C0FF 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 8px 0;
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          font-size: 1.8rem;
        }
      }

      .page-description {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 600;

      .header-icon {
        font-size: 1.3rem;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    padding: 20px;

    .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;

      .header-left {
        .page-title {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
