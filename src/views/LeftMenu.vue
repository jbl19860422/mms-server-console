<template>
    <a-menu v-model:openKeys="leftMenu.openKeys" v-model:selectedKeys="leftMenu.selectedKeys" mode="inline" theme="dark"
        :inline-collapsed="collapsed" :default-active="defaultActive">
        <a-menu-item key="dashboard">
            <template #icon>
                <DashboardOutlined />
            </template>
            <router-link to="/dashboard">概览</router-link>
        </a-menu-item>
        <a-sub-menu key="live">
            <template #icon>
                <PlayCircleOutlined />
            </template>
            <template #title>直播管理</template>
            <a-menu-item key="/live/stream" @click="leftMenu.openKeys = ['live']">
                <router-link to="/live/stream">流管理</router-link>
            </a-menu-item>
            <a-menu-item key="/live/record" @click="leftMenu.openKeys = ['live']">
                <router-link to="/live/record">录制管理</router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="state">
            <template #icon>
                <SearchOutlined />
            </template>
            <template #title>状态信息</template>
            <a-menu-item key="/state/count" @click="leftMenu.openKeys = ['state']">
                <router-link to="/state/count">对象计数</router-link>
            </a-menu-item>
        </a-sub-menu>

        <!-- <a-sub-menu key="domain">
            <template #icon>
                <SettingFilled />
            </template>
            <template #title>配置管理</template>
            <a-menu-item key="/domain/customer_info" @click="leftMenu.openKeys = ['domain']">
                <router-link to="/domain/customer_info">系统配置</router-link>
            </a-menu-item>
            <a-menu-item key="/domain/customer_info" @click="leftMenu.openKeys = ['domain']">
                <router-link to="/domain/customer_info">域名&app配置</router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="1">
            <template #icon>
                <SafetyCertificateFilled />
            </template>
            <span>证书管理</span>
        </a-menu-item> -->
    </a-menu>
</template>
<script lang="ts" setup>
import {
    PlayCircleOutlined,
    SearchOutlined,
    DashboardOutlined,
} from '@ant-design/icons-vue';

import { ref, watch, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const leftMenu = reactive({
    selectedKeys: [route.path],
    openKeys: [''],
});
let defaultActive = ref("");

const collapsed = ref<boolean>(false)

watch(leftMenu, (newVal, oldVal) => {
    console.log("change leftMenu:", newVal, ", oldVal:", oldVal);
});

onMounted(() => {
    // /domain/app_info 取 domain
    leftMenu.openKeys = [route.path.split("/")[1]];
});

// 监听当前路由
watch(
    () => router.currentRoute.value,
    (newValue: any) => {
        defaultActive = newValue;
        // console.log(newValue);
        leftMenu.openKeys = [route.path.split("/")[1]];
        const path_arr = route.path.split("/");
        if (path_arr.length < 2) {
            return;
        }
        const path = "/" + path_arr[1] + "/" + path_arr[2];
        leftMenu.selectedKeys = [path];
    },
    { immediate: true }
)

</script>