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
            <highcharts :options="state.chartOptions" />
        </div>
    </a-spin>
</template>
<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import api from "@/api/api";
import utils from "@/utils/utils";
import { message } from 'ant-design-vue';
import { DeleteFilled, UndoOutlined } from '@ant-design/icons-vue';

import { Chart as Highcharts } from 'highcharts-vue'
// HighchartsMore(Highcharts)

const state = reactive({
    loading: false,
    chartOptions: {
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },

        title: {
            text: 'Speedometer'
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
            max: 200,
            tickPixelInterval: 72,
            tickPosition: 'inside',
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
                to: 130,
                color: '#55BF3B', // green
                thickness: 20,
                // borderRadius: "50%"
            }, {
                from: 150,
                to: 200,
                color: '#DF5353', // red
                thickness: 20,
                // borderRadius: "50%"
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D', // yellow
                thickness: 20
            }]
        },

        series: [{
            type: "gauge" as const,
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: ' km/h'
            },
            dataLabels: {
                format: '{y} km/h',
                borderWidth: 0,
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
    } as any
});

const refresh = async () => {
}

onMounted(async () => {
});

</script>