<template>
  <div id="folder">

    <div class="top-bar">
      <div class="left">
        <template v-if="running">
          服务已开启
        </template>
        <template v-else>
          <a-button @click="onRun">开启服务</a-button>
        </template>
      </div>

      <div class="right">
        <a-button @click="onOpenDir">打开文件夹</a-button>
      </div>

    </div>

    <div class="body">
      <a-table :columns="columns" :data-source="files" :pagination="false" rowKey="name">
        <template v-slot:action="row">
          <a-button @click="onSetMovie(row.text.name)">播放</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

const ipcRenderer = window.require('electron').ipcRenderer;

export default defineComponent({
  data() {
    return {
      files: [],
      running: false,
      columns: [
        {dataIndex: 'name', title: '文件名'},
        {slots: {customRender: 'action'}}
      ],
      baseUrl: ''
    }
  },
  methods: {
    fetchAllFile() {
      ipcRenderer.send('web-fetch-all-files')
      ipcRenderer.once('web-fetch-all-files-result', (event: any, files: any) => {
        this.files = files
      })
    },
    onRun() {
      ipcRenderer.send('web-run')
    },
    onSetMovie(name: string) {
      if (!this.baseUrl) {
        return
      }

      let url = this.baseUrl + name
      url = encodeURI(url)
      ipcRenderer.send('device-set-movie', url)
    },
    bindEvent() {
      ipcRenderer.on('web-running-change', (event: any, status: any, url: any) => {
        this.running = status
        if (status) {
          console.log(url)
          this.baseUrl = url
        }
      })
    },
    fetchStatus() {
      ipcRenderer.send('web-fetch-status')
    },
    onOpenDir() {
      ipcRenderer.send('web-open-dir')
    }
  },
  created() {
    this.bindEvent()
    this.fetchAllFile()
    this.onRun()
    this.fetchStatus()
  }

})
</script>

<style lang="scss" scoped>
#folder {
  flex: 1;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;

  .top-bar {
    border-bottom: 1px solid #ececec;
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;

    .left {

    }

    .right {
      .ant-btn {
        margin-left: 10px;
      }

    }
  }

  .body {
  }

}
</style>