<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <div class="ant-pro-sider-menu-logo" id="logo"><a href="/"><img
              src="/mms.svg"
              alt="logo">
            <h1 v-show="!collapsed">MMS Admin</h1>
          </a></div>
      </div>
      <LeftMenu ref="LeftMenuRef"></LeftMenu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <div style="flex:1"></div>
        <a-popover placement="bottomLeft" trigger="click">
          <template #content>
            <a @click="logout()">退出登录</a>
          </template>
          <!-- <a style="color:#1890ff;padding:0 10px;">{{ store.state.user.name }}</a> -->
        </a-popover>
      </a-layout-header>
      <div class="breadcrumb">
        <a-breadcrumb>
          <template v-for="(item, index) in $route.matched">
            <a-breadcrumb-item v-if="index != 0" :key="item.name"> {{ item.name }} </a-breadcrumb-item>
          </template>
        </a-breadcrumb>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { ref, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import LeftMenu from './LeftMenu.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
const leftMenu = reactive({
  selectedKeys: [route.path],
  openKeys: ['server'],
});

watch(leftMenu, (newVal, oldVal) => {
  console.log("change leftMenu:", newVal);
});

const logout = () => {
  store.commit("user/clearToken");
  router.push({name: 'login'});
};

const collapsed = ref<boolean>(false)
const components = {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
};
const routes = [
  {
    path: '/',
    breadcrumbName: '直播运营系统',
  },
  {
    path: '#',
    breadcrumbName: '路由及部署',
  },
  {
    path: 'room_info',
    breadcrumbName: '机房信息',
  }
];
</script>
<style>
.ant-layout-header {
  padding-inline: 10px;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 20px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: hsla(0, 0%, 100%, .65);
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

.breadcrumb {
  padding: 10px 10px;
  text-align: left;
  background-color: #fff;
}

.content {
  margin: 20px 20px;
  background-color: #fff;
  padding: 20px 20px;
  border-radius: 5px;
  height:100%;
  
}
</style>
