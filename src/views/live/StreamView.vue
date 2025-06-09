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
                        <a-button type="primary" style="margin-left:1vw" @click="handleQueryStreams">查询</a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-table class="ant-table-striped" style="margin-top:1vh"
                :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
                :dataSource="state.streams" :columns="state.columns">
                <template #operation="{ record }">
                    <div class="editable-row-operations">
                        <a-row type="flex" style="width:100%;">
                            <a-col flex="auto" style="display: flex;justify-content: center;gap:1vw">
                                <a-popconfirm title="禁推" ok-text="是" cancel-text="否"
                                    @confirm="handleCutoffStream(record)">
                                    <a-button type="primary" danger>禁推</a-button>
                                </a-popconfirm>
                                <a-button type="primary" @click="playStream(record)">播放</a-button>
                            </a-col>
                        </a-row>
                    </div>
                </template>

                <template #vcodec="{ record }">
                    <div>
                        <div v-if="record.vcodec">
                            <span>{{ record.vcodec.codec_name }} ({{ record.vcodec.width }} x {{ record.vcodec.height
                            }})@{{ record.vcodec.fps }}</span>
                        </div>
                    </div>
                </template>

                <template #acodec="{ record }">
                    <div>
                        <div v-if="record.acodec">
                            <span>{{ record.acodec.codec_name }}</span>
                        </div>
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
    streams: [],
    columns: [
        {
            title: '域名',
            dataIndex: 'domain',
            key: 'domain',
            align: 'center',
            fixed: 'left',
        },
        {
            title: 'app',
            dataIndex: 'app',
            key: 'app',
            align: 'center',
        },
        {
            title: '客户端ip',
            dataIndex: 'client_ip',
            key: 'client_ip',
            align: 'center',
        },
        {
            title: '流名称',
            dataIndex: 'stream',
            key: 'stream',
            align: 'center',
        },
        {
            title: '流类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: '音频',
            dataIndex: 'acodec',
            key: 'acodec',
            align: 'center',
            slots: { customRender: 'acodec' },
        },
        {
            title: '视频',
            dataIndex: 'vcodec',
            key: 'vcodec',
            align: 'center',
            slots: { customRender: 'vcodec' },
        },
        {
            title: '码率',
            dataIndex: 'bitrate',
            key: 'bitrate',
            align: 'center',
        },
        {
            title: '播放人数',
            dataIndex: 'sinks',
            key: 'sinks',
            align: 'center',
        },
        {
            title: '创建时间',
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

const handleQueryStreams = async () => {
    if (!state.selDomain) {
        message.error("请选择一个域名");
        return;
    }

    if (!state.selApp) {
        message.error("请选择一个app");
        return;
    }

    state.loading = true;
    const res = await api.app_streams({ domain: state.selDomain, app: state.selApp }) as any;
    if (!res || res.code != 0) {
        message.error("查询流列表失败");
        state.loading = false;
        return;
    }

    state.streams = res.data ? res.data : [];
    state.loading = false;
}

const handleCutoffStream = async (stream) => {
    if (!stream) {
        message.error("请选择一个流");
        return;
    }

    const res = await api.cut_off_stream(stream) as any;
    if (!res || res.code != 0) {
        message.error("禁推失败");
        return;
    }
    message.success("禁推成功");
    await handleQueryStreams();
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