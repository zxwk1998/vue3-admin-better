<template>
  <div class="icon-container">
    <el-card shadow="never">
      <div class="search-box">
        <el-input
          v-model="searchText"
          placeholder="搜索图标..."
          clearable
          style="width: 300px; margin-bottom: 20px"
        />
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="(icon, index) in filteredIcons"
          :key="index"
          :span="4"
          style="margin-bottom: 20px"
        >
          <el-card class="icon-card" shadow="hover">
            <div class="icon-item">
              <el-icon class="icon-display">
                <component :is="icon" />
              </el-icon>
              <div class="icon-name">{{ icon }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as ElIcons from "@element-plus/icons-vue";
import { getIconList } from "@/api/icon";

export default {
  name: "Icon",
  components: {
    ...ElIcons,
  },
  data() {
    return {
      iconList: [],
      searchText: "",
    };
  },
  computed: {
    filteredIcons() {
      if (!this.searchText) {
        return this.iconList;
      }
      return this.iconList.filter((icon) =>
        icon.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
  },
  async created() {
    await this.getIcons();
  },
  methods: {
    async getIcons() {
      try {
        // 使用 Element Plus 提供的图标
        this.iconList = Object.keys(ElIcons);
      } catch (error) {
        console.error("获取图标列表失败:", error);
        // 使用 Element Plus 提供的图标作为备选
        this.iconList = Object.keys(ElIcons);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-container {
  padding: 20px;

  .search-box {
    display: flex;
    justify-content: center;
  }

  .icon-card {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;

      .icon-display {
        font-size: 24px;
        margin-bottom: 10px;
      }

      .icon-name {
        font-size: 12px;
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>