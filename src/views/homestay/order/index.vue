<template>
  <div class="order-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.todayOrders }}</div>
              <div class="stat-label">今日订单</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.todayCheckIn }}</div>
              <div class="stat-label">今日入住</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><Checked /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.todayCheckOut }}</div>
              <div class="stat-label">今日退房</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ statistics.totalRevenue }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              新建订单
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户姓名"
            clearable
            style="width: 150px"
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
        <el-form-item label="来源">
          <el-select
            v-model="searchForm.source"
            placeholder="请选择来源"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in sourceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期">
          <el-date-picker
            v-model="searchForm.checkInDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="退房日期">
          <el-date-picker
            v-model="searchForm.checkOutDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单列表 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        row-key="id"
        v-loading="loading"
        stripe
      >
        <el-table-column prop="orderNo" label="订单号" width="180" fixed="left" />
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="customerPhone" label="联系电话" width="120" />
        <el-table-column prop="roomType" label="房型" width="100" />
        <el-table-column prop="roomNumber" label="房间号" width="80" />
        <el-table-column prop="checkInDate" label="入住日期" width="110" />
        <el-table-column prop="checkOutDate" label="退房日期" width="110" />
        <el-table-column prop="nights" label="晚数" width="60">
          <template #default="{ row }">
            {{ row.nights }}晚
          </template>
        </el-table-column>
        <el-table-column prop="adults" label="人数" width="80">
          <template #default="{ row }">
            {{ row.adults }}成人{{ row.children > 0 ? `/${row.children}儿童` : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总金额" width="100">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="100" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="text" @click="viewDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === '待确认'"
              type="text"
              @click="handleConfirm(row)"
            >
              确认
            </el-button>
            <el-button
              v-if="row.status === '已确认'"
              type="text"
              @click="handleCheckIn(row)"
            >
              入住
            </el-button>
            <el-button
              v-if="row.status === '已入住'"
              type="text"
              @click="handleCheckOut(row)"
            >
              退房
            </el-button>
            <el-button
              v-if="['待确认', '已确认'].includes(row.status)"
              type="text"
              class="text-warning"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="row.status === '已取消'"
              type="text"
              class="text-danger"
              @click="handleDelete(row)"
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

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ detailOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailOrder.status)">
            {{ detailOrder.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ detailOrder.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailOrder.customerPhone }}</el-descriptions-item>
        <el-descriptions-item label="房型">{{ detailOrder.roomType }}</el-descriptions-item>
        <el-descriptions-item label="房间号">{{ detailOrder.roomNumber }}</el-descriptions-item>
        <el-descriptions-item label="入住日期">{{ detailOrder.checkInDate }}</el-descriptions-item>
        <el-descriptions-item label="退房日期">{{ detailOrder.checkOutDate }}</el-descriptions-item>
        <el-descriptions-item label="入住人数">{{ detailOrder.adults }}成人{{ detailOrder.children > 0 ? `/${detailOrder.children}儿童` : '' }}</el-descriptions-item>
        <el-descriptions-item label="入住天数">{{ detailOrder.nights }}晚</el-descriptions-item>
        <el-descriptions-item label="单价">¥{{ detailOrder.basePrice }}/晚</el-descriptions-item>
        <el-descriptions-item label="总金额">
          <span class="detail-price">¥{{ detailOrder.totalPrice }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ detailOrder.payMethod }}</el-descriptions-item>
        <el-descriptions-item label="订单来源">{{ detailOrder.source }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="确认时间">{{ detailOrder.confirmTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="入住时间">{{ detailOrder.checkInTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="退房时间">{{ detailOrder.checkOutTime || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>备注</el-divider>
      <div class="remark-detail">
        {{ detailOrder.remark || '无' }}
      </div>
    </el-dialog>

    <!-- 新建订单对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新建订单"
      width="700px"
      destroy-on-close
    >
      <el-form
        ref="orderFormRef"
        :model="orderForm"
        :rules="orderRules"
        label-width="100px"
      >
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="orderForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="customerPhone">
          <el-input v-model="orderForm.customerPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="房型" prop="roomType">
          <el-select
            v-model="orderForm.roomType"
            placeholder="请选择房型"
            style="width: 100%"
            @change="handleRoomTypeChange"
          >
            <el-option
              v-for="item in roomTypes"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-select
            v-model="orderForm.roomNumber"
            placeholder="请选择房间号"
            style="width: 100%"
          >
            <el-option
              v-for="room in availableRooms"
              :key="room.id"
              :label="room.roomNumber"
              :value="room.roomNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期" prop="checkInDate">
          <el-date-picker
            v-model="orderForm.checkInDate"
            type="date"
            placeholder="选择入住日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="退房日期" prop="checkOutDate">
          <el-date-picker
            v-model="orderForm.checkOutDate"
            type="date"
            placeholder="选择退房日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成人数量" prop="adults">
              <el-input-number
                v-model="orderForm.adults"
                :min="1"
                :max="10"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="儿童数量" prop="children">
              <el-input-number
                v-model="orderForm.children"
                :min="0"
                :max="10"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="支付方式" prop="payMethod">
          <el-select
            v-model="orderForm.payMethod"
            placeholder="请选择支付方式"
            style="width: 100%"
          >
            <el-option label="微信支付" value="微信支付" />
            <el-option label="支付宝" value="支付宝" />
            <el-option label="银行卡" value="银行卡" />
            <el-option label="现金" value="现金" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" prop="source">
          <el-select
            v-model="orderForm.source"
            placeholder="请选择订单来源"
            style="width: 100%"
          >
            <el-option label="线上预订" value="线上预订" />
            <el-option label="到店预订" value="到店预订" />
            <el-option label="电话预订" value="电话预订" />
            <el-option label="第三方平台" value="第三方平台" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="orderForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrder">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus, Document, User, Checked, Money } from "@element-plus/icons-vue";
import {
  getOrderList,
  addOrder,
  confirmOrder,
  checkInOrder,
  checkOutOrder,
  cancelOrder,
  deleteOrder,
  getOrderStatusList,
  getOrderSourceList,
  getOrderStatistics,
} from "@/api/order";
import { getRoomList } from "@/api/room";
import { getAllRoomTypes } from "@/api/roomType";

export default {
  name: "Order",
  components: {
    Search,
    Plus,
    Document,
    User,
    Checked,
    Money,
  },
  data() {
    return {
      loading: false,
      orderList: [],
      statistics: {
        todayOrders: 0,
        todayCheckIn: 0,
        todayCheckOut: 0,
        totalRevenue: 0,
      },
      statusList: [],
      sourceList: [],
      roomTypes: [],
      availableRooms: [],
      searchForm: {
        orderNo: "",
        customerName: "",
        status: "",
        source: "",
        checkInDate: "",
        checkOutDate: "",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      detailDialogVisible: false,
      addDialogVisible: false,
      detailOrder: {},
      orderForm: {
        customerName: "",
        customerPhone: "",
        roomType: "",
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        payMethod: "",
        source: "",
        remark: "",
      },
      orderRules: {
        customerName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
        ],
        customerPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        roomType: [
          { required: true, message: "请选择房型", trigger: "change" },
        ],
        checkInDate: [
          { required: true, message: "请选择入住日期", trigger: "change" },
        ],
        checkOutDate: [
          { required: true, message: "请选择退房日期", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getStatusList();
    this.getSourceList();
    this.getRoomTypes();
    this.getAvailableRooms();
    this.fetchStatistics();
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.loading = true;
      try {
        const res = await getOrderList({
          ...this.searchForm,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
        });
        if (res.code === 200) {
          this.orderList = res.data;
          this.pagination.total = res.totalCount;
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchStatistics() {
      try {
        const res = await getOrderStatistics();
        if (res.code === 200) {
          this.statistics = res.data;
        }
      } catch (error) {
        console.error("获取统计数据失败:", error);
      }
    },
    async getStatusList() {
      try {
        const res = await getOrderStatusList();
        if (res.code === 200) {
          this.statusList = res.data;
        }
      } catch (error) {
        console.error("获取状态列表失败:", error);
      }
    },
    async getSourceList() {
      try {
        const res = await getOrderSourceList();
        if (res.code === 200) {
          this.sourceList = res.data;
        }
      } catch (error) {
        console.error("获取来源列表失败:", error);
      }
    },
    async getRoomTypes() {
      try {
        const res = await getAllRoomTypes();
        if (res.code === 200) {
          this.roomTypes = res.data;
        }
      } catch (error) {
        console.error("获取房型列表失败:", error);
      }
    },
    async getAvailableRooms() {
      try {
        const res = await getRoomList({
          status: "空闲",
          pageNo: 1,
          pageSize: 100,
        });
        if (res.code === 200) {
          this.availableRooms = res.data;
        }
      } catch (error) {
        console.error("获取可用房间失败:", error);
      }
    },
    handleSearch() {
      this.pagination.pageNo = 1;
      this.fetchList();
    },
    handleReset() {
      this.searchForm = {
        orderNo: "",
        customerName: "",
        status: "",
        source: "",
        checkInDate: "",
        checkOutDate: "",
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
        待确认: "warning",
        已确认: "primary",
        已入住: "success",
        已退房: "info",
        已完成: "",
        已取消: "danger",
      };
      return typeMap[status] || "info";
    },
    viewDetail(row) {
      this.detailOrder = { ...row };
      this.detailDialogVisible = true;
    },
    showAddDialog() {
      this.orderForm = {
        customerName: "",
        customerPhone: "",
        roomType: "",
        roomNumber: "",
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
        payMethod: "",
        source: "",
        remark: "",
      };
      this.addDialogVisible = true;
    },
    handleRoomTypeChange(val) {
      this.orderForm.roomNumber = "";
    },
    async handleConfirm(row) {
      try {
        await this.$confirm(
          `确定要确认订单号为 "${row.orderNo}" 的订单吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await confirmOrder({ id: row.id });
        if (res.code === 200) {
          this.$message.success("确认成功");
          this.fetchList();
          this.fetchStatistics();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("确认失败");
        }
      }
    },
    async handleCheckIn(row) {
      try {
        await this.$confirm(
          `确定要为订单号为 "${row.orderNo}" 的订单办理入住吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await checkInOrder({ id: row.id });
        if (res.code === 200) {
          this.$message.success("入住成功");
          this.fetchList();
          this.fetchStatistics();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("入住失败");
        }
      }
    },
    async handleCheckOut(row) {
      try {
        await this.$confirm(
          `确定要为订单号为 "${row.orderNo}" 的订单办理退房吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await checkOutOrder({ id: row.id });
        if (res.code === 200) {
          this.$message.success("退房成功");
          this.fetchList();
          this.fetchStatistics();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("退房失败");
        }
      }
    },
    async handleCancel(row) {
      try {
        await this.$confirm(
          `确定要取消订单号为 "${row.orderNo}" 的订单吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await cancelOrder({ id: row.id });
        if (res.code === 200) {
          this.$message.success("取消成功");
          this.fetchList();
          this.fetchStatistics();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("取消失败");
        }
      }
    },
    async handleDelete(row) {
      try {
        await this.$confirm(
          `确定要删除订单号为 "${row.orderNo}" 的订单吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        const res = await deleteOrder({ id: row.id });
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchList();
          this.fetchStatistics();
        }
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
      }
    },
    async saveOrder() {
      try {
        await this.$refs.orderFormRef.validate();
        const res = await addOrder(this.orderForm);
        if (res.code === 200) {
          this.$message.success("创建成功");
          this.addDialogVisible = false;
          this.fetchList();
          this.fetchStatistics();
          this.getAvailableRooms();
        }
      } catch (error) {
        if (error !== false) {
          console.error("创建订单失败:", error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-container {
  padding: 20px;

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
      }

      .stat-info {
        margin-left: 15px;

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 5px;
        }
      }
    }
  }

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

  .text-warning {
    color: #e6a23c !important;
  }

  .text-danger {
    color: #f56c6c !important;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .detail-price {
    font-size: 18px;
    font-weight: bold;
    color: #fa541c;
  }

  .remark-detail {
    line-height: 1.8;
    color: #666;
    padding: 10px 0;
  }
}
</style>
