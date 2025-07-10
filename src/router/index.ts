// src/router/router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import IndexView from '../views/IndexView.vue';
import ContentView from '../views/ContentView.vue';
import StreamView from '../views/live/StreamView.vue';
import RecordView from '../views/live/RecordView.vue';
import CountView from '../views/state/CountView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';


const createRouterInstance = (locale) => {
    // 根据语言动态生成路由别名
    const aliases = {
        en: {
            dashboard: ['/dashboard'],
            live: ['/live'],
            stream: ['/live/stream'],
            record: ['/live/record']
        },
        zh: {
            dashboard: ['/概览'],
            live: ['/直播'],
            stream: ['/直播/在线流'],
            record: ['/直播/录制']
        }
    };

    const routes: Readonly<RouteRecordRaw[]> = [
        {
            path: '/',
            name: "basic",
            component: IndexView,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    alias: locale === 'zh' ? ['/概览'] : [],
                    component: DashboardView,
                },
                {
                    path: 'live',
                    name: 'live',
                    alias: locale === 'zh' ? ['/直播'] : [],
                    component: ContentView, // 需要一个中间层组件
                    children: [
                        {
                            path: 'stream',
                            name: 'stream',
                            alias: locale === 'zh' ? ['/在线流'] : [],
                            component: StreamView,
                        },
                        {
                            path: 'record',
                            name: 'record',
                            alias: locale === 'zh' ? ['/录制'] : [],
                            component: RecordView,
                        },
                    ]
                },
                {
                    path: 'state',
                    name: 'state',
                    alias: locale === 'zh' ? ['/状态'] : [],
                    component: ContentView,
                    children: [
                        {
                            path: 'count',
                            name: 'count',
                            alias: locale === 'zh' ? ['/对象计数'] : [],
                            component: CountView,
                        },
                    ]
                }
            ],
        },
    ];

    // 返回根据语言创建的路由实例
    return createRouter({
        history: createWebHashHistory(),
        routes: routes,
    });
}

export default createRouterInstance('en');
