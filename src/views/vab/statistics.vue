<template>
  <div class="statistics-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY年MM月DD日"
              value-format="YYYY-MM-DD"
              @change="handleDateRangeChange"
              style="width: 300px; margin-right: 10px"
            />
            <el-button type="primary" @click="refreshData">刷新数据</el-button>
          </div>
        </div>
      </template>
      
      <!-- 统计概览 -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #409EFF">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.userCount }}</div>
                <div class="stat-label">用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #67C23A">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.taskCount }}</div>
                <div class="stat-label">任务总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #E6A23C">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.completedTaskCount }}</div>
                <div class="stat-label">已完成任务</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background-color: #F56C6C">
                <el-icon><Bell /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.notificationCount }}</div>
                <div class="stat-label">通知总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 图表区域 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card shadow="never" style="margin-bottom: 20px">
            <template #header>
              <span>用户增长趋势</span>
            </template>
            <div ref="userGrowthChart" style="height: 300px"></div>
          </el-card>
          
          <el-card shadow="never">
            <template #header>
              <span>任务完成情况</span>
            </template>
            <div ref="taskCompletionChart" style="height: 300px"></div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="never" style="margin-bottom: 20px">
            <template #header>
              <span>任务优先级分布</span>
            </template>
            <div ref="taskPriorityChart" style="height: 200px"></div>
          </el-card>
          
          <el-card shadow="never">
            <template #header>
              <span>用户活跃度</span>
            </template>
            <div ref="userActivityChart" style="height: 200px"></div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 数据表格 -->
      <el-card shadow="never" style="margin-top: 20px">
        <template #header>
          <span>详细数据</span>
        </template>
        <el-table :data="detailData" style="width: 100%">
          <el-table-column prop="name" label="指标名称" />
          <el-table-column prop="value" label="数值" />
          <el-table-column prop="change" label="较昨日变化">
            <template #default="{ row }">
              <span :class="row.change > 0 ? 'increase' : 'decrease'">
                <el-icon v-if="row.change > 0"><Top /></el-icon>
                <el-icon v-else-if="row.change < 0"><Bottom /></el-icon>
                {{ Math.abs(row.change) }}%
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { 
  User, 
  Document, 
  TrendCharts, 
  Bell, 
  Top, 
  Bottom 
} from "@element-plus/icons-vue";

export default {
  name: "Statistics",
  components: {
    User,
    Document,
    TrendCharts,
    Bell,
    Top,
    Bottom
  },
  data() {
    return {
      dateRange: [
        this.formatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)), // 30天前
        this.formatDate(new Date())
      ],
      statistics: {
        userCount: 1286,
        taskCount: 342,
        completedTaskCount: 218,
        notificationCount: 56
      },
      detailData: [
        { name: "新增用户数", value: "24", change: 5.2 },
        { name: "活跃用户数", value: "863", change: -2.1 },
        { name: "新增任务数", value: "12", change: 8.7 },
        { name: "完成任务数", value: "8", change: 3.4 },
        { name: "系统访问量", value: "1,245", change: 12.3 },
        { name: "平均响应时间", value: "128ms", change: -5.6 }
      ],
      userGrowthChart: null,
      taskCompletionChart: null,
      taskPriorityChart: null,
      userActivityChart: null
    };
  },
  mounted() {
    this.initCharts();
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.userGrowthChart) this.userGrowthChart.dispose();
    if (this.taskCompletionChart) this.taskCompletionChart.dispose();
    if (this.taskPriorityChart) this.taskPriorityChart.dispose();
    if (this.userActivityChart) this.userActivityChart.dispose();
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    handleDateRangeChange(value) {
      this.dateRange = value;
      this.refreshData();
    },
    refreshData() {
      this.$message.success("数据已刷新");
      // 模拟数据刷新
    },
    initCharts() {
      // 用户增长趋势图
      this.userGrowthChart = echarts.init(this.$refs.userGrowthChart);
      this.userGrowthChart.setOption(this.getUserGrowthChartOption());
      
      // 任务完成情况图
      this.taskCompletionChart = echarts.init(this.$refs.taskCompletionChart);
      this.taskCompletionChart.setOption(this.getTaskCompletionChartOption());
      
      // 任务优先级分布图
      this.taskPriorityChart = echarts.init(this.$refs.taskPriorityChart);
      this.taskPriorityChart.setOption(this.getTaskPriorityChartOption());
      
      // 用户活跃度图
      this.userActivityChart = echarts.init(this.$refs.userActivityChart);
      this.userActivityChart.setOption(this.getUserActivityChartOption());
    },
    getUserGrowthChartOption() {
      return {
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            data: [120, 132, 101, 134, 90, 230],
            smooth: true
          },
          {
            name: "活跃用户",
            type: "line",
            data: [220, 182, 191, 234, 290, 330],
            smooth: true
          }
        ]
      };
    },
    getTaskCompletionChartOption() {
      return {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["已创建", "已完成"]
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "已创建",
            type: "bar",
            data: [120, 200, 150, 80, 70, 110, 130]
          },
          {
            name: "已完成",
            type: "bar",
            data: [80, 150, 100, 60, 50, 90, 100]
          }
        ]
      };
    },
    getTaskPriorityChartOption() {
      return {
        tooltip: {
          trigger: "item"
        },
        legend: {
          bottom: "0%"
        },
        series: [
          {
            name: "任务优先级",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 32, name: "高优先级" },
              { value: 48, name: "中优先级" },
              { value: 20, name: "低优先级" }
            ]
          }
        ]
      };
    },
    getUserActivityChartOption() {
      return {
        tooltip: {
          trigger: "item"
        },
        legend: {
          bottom: "0%"
        },
        series: [
          {
            name: "用户活跃度",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 65, name: "活跃用户" },
              { value: 35, name: "非活跃用户" }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      
      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        
        .el-icon {
          font-size: 24px;
          color: white;
        }
      }
      
      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .stat-label {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
  
  .increase {
    color: #67C23A;
    font-weight: bold;
  }
  
  .decrease {
    color: #F56C6C;
    font-weight: bold;
  }
}
</style>