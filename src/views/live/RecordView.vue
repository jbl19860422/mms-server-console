<template>
    <a-spin :spinning="state.loading">
        <div>
            <a-row>
                <a-col>
                    <a-space>
                        <label>域名：</label>
                        <a-select :options="state.publishDomainsOpt" style="min-width: 10vw;"
                            v-model:value="state.selDomain" allow-clear show-search></a-select>
                        <label style="margin-left:1vw">app：</label>
                        <a-select :options="state.appsOpt" v-model:value="state.selApp" style="min-width: 10vw;"
                            allow-clear show-search></a-select>
                        <a-button type="primary" style="margin-left:1vw" @click="handleQueryRecorders">查询</a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-table class="ant-table-striped" style="margin-top:1vh"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                :dataSource="state.recorders" :columns="state.columns">
                <template #operation="{ record }">
                    <div class="editable-row-operations">
                        <a-row type="flex" style="width:100%;">
                            <a-col flex="auto" style="display: flex;justify-content: center;gap:1vw">
                                <a-popconfirm title="结束录制" ok-text="是" cancel-text="否"
                                    @confirm="handleStopRecorder(record)">
                                    <a-button type="primary" danger>结束录制</a-button>
                                </a-popconfirm>
                                <a-button type="primary" @click="playStream(record)">播放</a-button>
                            </a-col>
                        </a-row>
                    </div>
                </template>
            </a-table>
        </div>

        <!-- 播放器 -->
        <PlayerDlg ref="PlayerDlgRef" v-show="showPlayerDlg" @hide="showPlayerDlg = false" />
    </a-spin>
</template>
<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import api from "@/api/api";
import utils from "@/utils/utils";
import { message } from 'ant-design-vue';
import { DeleteFilled } from '@ant-design/icons-vue';
import PlayerDlg from "@/components/PlayerDlg.vue"

const showPlayerDlg = ref(false);
const PlayerDlgRef = ref();

const state = reactive({
    loading: false,
    selDomain: '',
    domains: {},
    publishDomainsOpt: [],
    selApp: '',
    appsOpt: [],
    recorders: [],
    columns: [
        {
            title: '域名',
            dataIndex: 'domain',
            key: 'domain',
            align: 'center',
            width: 100,
            fixed: 'left',
        },
        {
            title: 'app',
            dataIndex: 'app',
            key: 'app',
            align: 'center',
        },
        {
            title: '流名称',
            dataIndex: 'stream',
            key: 'stream',
            align: 'center',
        },
        {
            title: '录制类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: '录制时长(s)',
            dataIndex: 'duration',
            key: 'duration',
            align: 'center',
        },
        {
            title: '字节数',
            dataIndex: 'write_bytes',
            key: 'write_bytes',
            align: 'center',
            customRender: (state: any) => {
                return (state.value / (1024 * 1024)).toFixed(2) + 'MB';
            }
        },
        {
            title: '开始时间',
            dataIndex: 'create_at',
            key: 'create_at',
            align: 'center',
            customRender: (state: any) => {
                return utils.timeConverter(state.value);
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            slots: { customRender: 'operation' },
        },
    ],
});

const playStream = (record) => {
    PlayerDlgRef.value.show(record);
}

watch(() => state.selDomain, () => {
    const apps = state.domains[state.selDomain].apps;
    if (!apps) {
        state.appsOpt = [];
        return;
    }

    state.appsOpt = [];
    for (const key in apps) {
        state.appsOpt.push({
            label: key,
            value: key,
        });
    }
});

const handleQueryRecorders = async () => {
    if (!state.selDomain) {
        message.error("请选择一个域名");
        return;
    }

    if (!state.selApp) {
        message.error("请选择一个app");
        return;
    }

    state.loading = true;
    const res = await api.app_recorders({ domain: state.selDomain, app: state.selApp }) as any;
    if (!res || res.code != 0) {
        message.error("查询流列表失败");
        state.loading = false;
        return;
    }

    state.recorders = res.data ? res.data : [];
    state.loading = false;
}

const handleStopRecorder = async (recorder) => {
    if (!recorder) {
        message.error("请选择一个流");
        return;
    }

    const res = await api.stop_recorder(recorder) as any;
    if (!res || res.code != 0) {
        message.error("结束失败");
        return;
    }
    message.success("结束成功");
    await handleQueryRecorders();
}

const queryDomainApps = async () => {
    const res = await api.domain_apps({});
    // @ts-ignore
    if (!res || res.code != 0 || !res.data) {
        message.error("获取域名， app列表失败");
        return;
    }

    const domains = res.data;
    for (const key in domains) {
        const domainCfg = domains[key];
        if (domainCfg.type == "publish") {
            state.publishDomainsOpt.push({
                label: key,
                value: key
            });
        }

        state.domains[key] = domains[key];
    }
}

onMounted(async () => {
    await queryDomainApps();
});
</script>