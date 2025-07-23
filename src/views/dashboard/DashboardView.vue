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
            <div style="width: 100%; height: 400px; display:flex;">
                <div ref="memUsage"></div>
                <div ref="chartContainer"></div>
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
const memUsage = ref(null);

const state = reactive({
    loading: false,
    chart: null,
    memUsageChart: null,
    memUsageTimer: null,
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
    },
    memUsageChartOptions: {
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },

        title: {
            text: 'Mem Usage'
        },

        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '75%'],
            size: '110%'
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
                distance: 20,
                style: {
                    fontSize: '14px'
                }
            },
            lineWidth: 0,
            plotBands: [{
                from: 0,
                to: 70,
                color: '#55BF3B', // green
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 70,
                to: 90,
                color: '#DDDF0D', // red
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 90,
                to: 100,
                color: '#DF5353', // yellow
                thickness: 20
            }]
        },

        series: [{
            name: 'Usage',
            data: [80],
            tooltip: {
                valueSuffix: ' %'
            },
            dataLabels: {
                format: '{y} %',
                borderWidth: 0,
                color: (
                    Highcharts.defaultOptions.title &&
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || '#333333',
                style: {
                    fontSize: '16px'
                }
            },
            dial: {
                radius: '80%',
                backgroundColor: 'gray',
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: {
                backgroundColor: 'gray',
                radius: 6
            }

        }]
    }
});

const refresh = async () => {
}

onMounted(async () => {
    if (memUsage.value) {
        state.memUsageChart = window.Highcharts.chart(memUsage.value, state.memUsageChartOptions as any);
        console.log('Chart initialized:', state.chart);
        state.memUsageTimer = setInterval(async () => {
            const res = await api.get_mem_info({});
            if (!res) {
                return;
            }
            const chart = state.memUsageChart;
            // @ts-ignore
            chart.update({
                series: [{
                    data: [Math.round(res.data.usage_percent * 10) / 10]
                }]
            });
            console.log(res.data);
        }, 1000)
    } else {
        console.error('Chart container not found');
    }

    if (chartContainer.value) {
        state.chart = window.Highcharts.chart(chartContainer.value, state.chartOptions);
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