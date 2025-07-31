<template>
  <div class="chart-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <div ref="barChartRef" class="chart-wrapper" style="height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div ref="lineChartRef" class="chart-wrapper" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card shadow="never">
          <div ref="pieChartRef" class="chart-wrapper" style="height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div ref="areaChartRef" class="chart-wrapper" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Chart",
  data() {
    return {
      barChart: null,
      lineChart: null,
      pieChart: null,
      areaChart: null,
    };
  },
  mounted() {
    this.initCharts();
  },
  beforeUnmount() {
    if (this.barChart) {
      this.barChart.dispose();
    }
    if (this.lineChart) {
      this.lineChart.dispose();
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    if (this.areaChart) {
      this.areaChart.dispose();
    }
  },
  methods: {
    initCharts() {
      // 初始化柱状图
      this.barChart = echarts.init(this.$refs.barChartRef);
      this.barChart.setOption(this.getBarChartOption());

      // 初始化折线图
      this.lineChart = echarts.init(this.$refs.lineChartRef);
      this.lineChart.setOption(this.getLineChartOption());

      // 初始化饼图
      this.pieChart = echarts.init(this.$refs.pieChartRef);
      this.pieChart.setOption(this.getPieChartOption());

      // 初始化面积图
      this.areaChart = echarts.init(this.$refs.areaChartRef);
      this.areaChart.setOption(this.getAreaChartOption());
    },
    getBarChartOption() {
      return {
        title: {
          text: "柱状图示例",
        },
        tooltip: {},
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
          },
        ],
      };
    },
    getLineChartOption() {
      return {
        title: {
          text: "折线图示例",
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
          },
        ],
      };
    },
    getPieChartOption() {
      return {
        title: {
          text: "饼图示例",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
              { value: 484, name: "联盟广告" },
              { value: 300, name: "视频广告" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
    getAreaChartOption() {
      return {
        title: {
          text: "面积图示例",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            areaStyle: {},
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 20px;

  .chart-wrapper {
    width: 100%;
  }
}
</style>