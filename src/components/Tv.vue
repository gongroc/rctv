<template>
  <div id="tv">
    <a-table :columns="columns" :data-source="tvs" :pagination="false" rowKey="name">
      <template v-slot:name="{record}">
        {{ record.name }}
        <div>
          {{ record.url }}
        </div>
      </template>
      <template v-slot:action="{record}">
        <a-button @click="onSetMovie(record.url)">播放</a-button>
      </template>
    </a-table>

  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
const ipcRenderer = window.require('electron').ipcRenderer;

export default defineComponent({
  data() {
    return {
      columns: [
        {dataIndex: 'name', title: '名称', slots: {customRender: 'name'}},
        {slots: {customRender: 'action'}}
      ],
      tvs: [
        {name: 'cctv1', url: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8'},
        {name: 'cctv2', url: 'http://ivi.bupt.edu.cn/hls/cctv2hd.m3u8'},
        {name: 'cctv3', url: 'http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8'},
        {name: 'cctv4', url: 'http://ivi.bupt.edu.cn/hls/cctv4hd.m3u8'},
        {name: 'cctv5', url: 'http://ivi.bupt.edu.cn/hls/cctv5hd.m3u8'},
        {name: 'cctv6', url: 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8'},
        {name: '香港卫视', url: 'http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8'},
      ]
    }
  },
  methods: {
    onSetMovie(url: string) {
      ipcRenderer.send('device-set-movie', url)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>