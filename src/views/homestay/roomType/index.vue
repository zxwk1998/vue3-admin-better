<template>
  <div class="room-type-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>房型分类</span>
          <div class="header-actions">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加房型
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="房型名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入房型名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 房型列表 -->
      <el-table
        :data="roomTypeList"
        style="width: 100%"
        row-key="id"
        v-loading="loading"
        stripe
      >
        <el-table-column prop="name" label="房型名称" width="120" fixed="left" />
        <el-table-column prop="basePrice" label="基础价格(元/晚)" width="150">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.basePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weekendPrice" label="周末价格(元/晚)" width="150">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.weekendPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="holidayPrice" label="节假日价格(元/晚)" width="170">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.holidayPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="bedType" label="床型" width="180" />
        <el-table-column prop="maxGuests" label="最多入住" width="100">
          <template #default="{ row }">
            {{ row.maxGuests }}人
          </template>
        </el-table-column>
        <el-table-column prop="roomCount" label="房间数量" width="100">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.roomCount }}间</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="availableCount" label="可用房数" width="100">
          <template #default="{ row }">
            <el-tag :type="row.availableCount > 0 ? 'success' : 'danger'">
              {{ row.availableCount }}间
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="viewDetail(row)">查看</el-button>
            <el-button type="text" @click="editRoomType(row)">编辑</el-button>
            <el-button
              type="text"
              class="text-danger"
              @click="deleteRoomType(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑房型对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingRoomType ? '编辑房型' : '添加房型'"
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="roomTypeFormRef"
        :model="roomTypeForm"
        :rules="roomTypeRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房型名称" prop="name">
              <el-input v-model="roomTypeForm.name" placeholder="请输入房型名称" />
            </el-form-item>

            <el-form-item label="基础价格(元/晚)" prop="basePrice">
              <el-input-number
                v-model="roomTypeForm.basePrice"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="周末价格(元/晚)" prop="weekendPrice">
              <el-input-number
                v-model="roomTypeForm.weekendPrice"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="节假日价格(元/晚)" prop="holidayPrice">
              <el-input-number
                v-model="roomTypeForm.holidayPrice"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="面积(㎡)" prop="area">
              <el-input-number
                v-model="roomTypeForm.area"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="床型" prop="bedType">
              <el-input v-model="roomTypeForm.bedType" placeholder="请输入床型描述" />
            </el-form-item>

            <el-form-item label="床位数" prop="beds">
              <el-input-number
                v-model="roomTypeForm.beds"
                :min="1"
                :max="10"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="最多入住人数" prop="maxGuests">
              <el-input-number
                v-model="roomTypeForm.maxGuests"
                :min="1"
                :max="20"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="房间数量" prop="roomCount">
              <el-input-number
                v-model="roomTypeForm.roomCount"
                :min="0"
                :max="100"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="roomTypeForm.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="roomTypeForm.sort"
            :min="1"
            :max="100"
            controls-position="right"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="房间设施" prop="facilities">
          <el-checkbox-group v-model="roomTypeForm.facilities">
            <el-checkbox
              v-for="facility in allFacilities"
              :key="facility"
              :label="facility"
            >
              {{ facility }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="房型描述" prop="description">
          <el-input
            v-model="roomTypeForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入房型描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRoomType">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 房型详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="房型详情"
      width="900px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-carousel :interval="4000" type="card" height="250px">
            <el-carousel-item v-for="(img, index) in detailRoomType.images" :key="index">
              <img :src="img" style="width: 100%; height: 100%; object-fit: cover" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="16">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="房型名称">
              <span class="detail-name">{{ detailRoomType.name }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="detailRoomType.status === '启用' ? 'success' : 'info'">
                {{ detailRoomType.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="基础价格">
              <span class="detail-price">¥{{ detailRoomType.basePrice }}/晚</span>
            </el-descriptions-item>
            <el-descriptions-item label="周末价格">
              <span class="detail-price">¥{{ detailRoomType.weekendPrice }}/晚</span>
            </el-descriptions-item>
            <el-descriptions-item label="节假日价格">
              <span class="detail-price">¥{{ detailRoomType.holidayPrice }}/晚</span>
            </el-descriptions-item>
            <el-descriptions-item label="面积">{{ detailRoomType.area }}㎡</el-descriptions-item>
            <el-descriptions-item label="床型">{{ detailRoomType.bedType }}</el-descriptions-item>
            <el-descriptions-item label="床位数">{{ detailRoomType.beds }}张</el-descriptions-item>
            <el-descriptions-item label="最多入住">{{ detailRoomType.maxGuests }}人</el-descriptions-item>
            <el-descriptions-item label="房间数量">
              {{ detailRoomType.roomCount }}间
            </el-descriptions-item>
            <el-descriptions-item label="可用房间">
              <el-tag :type="detailRoomType.availableCount > 0 ? 'success' : 'danger'">
                {{ detailRoomType.availableCount }}间
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="排序">{{ detailRoomType.sort }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-divider>房间设施</el-divider>
      <div class="facilities-detail">
        <el-tag
          v-for="(facility, index) in detailRoomType.facilities"
          :key="index"
          size="large"
          style="margin: 5px"
        >
          {{ facility }}
        </el-tag>
      </div>

      <el-divider>房型描述</el-divider>
      <div class="description-detail">
        {{ detailRoomType.description }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from "@element-plus/icons-vue";
import {
  getRoomTypeList,
  getAllRoomTypes,
  addRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomTypeStatusList,
} from "@/api/roomType";

export default {
  name: "RoomType",
  components: {
    Search,
    Plus,
  },
  data() {
    return {
      loading: false,
      roomTypeList: [],
      statusList: [],
      allFacilities: [
        "WiFi",
        "空调",
        "电视",
        "独立卫浴",
        "吹风机",
        "热水壶",
        "冰箱",
        "洗衣机",
        "阳台",
        "浴缸",
        "迷你吧",
        "保险箱",
      ],
      searchForm: {
        name: "",
        status: "",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      detailDialogVisible: false,
      editingRoomType: null,
      detailRoomType: {},
      roomTypeForm: {
        name: "",
        basePrice: 388,
        weekendPrice: 468,
        holidayPrice: 568,
        area: 30,
        bedType: "",
        beds: 1,
        maxGuests: 2,
        roomCount: 0,
        status: "启用",
        sort: 1,
        facilities: ["WiFi", "空调", "电视", "独立卫浴"],
        description: "",
      },
      roomTypeRules: {
        name: [
          { required: true, message: "请输入房型名称", trigger: "blur" },
        ],
        basePrice: [
          { required: true, message: "请输入基础价格", trigger: "blur" },
        ],
        bedType: [
          { required: true, message: "请输入床型", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getStatusList();
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.loading = true;
      try {
        const res = await getRoomTypeList({
          ...this.searchForm,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
        });
        if (res.code === 200) {
          this.roomTypeList = res.data;
          this.pagination.total = res.totalCount;
        }
      } catch (error) {
        console.error("获取房型列表失败:", error);
      } finally {
        this.loading = false;
      }
    },
    async getStatusList() {
      try {
        const res = await getRoomTypeStatusList();
        if (res.code === 200) {
          this.statusList = res.data;
        }
      } catch (error) {
        console.error("获取状态列表失败:", error);
      }
    },
    handleSearch() {
      this.pagination.pageNo = 1;
      this.fetchList();
    },
    handleReset() {
      this.searchForm = {
        name: "",
        status: "",
      };
      this.pagination.pageNo = 1;
      this.fetchList();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchList();
    },
    handleCurrentChange(val) {
      this.pagination.pageNo = val;
      this.fetchList();
    },
    showAddDialog() {
      this.editingRoomType = null;
      this.roomTypeForm = {
        name: "",
        basePrice: 388,
        weekendPrice: 468,
        holidayPrice: 568,
        area: 30,
        bedType: "",
        beds: 1,
        maxGuests: 2,
        roomCount: 0,
        status: "启用",
        sort: 1,
        facilities: ["WiFi", "空调", "电视", "独立卫浴"],
        description: "",
      };
      this.dialogVisible = true;
    },
    editRoomType(row) {
      this.editingRoomType = row;
      this.roomTypeForm = { ...row };
      this.dialogVisible = true;
    },
    viewDetail(row) {
      this.detailRoomType = { ...row };
      this.detailDialogVisible = true;
    },
    async deleteRoomType(row) {
      try {
        await this.$confirm(
          `确定要删除房型 "${row.name}" 吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await deleteRoomType({ id: row.id });
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchList();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
      }
    },
    async saveRoomType() {
      try {
        await this.$refs.roomTypeFormRef.validate();
        let res;
        if (this.editingRoomType) {
          res = await updateRoomType({
            id: this.editingRoomType.id,
            ...this.roomTypeForm,
          });
        } else {
          res = await addRoomType(this.roomTypeForm);
        }
        if (res.code === 200) {
          this.$message.success(this.editingRoomType ? "更新成功" : "添加成功");
          this.dialogVisible = false;
          this.fetchList();
        }
      } catch (error) {
        if (error !== false) {
          console.error("保存失败:", error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.room-type-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .price-text {
    color: #fa541c;
    font-weight: bold;
  }

  .text-danger {
    color: #f56c6c !important;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .detail-name {
    font-size: 18px;
    font-weight: bold;
  }

  .detail-price {
    font-size: 18px;
    font-weight: bold;
    color: #fa541c;
  }

  .facilities-detail {
    padding: 10px 0;
  }

  .description-detail {
    line-height: 1.8;
    color: #666;
    padding: 10px 0;
  }
}
</style>
