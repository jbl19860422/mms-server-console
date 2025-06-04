<template>
    <a-modal v-model:visible="state.visible" title="player" style="width:50vw" @cancel="hide">
        <div style="display:flex;justify-content: center">
            <video ref="VideoElement" controls style="width:100%;" autoplay muted></video>
        </div>
        <template #footer>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import config from '@/api/config'
import { cloneDeep } from 'lodash-es';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { reactive, ref, defineEmits, onMounted, nextTick, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';

const VideoElement = ref(null)
// 状态数据
const state = reactive({
    visible: false,
    playUrl: '',
});

onMounted(() => {
    
});

let flvPlayer = null;
onUnmounted(() => {
    if (flvPlayer) {
        flvPlayer.destroy()
        flvPlayer = null
    }
})

const show = async (playUrl) => {
    state.playUrl = playUrl;
    state.visible = true;
    await nextTick();
    // @ts-ignore
    if (window.flvjs.isSupported()) {
        // @ts-ignore
        console.log(VideoElement.value);
        // @ts-ignore
        flvPlayer = window.flvjs.createPlayer({
            type: 'flv',
            url: 'http://test.play.com/app/test.flv'
        });
        flvPlayer.attachMediaElement(VideoElement.value);
        flvPlayer.load();
        flvPlayer.play();
    }
}

const hide = () => {
    if (flvPlayer) {
        flvPlayer.destroy()
        flvPlayer = null
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