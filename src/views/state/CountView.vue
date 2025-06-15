<template>
    <a-spin :spinning="state.loading">
        <div>
            <a-table class="ant-table-striped" style="margin-top:1vh"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)" :columns="state.columns"
                :data-source="state.data" row-key="name" :pagination="false" bordered />
        </div>
    </a-spin>
</template>
<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import api from "@/api/api";
import utils from "@/utils/utils";
import { message } from 'ant-design-vue';
import { DeleteFilled } from '@ant-design/icons-vue';

const state = reactive({
    loading: false,
    nozero: true,
    columns: [
        {
            title: '模块名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            filters: [
                { text: '非 0', value: 'nonZero' },
                { text: '为 0', value: 'zero' },
            ],
            onFilter: (value, record) => {
                if (value === 'nonZero') return record.count > 0
                if (value === 'zero') return record.count === 0
                return true
            },
            sorter: (a, b) => b.count - a.count,
        },
    ],
    data: [],
});

const queryObjCount = async () => {
    state.loading = true;
    const res = await api.obj_count({}) as any;
    if (!res || res.code != 0) {
        message.error("查询对象计数失败");
        state.loading = false;
        return;
    }

    state.data = res.data
        ? Object.entries(res.data)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count) // 按 count 倒序排序
        : []


    console.log(state.data);
    state.loading = false;
}

onMounted(async () => {
    await queryObjCount();
});
</script>