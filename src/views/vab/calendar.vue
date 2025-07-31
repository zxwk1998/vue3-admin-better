<template>
  <div class="calendar-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>日历</span>
          <div class="header-actions">
            <el-button @click="prevMonth">上个月</el-button>
            <el-button @click="nextMonth">下个月</el-button>
            <el-button type="primary" @click="goToToday">今天</el-button>
            <el-date-picker
              v-model="currentDate"
              type="month"
              placeholder="选择月份"
              format="YYYY年MM月"
              value-format="YYYY-MM"
              @change="handleMonthChange"
              style="margin-left: 10px; width: 150px"
            />
          </div>
        </div>
      </template>
      
      <div class="calendar-wrapper">
        <div class="weekdays">
          <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        
        <div class="calendar-grid">
          <!-- 空白日期格子（上个月） -->
          <div 
            class="calendar-day empty" 
            v-for="n in firstDayOfMonth" 
            :key="`empty-${n}`"
          ></div>
          
          <!-- 当前月的日期 -->
          <div 
            class="calendar-day"
            v-for="day in daysInMonth"
            :key="`day-${day}`"
            :class="{ 
              today: isToday(day),
              selected: isSelected(day),
              hasEvents: hasEvents(day)
            }"
            @click="selectDay(day)"
          >
            <div class="day-number">{{ day }}</div>
            <div class="events-indicator">
              <div 
                class="event-dot" 
                v-for="(event, index) in getEventsForDay(day)"
                :key="index"
                :style="{ backgroundColor: event.color }"
                :title="event.title"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 事件列表 -->
      <div class="events-panel" v-if="selectedDateEvents.length > 0">
        <h3>{{ selectedDateString }} 的事件</h3>
        <el-table :data="selectedDateEvents" style="width: 100%">
          <el-table-column prop="title" label="事件标题" />
          <el-table-column prop="time" label="时间" width="120" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="text" @click="editEvent(row)">编辑</el-button>
              <el-button type="text" @click="deleteEvent(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div style="margin-top: 20px; text-align: center">
          <el-button type="primary" @click="showAddEventDialog">添加事件</el-button>
        </div>
      </div>
      
      <div class="events-panel no-events" v-else>
        <p>请选择一个日期来查看或添加事件</p>
        <el-button type="primary" @click="showAddEventDialog" :disabled="!selectedDate">
          添加事件
        </el-button>
      </div>
    </el-card>
    
    <!-- 添加/编辑事件对话框 -->
    <el-dialog 
      v-model="eventDialogVisible" 
      :title="editingEvent ? '编辑事件' : '添加事件'"
      width="500px"
    >
      <el-form
        ref="eventFormRef"
        :model="eventForm"
        :rules="eventRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="eventForm.title" />
        </el-form-item>
        
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="eventForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="时间" prop="time">
          <el-time-picker
            v-model="eventForm.time"
            placeholder="选择时间"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="eventForm.description" 
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="颜色">
          <el-color-picker v-model="eventForm.color" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eventDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveEvent"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      currentDate: this.formatDate(new Date(), 'YYYY-MM'), // 当前选中的月份
      selectedDate: null, // 当前选中的日期
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      events: [
        {
          id: 1,
          title: '项目会议',
          date: this.formatDate(new Date(), 'YYYY-MM-DD'),
          time: '14:00',
          description: '讨论项目进度和下一步计划',
          color: '#409EFF'
        },
        {
          id: 2,
          title: '团队聚餐',
          date: this.formatDate(this.addDays(new Date(), 2), 'YYYY-MM-DD'),
          time: '18:30',
          description: '季度团队聚餐活动',
          color: '#67C23A'
        },
        {
          id: 3,
          title: '产品发布',
          date: this.formatDate(this.addDays(new Date(), 5), 'YYYY-MM-DD'),
          time: '10:00',
          description: '新产品正式发布',
          color: '#E6A23C'
        }
      ],
      eventDialogVisible: false,
      editingEvent: null,
      eventForm: {
        title: '',
        date: '',
        time: '',
        description: '',
        color: '#409EFF'
      },
      eventRules: {
        title: [
          { required: true, message: '请输入事件标题', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    // 当前月份的第一天是星期几 (0-6, 0表示星期日)
    firstDayOfMonth() {
      const date = new Date(`${this.currentDate}-01`);
      return date.getDay();
    },
    // 当前月份的天数
    daysInMonth() {
      const date = new Date(this.currentDate);
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    // 选中日期的事件
    selectedDateEvents() {
      if (!this.selectedDate) return [];
      return this.events.filter(event => event.date === this.selectedDate);
    },
    // 选中日期的显示字符串
    selectedDateString() {
      if (!this.selectedDate) return '';
      const date = new Date(this.selectedDate);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },
  methods: {
    // 格式化日期
    formatDate(date, format) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
    },
    // 添加天数
    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
    // 上个月
    prevMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() - 1);
      this.currentDate = this.formatDate(date, 'YYYY-MM');
    },
    // 下个月
    nextMonth() {
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() + 1);
      this.currentDate = this.formatDate(date, 'YYYY-MM');
    },
    // 回到今天
    goToToday() {
      this.currentDate = this.formatDate(new Date(), 'YYYY-MM');
      this.selectedDate = this.formatDate(new Date(), 'YYYY-MM-DD');
    },
    // 月份改变
    handleMonthChange(value) {
      this.currentDate = value;
    },
    // 判断是否是今天
    isToday(day) {
      const today = new Date();
      const currentMonth = new Date(this.currentDate);
      return (
        today.getFullYear() === currentMonth.getFullYear() &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getDate() === day
      );
    },
    // 判断是否是选中的日期
    isSelected(day) {
      if (!this.selectedDate) return false;
      const selected = new Date(this.selectedDate);
      const currentMonth = new Date(this.currentDate);
      return (
        selected.getFullYear() === currentMonth.getFullYear() &&
        selected.getMonth() === currentMonth.getMonth() &&
        selected.getDate() === day
      );
    },
    // 判断是否有事件
    hasEvents(day) {
      const dateStr = `${this.currentDate}-${String(day).padStart(2, '0')}`;
      return this.events.some(event => event.date === dateStr);
    },
    // 获取某天的事件
    getEventsForDay(day) {
      const dateStr = `${this.currentDate}-${String(day).padStart(2, '0')}`;
      return this.events.filter(event => event.date === dateStr);
    },
    // 选择日期
    selectDay(day) {
      this.selectedDate = `${this.currentDate}-${String(day).padStart(2, '0')}`;
    },
    // 显示添加事件对话框
    showAddEventDialog() {
      this.editingEvent = null;
      this.eventForm = {
        title: '',
        date: this.selectedDate || this.formatDate(new Date(), 'YYYY-MM-DD'),
        time: '',
        description: '',
        color: '#409EFF'
      };
      this.eventDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.eventFormRef.resetFields();
      });
    },
    // 编辑事件
    editEvent(event) {
      this.editingEvent = event;
      this.eventForm = { ...event };
      this.eventDialogVisible = true;
    },
    // 删除事件
    deleteEvent(event) {
      this.$confirm(`确定要删除事件"${event.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.events.findIndex(e => e.id === event.id);
        if (index !== -1) {
          this.events.splice(index, 1);
          this.$message.success('事件删除成功');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 保存事件
    saveEvent() {
      this.$refs.eventFormRef.validate((valid) => {
        if (valid) {
          if (this.editingEvent) {
            // 编辑事件
            const index = this.events.findIndex(e => e.id === this.editingEvent.id);
            if (index !== -1) {
              this.events[index] = { ...this.editingEvent, ...this.eventForm };
              this.$message.success('事件更新成功');
            }
          } else {
            // 添加事件
            const newEvent = {
              id: Date.now(), // 简单的ID生成方式
              ...this.eventForm
            };
            this.events.push(newEvent);
            this.$message.success('事件添加成功');
          }
          this.eventDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar-container {
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
  
  .calendar-wrapper {
    margin: 20px 0;
    
    .weekdays {
      display: flex;
      border: 1px solid #EBEEF5;
      border-bottom: 0;
      
      .weekday {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        background-color: #F2F6FC;
        font-weight: bold;
      }
    }
    
    .calendar-grid {
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #EBEEF5;
      border-top: 0;
      
      .calendar-day {
        flex: 0 0 calc(100% / 7);
        min-height: 100px;
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
        padding: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
        position: relative;
        
        &:nth-child(7n) {
          border-right: 0;
        }
        
        &:hover {
          background-color: #F2F6FC;
        }
        
        &.today {
          background-color: #E6F2FF;
          
          .day-number {
            color: #409EFF;
            font-weight: bold;
          }
        }
        
        &.selected {
          background-color: #E6F2FF;
          border: 2px solid #409EFF;
          padding: 3px;
        }
        
        &.empty {
          background-color: #FAFAFA;
          cursor: default;
          
          &:hover {
            background-color: #FAFAFA;
          }
        }
        
        .day-number {
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .events-indicator {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          
          .event-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
        }
      }
    }
  }
  
  .events-panel {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #EBEEF5;
    
    &.no-events {
      text-align: center;
      padding: 40px 0;
      
      p {
        margin-bottom: 20px;
        color: #909399;
      }
    }
  }
}
</style>