<template>
    <a-modal v-model:visible="state.visible" title="播放器" style="width:50vw" @cancel="hide">
        <div style="display: flex;align-items: center;gap:10px;">
            <div>协议:</div>
            <a-select :options="state.protocolOpts" v-model:value="state.protocol"></a-select>
            <div>播放域名:</div>
            <a-select :options="state.playDomainOpts" v-model:value="state.playDomain"
                style="min-width: 200px;"></a-select>
            <div>播放app:</div>
            <a-select :options="state.playAppOpts" v-model:value="state.playApp" style="min-width: 90px;"></a-select>
            <div>后缀:</div>
            <a-select :options="state.suffixOpts" v-model:value="state.suffix" style="min-width: 90px;"></a-select>
        </div>
        <div style="display:flex;margin-top:16px;margin-bottom: 16px;gap:10px;align-items: center;">
            <label style="width:100px">播放地址：</label>
            <a-input :disabled="true" v-model:value="playUrl"></a-input>
            <a-button type="primary" style="margin-left:10px;" @click="play">播放</a-button>
        </div>
        <div style="display:flex;justify-content: center">
            <video ref="VideoElement" controls style="width:100%;" autoplay muted id="video"></video>
        </div>
        <template #footer>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import config from '@/api/config'
import { cloneDeep } from 'lodash-es';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { reactive, ref, defineEmits, onMounted, nextTick, onUnmounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api/api';
import Hls from 'hls.js';
import * as dashjs from 'dashjs'

const VideoElement = ref(null)
// 状态数据
const state = reactive({
    visible: false,
    stream: null,

    protocol: 'http',
    protocolOpts: [
        { label: "http", value: "http" },
        { label: "https", value: "https" },
    ],
    playDomain: '',
    playDomainOpts: [],
    playApp: '',
    playAppOpts: [],
    suffix: '.flv',
    suffixOpts: [
        { label: ".flv", value: ".flv" },
        { label: ".m3u8", value: ".m3u8" },
        { label: ".ts", value: ".ts" },
        { label: ".mpd", value: ".mpd" },
    ],

    player: null,
});

const playUrl = computed(() => {
    return state.protocol + "://" + state.playDomain + "/" + state.playApp + "/" + state.stream.stream + state.suffix;
});

const queryPlayDomainAndApp = async () => {
    const res = await api.domain_apps({});
    // @ts-ignore
    if (!res || res.code != 0 || !res.data) {
        message.error("获取域名， app列表失败");
        return;
    }

    const domains = res.data;
    for (const key in domains) {
        const domainCfg = domains[key];
        if (domainCfg.type == "play" && domainCfg.publish_domain == state.stream.domain) {
            if (state.playDomain == '') {
                state.playDomain = domainCfg.name;
            }

            state.playDomainOpts.push({
                label: domainCfg.name,
                value: domainCfg.name
            });

            const apps = domainCfg.apps;
            for (const app in apps) {
                if (state.playApp == '') {
                    state.playApp = app;
                }

                state.playAppOpts.push({
                    label: app,
                    value: app,
                });
            }
        }
    }
}

const play = () => {
    if (state.player) {
        if (typeof state.player.destroy === 'function') {
            state.player.destroy();
        }

        if (typeof state.player.detachMediaElement === 'function') {
            state.player.detachMediaElement();
        }

        if (typeof state.player.reset == 'function') {
            state.player.reset();
        }

        state.player = null;
    }
    // @ts-ignore
    if (state.suffix == ".flv") {
        // @ts-ignore
        if (window.flvjs.isSupported()) {
            // @ts-ignore
            console.log(VideoElement.value);
            // @ts-ignore
            state.player = window.flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                url: playUrl.value,
            });
            state.player.attachMediaElement(VideoElement.value);
            state.player.load();
            state.player.play();
        }
    } else if (state.suffix == ".ts") {
        // @ts-ignore
        state.player = window.mpegts.createPlayer({
            type: 'mpegts',  // could also be mpegts, m2ts, flv
            isLive: true,
            url: playUrl.value,
        });
        state.player.attachMediaElement(VideoElement.value as HTMLVideoElement);
        state.player.load();
        state.player.play();
    } else if (state.suffix == ".m3u8") {
        if (Hls.isSupported()) {
            state.player = new Hls();
            state.player.loadSource(playUrl.value);
            state.player.attachMedia(VideoElement.value);
            state.player.on(Hls.Events.MANIFEST_PARSED, () => {
                VideoElement.value.play();
            });
            // @ts-ignore
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // @ts-ignore
            VideoElement.value.src = playUrl.value;
            // @ts-ignore
            VideoElement.value.addEventListener('loadedmetadata', () => {
                // @ts-ignore
                VideoElement.value.play();
            });
        } else {
            console.error("当前浏览器不支持 HLS 播放");
        }
    } else if (state.suffix == ".mpd") {
        state.player = dashjs.MediaPlayer().create();
        state.player.initialize(VideoElement.value, playUrl.value, true)
    }

}

onMounted(() => {

});

onUnmounted(() => {
    if (state.player) {
        if (typeof state.player.destroy === 'function') {
            state.player.destroy();
        }

        if (typeof state.player.detachMediaElement === 'function') {
            state.player.detachMediaElement();
        }

        state.player = null;
    }
})

const show = async (stream) => {
    state.visible = true;
    state.stream = stream;

    await queryPlayDomainAndApp();
    await nextTick();
}

const hide = () => {
    if (state.player) {
        state.player.destroy()
        state.player = null
    }

    emits('hide');
    state.visible = false
}

// 暴露方法
defineExpose({
    show,
    hide
});
// 父对象方法
const emits = defineEmits(['hide'])
</script>
<style>
.player-container {
    width: 960px;
    height: 540px;
}

.player__button {
    border: 1px solid black;
    width: 80px;
    border-radius: 5px;
    text-align: center;
    margin: 10px 0;
    cursor: pointer;
}

.timeline__container {
    margin: 5px 0;
}

.timeline__container span:nth-child(2) {
    margin-left: 10px;
}
</style>