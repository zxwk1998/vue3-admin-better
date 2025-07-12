import { ref } from "vue";
import mitt from "mitt";

// 创建一个事件发射器实例
const emitter = mitt();

// 导出事件总线
export default emitter;
