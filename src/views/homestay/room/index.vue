<template>
  <div class="room-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>房源管理</span>
          <div class="header-actions">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="房间号">
                <el-input
                  v-model="searchForm.roomNumber"
                  placeholder="请输入房间号"
                  clearable
                  style="width: 150px"
                />
              </el-form-item>
              <el-form-item label="房型">
                <el-select
                  v-model="searchForm.roomType"
                  placeholder="请选择房型"
                  clearable
                  style="width: 150px"
                >
                  <el-option
                    v-for="item in roomTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 120px"
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
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加房源
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="roomList"
        style="width: 100%"
        row-key="id"
        v-loading="loading"
        stripe
      >
        <el-table-column prop="roomNumber" label="房间号" width="100" fixed="left" />
        <el-table-column prop="roomType" label="房型" width="120" />
        <el-table-column prop="floor" label="楼层" width="80">
          <template #default="{ row }">
            {{ row.floor }}楼
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="price" label="价格(元/晚)" width="120">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beds" label="床位数" width="80" />
        <el-table-column prop="maxGuests" label="最多入住" width="100">
          <template #default="{ row }">
            {{ row.maxGuests }}人
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="facilities" label="设施" min-width="200">
          <template #default="{ row }">
            <div class="facilities-tags">
              <el-tag
                v-for="(facility, index) in row.facilities"
                :key="index"
                size="small"
                style="margin: 2px"
              >
                {{ facility }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="viewDetail(row)">查看</el-button>
            <el-button type="text" @click="editRoom(row)">编辑</el-button>
            <el-button
              type="text"
              :class="{ 'text-danger': true }"
              @click="deleteRoom(row)"
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

    <!-- 添加/编辑房源对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingRoom ? '编辑房源' : '添加房源'"
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="roomFormRef"
        :model="roomForm"
        :rules="roomRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="房间号" prop="roomNumber">
              <el-input v-model="roomForm.roomNumber" placeholder="请输入房间号" />
            </el-form-item>

            <el-form-item label="房型" prop="roomType">
              <el-select
                v-model="roomForm.roomType"
                placeholder="请选择房型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roomTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="楼层" prop="floor">
              <el-input-number
                v-model="roomForm.floor"
                :min="1"
                :max="20"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="价格(元/晚)" prop="price">
              <el-input-number
                v-model="roomForm.price"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="面积(㎡)" prop="area">
              <el-input-number
                v-model="roomForm.area"
                :min="0"
                :precision="2"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="床位数" prop="beds">
              <el-input-number
                v-model="roomForm.beds"
                :min="1"
                :max="5"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="最多入住人数" prop="maxGuests">
              <el-input-number
                v-model="roomForm.maxGuests"
                :min="1"
                :max="10"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="roomForm.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="设施" prop="facilities">
              <el-checkbox-group v-model="roomForm.facilities">
                <el-checkbox
                  v-for="facility in allFacilities"
                  :key="facility"
                  :label="facility"
                >
                  {{ facility }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="房间描述" prop="description">
          <el-input
            v-model="roomForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入房间描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRoom">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 房源详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="房源详情"
      width="900px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-carousel :interval="4000" type="card" height="250px">
            <el-carousel-item v-for="(img, index) in detailRoom.images" :key="index">
              <img :src="img" style="width: 100%; height: 100%; object-fit: cover" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="16">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="房间号">{{ detailRoom.roomNumber }}</el-descriptions-item>
            <el-descriptions-item label="房型">{{ detailRoom.roomType }}</el-descriptions-item>
            <el-descriptions-item label="楼层">{{ detailRoom.floor }}楼</el-descriptions-item>
            <el-descriptions-item label="面积">{{ detailRoom.area }}㎡</el-descriptions-item>
            <el-descriptions-item label="价格">
              <span class="detail-price">¥{{ detailRoom.price }}/晚</span>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(detailRoom.status)">
                {{ detailRoom.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="床位数">{{ detailRoom.beds }}张</el-descriptions-item>
            <el-descriptions-item label="最多入住">{{ detailRoom.maxGuests }}人</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-divider>房间设施</el-divider>
      <div class="facilities-detail">
        <el-tag
          v-for="(facility, index) in detailRoom.facilities"
          :key="index"
          size="large"
          style="margin: 5px"
        >
          {{ facility }}
        </el-tag>
      </div>

      <el-divider>房间描述</el-divider>
      <div class="description-detail">
        {{ detailRoom.description }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from "@element-plus/icons-vue";
import {
  getRoomList,
  addRoom,
  updateRoom,
  deleteRoom,
  getRoomTypes,
  getRoomStatusList,
} from "@/api/room";

export default {
  name: "Room",
  components: {
    Search,
    Plus,
  },
  data() {
    return {
      loading: false,
      roomList: [],
      roomTypes: [],
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
      ],
      searchForm: {
        roomNumber: "",
        roomType: "",
        status: "",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      detailDialogVisible: false,
      editingRoom: null,
      detailRoom: {},
      roomForm: {
        roomNumber: "",
        roomType: "",
        floor: 1,
        price: 388,
        area: 30,
        beds: 1,
        maxGuests: 2,
        status: "空闲",
        facilities: ["WiFi", "空调", "电视", "独立卫浴"],
        description: "",
      },
      roomRules: {
        roomNumber: [
          { required: true, message: "请输入房间号", trigger: "blur" },
        ],
        roomType: [
          { required: true, message: "请选择房型", trigger: "change" },
        ],
        floor: [
          { required: true, message: "请输入楼层", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getRoomTypes();
    this.getStatusList();
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.loading = true;
      try {
        const res = await getRoomList({
          ...this.searchForm,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
        });
        if (res.code === 200) {
          this.roomList = res.data;
          this.pagination.total = res.totalCount;
        }
      } catch (error) {
        console.error("获取房源列表失败:", error);
      } finally {
        this.loading = false;
      }
    },
    async getRoomTypes() {
      try {
        const res = await getRoomTypes();
        if (res.code === 200) {
          this.roomTypes = res.data;
        }
      } catch (error) {
        console.error("获取房型列表失败:", error);
      }
    },
    async getStatusList() {
      try {
        const res = await getRoomStatusList();
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
        roomNumber: "",
        roomType: "",
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
    getStatusType(status) {
      const typeMap = {
        空闲: "success",
        已入住: "primary",
        维护中: "warning",
        预订中: "info",
      };
      return typeMap[status] || "info";
    },
    showAddDialog() {
      this.editingRoom = null;
      this.roomForm = {
        roomNumber: "",
        roomType: "",
        floor: 1,
        price: 388,
        area: 30,
        beds: 1,
        maxGuests: 2,
        status: "空闲",
        facilities: ["WiFi", "空调", "电视", "独立卫浴"],
        description: "",
      };
      this.dialogVisible = true;
    },
    editRoom(row) {
      this.editingRoom = row;
      this.roomForm = { ...row };
      this.dialogVisible = true;
    },
    viewDetail(row) {
      this.detailRoom = { ...row };
      this.detailDialogVisible = true;
    },
    async deleteRoom(row) {
      try {
        await this.$confirm(
          `确定要删除房间号为 "${row.roomNumber}" 的房源吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await deleteRoom({ id: row.id });
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
    async saveRoom() {
      try {
        await this.$refs.roomFormRef.validate();
        let res;
        if (this.editingRoom) {
          res = await updateRoom({
            id: this.editingRoom.id,
            ...this.roomForm,
          });
        } else {
          res = await addRoom(this.roomForm);
        }
        if (res.code === 200) {
          this.$message.success(this.editingRoom ? "更新成功" : "添加成功");
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
.room-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;

    .header-actions {
      display: flex;
      align-items: center;
    }
  }

  .price-text {
    color: #fa541c;
    font-weight: bold;
  }

  .facilities-tags {
    display: flex;
    flex-wrap: wrap;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .text-danger {
    color: #f56c6c !important;
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
