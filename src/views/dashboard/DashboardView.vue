<template>
    <a-spin :spinning="state.loading">
        <a-row style="display: flex;flex-direction: row-reverse;">
            <a-button type="primary" @click="refresh">刷新
                <template #icon>
                    <UndoOutlined />
                </template>
            </a-button>
        </a-row>
        <div>
            <div style="width: 100%; height: 400px;">
                <div ref="chartContainer" class="chart-container"></div>
            </div>
        </div>
    </a-spin>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import api from "@/api/api";
import utils from "@/utils/utils";
import { message } from 'ant-design-vue';
import { DeleteFilled, UndoOutlined } from '@ant-design/icons-vue';

import Highcharts from "highcharts";
import { Chart } from 'highcharts-vue'
const chartContainer = ref(null);
const state = reactive({
    loading: false,
    chart: null,
    chartOptions: {
        chart: {
            type: 'line', // 图表类型，例如折线图
        },
        title: {
            text: '示例折线图',
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        yAxis: {
            title: {
                text: '数值',
            },
        },
        series: [
            {
                name: '数据系列 1',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5],
            },
            {
                name: '数据系列 2',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2],
            },
        ],
    }
});

const refresh = async () => {
}

onMounted(async () => {
    if (chartContainer.value) {
        state.chart = Highcharts.chart(chartContainer.value, state.chartOptions);
        console.log('Chart initialized:', state.chart);
    } else {
        console.error('Chart container not found');
    }
});

onUnmounted(() => {
    if (state.chart) {
        state.chart.destroy();
        state.chart = null;
    }
});

</script>

<style>
/* 可选：调整图表容器样式 */
.highcharts-container {
    width: 100%;
    height: 400px;
}
</style>