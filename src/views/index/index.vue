<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-alert v-if="noticeList">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <a
              href="https://github.com/zxwk1998/vue-admin-better"
              target="_blank"
            >
              <img
                src="https://img.shields.io/github/stars/zxwk1998/vue-admin-better?style=flat-square&label=Stars&logo=github"
                style="margin-right: 10px"
              />
            </a>
            <p v-html="noticeList.notice"></p>
          </div>
        </el-alert>
      </el-col>
      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :lg="6"
        :md="6"
        :sm="6"
        :xl="3"
        :xs="12"
      >
        <el-card class="icon-card" shadow="never">
          <div class="icon-container" @click="handleIconClick(item)">
            <div class="icon-header">
              <div class="icon-wrapper" :style="{ background: item.color }">
                <el-icon>
                  <component :is="getIconComponent(item.icon)" />
                </el-icon>
              </div>
              <div class="icon-title">{{ item.title }}</div>
            </div>
            <div class="icon-content">
              <div class="icon-description">
                {{ getIconDescription(item.title) }}
              </div>
            </div>
            <div class="icon-footer">
              <div class="icon-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon>
                  <span>{{ getRandomViews() }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Heart /></el-icon>
                  <span>{{ getRandomLikes() }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span>访问量</span>
          </template>
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">
                <span>今日访问趋势</span>
              </div>
              <div class="chart-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ config1.endVal }}</div>
                  <div class="stat-label">总访问量</div>
                </div>
              </div>
            </div>
            <div class="chart-content">
              <vab-chart autoresize :option="fwl" />
            </div>
            <div class="chart-footer">
              <div class="trend-info">
                <div class="trend-item">
                  <el-icon class="trend-up"><ArrowUp /></el-icon>
                  <span class="trend-text">较昨日增长 12.5%</span>
                </div>
                <div class="trend-item">
                  <el-icon class="trend-icon"><User /></el-icon>
                  <span class="trend-text">活跃用户 2.3K</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span>授权数</span>
          </template>
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">
                <span>授权统计</span>
              </div>
              <div class="chart-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ config2.endVal }}</div>
                  <div class="stat-label">总授权数</div>
                </div>
              </div>
            </div>
            <div class="chart-content">
              <vab-chart autoresize :option="sqs" />
            </div>
            <div class="chart-footer">
              <div class="trend-info">
                <div class="trend-item">
                  <el-icon class="trend-up"><ArrowUp /></el-icon>
                  <span class="trend-text">较昨日增长 8.3%</span>
                </div>
                <div class="trend-item">
                  <el-icon class="trend-icon"><Clock /></el-icon>
                  <span class="trend-text">今日新增 156</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span>用户活跃度</span>
          </template>
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">
                <span>用户活跃统计</span>
              </div>
              <div class="chart-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ config3.endVal }}</div>
                  <div class="stat-label">活跃用户</div>
                </div>
              </div>
            </div>
            <div class="chart-content">
              <vab-chart autoresize :option="userActivity" />
            </div>
            <div class="chart-footer">
              <div class="trend-info">
                <div class="trend-item">
                  <el-icon class="trend-up"><ArrowUp /></el-icon>
                  <span class="trend-text">较昨日增长 15.2%</span>
                </div>
                <div class="trend-item">
                  <el-icon class="trend-icon"><Clock /></el-icon>
                  <span class="trend-text">在线时长 2.5h</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <el-card shadow="never">
          <template #header>
            <span>系统性能</span>
          </template>
          <div class="chart-container">
            <div class="chart-header">
              <div class="chart-title">
                <span>性能监控</span>
              </div>
              <div class="chart-stats">
                <div class="stat-item">
                  <div class="stat-value">98.5%</div>
                  <div class="stat-label">系统可用性</div>
                </div>
              </div>
            </div>
            <div class="chart-content">
              <vab-chart autoresize :option="systemPerformance" />
            </div>
            <div class="chart-footer">
              <div class="trend-info">
                <div class="trend-item">
                  <el-icon class="trend-up"><CheckCircle /></el-icon>
                  <span class="trend-text">运行正常</span>
                </div>
                <div class="trend-item">
                  <el-icon class="trend-icon"><Monitor /></el-icon>
                  <span class="trend-text">响应时间 120ms</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>依赖信息</span>
            <!-- <div style="float: right">部署时间:{{ updateTime }}</div> -->
          </div>
          <!-- rspack -->
          <div class="rspack-info">
            <div class="rspack-item">
              <div class="rspack-name">Rspack版本</div>
              <div class="rspack-version">{{ devDependencies["rspack"] }}</div>
            </div>
          </div>

          <div class="dependency-content">
            <div class="dependency-grid">
              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Vue版本</div>
                  <div class="dependency-version">
                    {{ dependencies["vue"] }}
                  </div>
                </div>
              </div>

              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Vuex版本</div>
                  <div class="dependency-version">
                    {{ dependencies["vuex"] }}
                  </div>
                </div>
              </div>

              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Vue Router</div>
                  <div class="dependency-version">
                    {{ dependencies["vue-router"] }}
                  </div>
                </div>
              </div>

              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Element Plus</div>
                  <div class="dependency-version">
                    {{ dependencies["element-plus"] }}
                  </div>
                </div>
              </div>

              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Axios版本</div>
                  <div class="dependency-version">
                    {{ dependencies["axios"] }}
                  </div>
                </div>
              </div>

              <div class="dependency-item">
                <div class="dependency-info">
                  <div class="dependency-name">Sass版本</div>
                  <div class="dependency-version">
                    {{ devDependencies["sass"] }}
                  </div>
                </div>
              </div>
            </div>

            <div class="system-info">
              <div class="info-header">
                <vab-icon :icon="['fas', 'info-circle']" />
                <span>系统信息</span>
              </div>
              <div class="info-content">
                <div class="info-item">
                  <span class="info-label">构建时间:</span>
                  <span class="info-value">{{ updateTime || "未知" }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">运行环境:</span>
                  <span class="info-value">{{ nodeEnv }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">用户代理:</span>
                  <span class="info-value">{{ userAgent }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VabChart from "@/plugins/echarts";
import { dependencies, devDependencies } from "../../../package.json";
import { getNoticeList } from "@/api/notice";
import { random } from "lodash-es";
import {
  View,
  ArrowUp,
  User,
  Clock,
  Monitor,
  Bell,
  Reading,
  Present,
  Mug,
  Grid,
  VideoPlay,
  More,
  Promotion,
  Picture,
} from "@element-plus/icons-vue";

export default {
  name: "Index",
  components: {
    VabChart,
    View,
    ArrowUp,
    User,
    Clock,
    Monitor,
    Bell,
    Reading,
    Present,
    Mug,
    Grid,
    VideoPlay,
    More,
    Promotion,
    Picture,
  },
  data() {
    return {
      timer: 0,
      updateTime: process.env.VUE_APP_UPDATE_TIME,
      nodeEnv: process.env.NODE_ENV,
      dependencies: dependencies,
      devDependencies: devDependencies,
      config1: {
        startVal: 0,
        endVal: random(20000, 60000),
        decimals: 0,
        prefix: "",
        suffix: "",
        separator: ",",
        duration: 8000,
      },
      config2: {
        startVal: 0,
        endVal: random(1000, 20000),
        decimals: 0,
        prefix: "",
        suffix: "",
        separator: ",",
        duration: 8000,
      },
      config3: {
        startVal: 0,
        endVal: random(1000, 20000),
        decimals: 0,
        prefix: "",
        suffix: "",
        separator: ",",
        duration: 8000,
      },

      //访问量
      fwl: {
        color: ["#409EFF", "#8B5CF6", "#A855F7", "#C084FC", "#E879F9"],
        backgroundColor: "transparent",
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [],
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#E4E7ED",
              },
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
            splitLine: {
              lineStyle: {
                color: "#F5F7FA",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "访问量",
            type: "line",
            data: [],
            smooth: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              width: 3,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#409EFF" },
                  { offset: 1, color: "#8B5CF6" },
                ],
              },
            },
            itemStyle: {
              color: "#409EFF",
              borderWidth: 2,
              borderColor: "#fff",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(64, 158, 255, 0.3)" },
                  { offset: 1, color: "rgba(139, 92, 246, 0.1)" },
                ],
              },
            },
          },
        ],
      },
      //授权数
      sqs: {
        color: ["#409EFF", "#8B5CF6", "#A855F7", "#C084FC", "#E879F9"],
        backgroundColor: "transparent",
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["0时", "4时", "8时", "12时", "16时", "20时", "24时"],
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#E4E7ED",
              },
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
            splitLine: {
              lineStyle: {
                color: "#F5F7FA",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "授权数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 20, 33, 39, 33, 22],
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#409EFF" },
                  { offset: 1, color: "#8B5CF6" },
                ],
              },
              borderRadius: [6, 6, 0, 0],
              shadowColor: "rgba(64, 158, 255, 0.3)",
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 5,
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                  { offset: 0, color: "#409EFF" },
                  { offset: 1, color: "#7C3AED" },
                ],
                },
                shadowBlur: 15,
                shadowColor: "rgba(64, 158, 255, 0.5)"
              },
            },
          },
        ],
      },

      //用户活跃度
      userActivity: {
        color: ["#409EFF", "#8B5CF6", "#A855F7", "#C084FC", "#E879F9"],
        backgroundColor: "transparent",
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#E4E7ED",
              },
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
            splitLine: {
              lineStyle: {
                color: "#F5F7FA",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "活跃用户",
            type: "line",
            data: [1200, 1350, 1100, 1400, 1600, 1800, 1500],
            smooth: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              width: 3,
              color: "#409EFF",
            },
            itemStyle: {
              color: "#409EFF",
              borderWidth: 2,
              borderColor: "#fff",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(103, 122, 228, 0.3)" },
                  { offset: 1, color: "rgba(103, 122, 228, 0.1)" },
                ],
              },
            },
          },
        ],
      },

      //系统性能
      systemPerformance: {
        color: ["#409EFF", "#8B5CF6", "#A855F7", "#C084FC"],
        backgroundColor: "transparent",
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["CPU", "内存", "磁盘", "网络"],
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#E4E7ED",
              },
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            max: 100,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#909399",
              fontSize: 11,
              formatter: "{value}%",
            },
            splitLine: {
              lineStyle: {
                color: "#F5F7FA",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "使用率",
            type: "bar",
            data: [45, 62, 38, 28],
            barWidth: "50%",
            itemStyle: {
              color: function (params) {
                const colors = ["#409EFF", "#8B5CF6", "#A855F7", "#C084FC"];
                return colors[params.dataIndex];
              },
              borderRadius: [4, 4, 0, 0],
            },
            label: {
              show: true,
              position: "top",
              formatter: "{c}%",
              color: "#2c3e50",
              fontSize: 12,
            },
          },
        ],
      },

      //更新日志
      reverse: true,
      activities: [],
      noticeList: [],
      //其他信息
      userAgent: navigator.userAgent,
      //卡片图标
      iconList: [
        {
          icon: "video",
          title: "视频播放器",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#ffc069",
        },
        {
          icon: "table",
          title: "表格",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#5cdbd3",
        },
        {
          icon: "laptop-code",
          title: "源码",
          link: "https://github.com/zxwk1998/vue-admin-better",
          color: "#b37feb",
        },
        {
          icon: "book",
          title: "书籍",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#69c0ff",
        },
        {
          icon: "bullhorn",
          title: "公告",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#ff85c0",
        },
        {
          icon: "gift",
          title: "礼物",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#ffd666",
        },

        {
          icon: "balance-scale-left",
          title: "公平的世界",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#ff9c6e",
        },
        {
          icon: "coffee",
          title: "休息一下",
          link: "https://vuejs-core.cn/shop-vite",
          color: "#95de64",
        },
      ],
    };
  },
  created() {
    this.fetchData();
    const now = new Date();
    const oneDay = 3600 * 1000 * 24;
    const date = [];
    const data = [];

    const addData = (shift) => {
      const dateStr = [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      ].join("/");
      date.push(dateStr);
      data.push(random(20000, 60000));

      if (shift) {
        date.shift();
        data.shift();
      }

      now.setTime(now.getTime() + oneDay);
    };

    for (let i = 1; i < 6; i++) {
      addData();
    }
    addData(true);
    this.fwl.xAxis[0].data = date;
    this.fwl.series[0].data = data;
    this.timer = setInterval(() => {
      addData(true);
      this.fwl.xAxis[0].data = date;
      this.fwl.series[0].data = data;
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    let base = +new Date(2020, 1, 1);
    let oneDay = 24 * 3600 * 1000;
    let date = [];

    let data = [random(20000, 60000)];
    let now = new Date(base);

    const addData = (shift) => {
      now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/");
      date.push(now);
      data.push(random(20000, 60000));

      if (shift) {
        date.shift();
        data.shift();
      }

      now = new Date(+new Date(now) + oneDay);
    };

    for (let i = 1; i < 6; i++) {
      addData();
    }
    addData(true);
    this.fwl.xAxis[0].data = date;
    this.fwl.series[0].data = data;
    this.timer = setInterval(() => {
      addData(true);
      this.fwl.xAxis[0].data = date;
      this.fwl.series[0].data = data;
    }, 3000);
  },
  methods: {
    handleClick(e) {
      this.$baseMessage(`点击了${e.name},这里可以写跳转`);
    },
    handleZrClick() {},
    handleChangeTheme() {
      // 不再使用事件总线
      // this.$baseEventBus.$emit('theme')
      // 直接打开主题设置
      this.drawerVisible = true;
    },
    async fetchData() {
      try {
        const res = await getNoticeList();
        this.noticeList = res.data;
      } catch (error) {
        console.error("获取通知列表失败:", error);
      }
    },
    handleIconClick(item) {
      if (item.link) {
        window.open(item.link, "_blank");
      }
    },
    getIconDescription(title) {
      const descriptions = {
        视频播放器: "支持多种格式的视频播放",
        表格: "功能强大的数据表格组件",
        源码: "开源项目源码下载",
        书籍: "技术文档和教程",
        公告: "系统公告和通知",
        礼物: "免费资源和福利",
        公平的世界: "开源社区贡献",
        休息一下: "放松心情，享受生活",
      };
      return descriptions[title] || "功能模块";
    },
    getRandomViews() {
      return `${random(100, 999)}K`;
    },
    getRandomLikes() {
      return `${random(10, 99)}K`;
    },
    // 将FontAwesome图标名称转换为Element Plus图标组件
    getIconComponent(iconName) {
      // 映射FontAwesome图标名称到Element Plus图标
      const iconMap = {
        video: "VideoPlay",
        table: "Grid",
        code: "Promotion",
        book: "Reading",
        bullhorn: "Bell",
        gift: "Present",
        coffee: "Mug",
        eye: "View",
        heart: "Heart",
        "arrow-up": "ArrowUp",
        users: "User",
        clock: "Clock",
        "check-circle": "CheckCircle",
        server: "Monitor",
        // 添加更多映射...
      };

      // 获取映射的组件名或使用默认图标
      return iconMap[iconName] || "More";
    },
  },
};
</script>
<style lang="scss" scoped>
.index-container {
  padding: 0 !important;
  margin: 0 !important;
  background: #f5f7f8 !important;

  :deep() {
    .el-alert {
      padding: $base-padding;

      &--info.is-light {
        min-height: 82px;
        padding: $base-padding;
        margin-bottom: 15px;
        color: #909399;
        background-color: $base-color-white;
        border: 1px solid #ebeef5;
        font-size: 14px !important;
        * {
          font-size: 14px !important;
        }
      }
    }

    .el-card__body {
      .echarts {
        width: 100%;
        height: 115px;
      }
    }
  }

  .card {
    height: 600px;
    display: flex;
    flex-direction: column;

    :deep() {
      .el-card__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .echarts {
          width: 100%;
          height: 305px;
        }
      }
    }

    .dependency-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .dependency-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 25px;
        flex-shrink: 0;

        .dependency-item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            background: #ffffff;
          }

          .dependency-info {
            flex: 1;
            text-align: center;

            .dependency-name {
              font-size: 0.9rem;
              color: #6c757d;
              margin-bottom: 6px;
              font-weight: 500;
            }

            .dependency-version {
              font-size: 1.1rem;
              color: #2c3e50;
              font-weight: 600;
            }
          }
        }
      }

      .system-info {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        flex-shrink: 0;

        .info-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #dee2e6;

          .vab-icon {
            color: #409EFF;
            margin-right: 3px;
            font-size: 1.1rem;
          }

          span {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
          }
        }

        .info-content {
          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f1f3f4;

            &:last-child {
              border-bottom: none;
            }

            .info-label {
              color: #6c757d;
              font-weight: 500;
              font-size: 0.9rem;
            }

            .info-value {
              color: #2c3e50;
              font-weight: 600;
              font-size: 0.9rem;
              max-width: 60%;
              text-align: right;
              word-break: break-all;
            }
          }
        }
      }
    }
  }

  .bottom {
    padding-top: 20px;
    margin-top: 5px;
    color: #595959;
    text-align: left;
    border-top: 1px solid $base-border-color;
  }

  .table {
    width: 100%;
    color: #666;
    border-collapse: collapse;
    background-color: #fff;

    td {
      position: relative;
      min-height: 20px;
      padding: 9px 15px;
      font-size: 14px;
      line-height: 20px;
      border: 1px solid #e6e6e6;

      &:nth-child(odd) {
        width: 20%;
        text-align: right;
        background-color: #f7f7f7;
      }
    }
  }

  .icon-panel {
    height: 117px;
    text-align: center;
    cursor: pointer;

    svg {
      font-size: 40px;
    }

    p {
      margin-top: 10px;
    }
  }

  .bottom-btn {
    button {
      margin: 5px 10px 15px 0;
    }
  }

  // 高级信息卡片样式
  .advanced-info-card {
    height: 600px;
    overflow: hidden;

    .advanced-content {
      height: 100%;
      padding: 30px 25px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      overflow-y: auto;

      .logo-section {
        text-align: center;
        margin-bottom: 30px;
        flex-shrink: 0;

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;

          .advanced-logo {
            font-size: 120px;
            position: relative;
            z-index: 2;
          }

          .logo-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 140px;
            height: 140px;
            background: radial-gradient(
              circle,
              rgba(64, 158, 255, 0.1) 0%,
              transparent 70%
            );
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }
        }

        .project-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 10px 0;
        }

        .project-description {
          color: #7f8c8d;
          font-size: 1rem;
          margin: 0;
        }
      }

      .stats-section {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        flex-shrink: 0;

        .stat-card {
          text-align: center;
          padding: 15px;
          transition: all 0.3s ease;

          .stat-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, #409EFF, #8b5cf6);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            color: white;
            font-size: 1.2rem;
          }

          .stat-info {
            .stat-number {
              font-size: 1.5rem;
              font-weight: 700;
              color: #2c3e50;
              margin-bottom: 5px;
            }

            .stat-label {
              font-size: 0.9rem;
              color: #7f8c8d;
            }
          }
        }
      }

      .action-section {
        flex: 1;
        overflow-y: auto;

        .action-group {
          margin-bottom: 25px;

          &:last-child {
            margin-bottom: 0;
          }

          .action-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #ecf0f1;
          }

          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;

            .action-btn {
              flex: 1;
              min-width: 200px;
              height: 45px;
              border-radius: 10px;
              font-weight: 600;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;

              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
              }

              &.primary-btn {
                background: #409EFF;
                border: none;
                color: white;

                &:hover {
                  background: #5a67d8;
                }
              }

              &.premium-btn {
                background: linear-gradient(45deg, #f093fb, #f5576c);
                border: none;
                color: white;

                &:hover {
                  background: linear-gradient(45deg, #e085e7, #e54b5f);
                }
              }
            }

            .premium-card {
              flex: 1;
              min-width: 180px;
              background: linear-gradient(135deg, #409EFF 0%, #8b5cf6 100%);
              border-radius: 15px;
              padding: 20px;
              cursor: pointer;
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
              color: white;
              border: none;

              &:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(103, 122, 228, 0.3);
              }

              &.featured {
                background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);

                &:hover {
                  box-shadow: 0 10px 25px rgba(230, 162, 60, 0.3);
                }

                .premium-badge {
                  background: rgba(255, 255, 255, 0.2);
                  color: #fff;
                }
              }

              .premium-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;

                .premium-icon {
                  font-size: 1.5rem;
                  color: rgba(255, 255, 255, 0.9);
                }

                .premium-badge {
                  background: rgba(255, 255, 255, 0.2);
                  color: rgba(255, 255, 255, 0.9);
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 0.7rem;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                }
              }

              .premium-content {
                .premium-title {
                  font-size: 1.1rem;
                  font-weight: 700;
                  margin-bottom: 8px;
                  color: white;
                }

                .premium-price {
                  font-size: 1.3rem;
                  font-weight: 800;
                  margin-bottom: 5px;
                  color: white;
                }
              }
            }
          }
        }
      }
    }
  }

  // 图表容器高级样式
  .chart-container {
    height: 200px;
    display: flex;
    flex-direction: column;

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;

      .chart-title {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;

        .vab-icon {
            color: #409EFF;
            margin-right: 3px;
            font-size: 1.1rem;
          }
      }

      .chart-stats {
        .stat-item {
          text-align: right;

          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2c3e50;
            line-height: 1;
          }

          .stat-label {
            font-size: 0.8rem;
            color: #7f8c8d;
            margin-top: 2px;
          }
        }
      }
    }

    .chart-content {
      flex: 1;
      margin-bottom: 15px;
      min-height: 0;

      .echarts {
        height: 100% !important;
        min-height: 120px;
      }
    }

    .chart-footer {
      flex-shrink: 0;

      .trend-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .trend-item {
          display: flex;
          align-items: center;
          font-size: 0.85rem;

          .trend-up {
            color: #8b5cf6;
            margin-right: 3px;
            font-size: 0.8rem;
          }

          .trend-icon {
            color: #409EFF;
            margin-right: 3px;
            font-size: 0.8rem;
          }

          .trend-text {
            color: #7f8c8d;
          }
        }
      }
    }
  }

  // 图表卡片固定高度
  .el-card {
    height: 280px;
    display: flex;
    flex-direction: column;

    :deep() {
      .el-card__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    }
  }

  // 高级信息卡片和依赖信息卡片不受影响
  .advanced-info-card,
  .card {
    height: auto !important;
  }

  // 图标卡片高级样式
  .icon-card {
    height: 200px;
    display: flex;
    flex-direction: column;

    .icon-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
      }

      .icon-header {
        text-align: center;
        margin-bottom: 15px;
        flex-shrink: 0;

        .icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }

        .icon-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }
      }

      .icon-content {
        flex: 1;
        margin-bottom: 15px;
        min-height: 0;

        .icon-description {
          font-size: 0.85rem;
          color: #7f8c8d;
          text-align: center;
          line-height: 1.4;
          padding: 0 10px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .icon-footer {
        flex-shrink: 0;

        .icon-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
          border-top: 1px solid #f0f0f0;

          .stat-item {
            display: flex;
            align-items: center;
            font-size: 0.8rem;
            color: #7f8c8d;

            .vab-icon {
              margin-right: 3px;
              font-size: 0.7rem;
            }

            span {
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
