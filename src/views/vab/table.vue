<template>
  <div class="table-container">
    <el-card shadow="never">
      <el-table v-loading="listLoading" :data="list" style="width: 100%">
        <el-table-column label="ID" prop="id" />
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="页面浏览量" prop="pageViews" />
        <el-table-column
          label="日期"
          prop="datetime"
          show-overflow-tooltip
          width="160"
        />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="listQuery.pageNo"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getList } from "@/api/table";

export default {
  name: "Table",
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      totalCount: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        title: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data, totalCount } = await getList(this.listQuery);
      this.list = data;
      this.totalCount = totalCount;
      this.listLoading = false;
    },
    handleEdit(row) {
      this.$message.info("编辑操作：" + row.title);
    },
    handleDelete(row) {
      this.$message.info("删除操作：" + row.title);
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 20px;

  .pagination-container {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
