<template>
  <div class="tree-container">
    <el-card shadow="never">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        node-key="id"
      />
    </el-card>
  </div>
</template>

<script>
import { getTreeList } from "@/api/tree";

export default {
  name: "Tree",
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    async getTreeData() {
      const { data } = await getTreeList();
      this.treeData = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  padding: 20px;
}
</style>