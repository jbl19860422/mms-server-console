import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import '@/assets/css/global.less';
import 'ant-design-vue/dist/reset.css';
import Highchart from "highcharts/highcharts";//基础组件
import HighchartsVue from 'highcharts-vue';

const app = createApp(App);
app.use(HighchartsVue);
app.use(Antd).use(router).mount('#app');
