<template>
  <div id="control">

    <div class="head">
      <div class="status">
        <template v-if="loadingDevice">

        </template>
        <template v-else>
          {{ statusLabel }}
        </template>
      </div>

      <div class="devices">
        <a-select v-model:value="selectedDeviceIndex" placeholder="请选择设备" :loading="loadingDevice">
          <a-select-option :value="index" v-for="(item,index) in deviceList" :key="index">
            {{ item.name }} {{ item.ip }}
          </a-select-option>
        </a-select>

      </div>

    </div>

    <div class="body">
      <template v-if="loadingDevice">
        <div class="device">
          <div class="title">
            扫描中
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="connected">
          <div class="device">
            <div class="title">
              {{ connected.name }}
            </div>
            <div class="movie">
              {{ decodeURI(movie) }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="device">
            <div class="title">
              {{ selectedDeviceIndex === -1 ? '请选择设备' : deviceList[selectedDeviceIndex].name }}
            </div>
          </div>
        </template>


        <div class="remote-control">

          <template v-if="connected">
            <a-button @click="onVolumeMinus">音量-</a-button>
            <a-button @click="onVolumePlus">音量+</a-button>
            <a-button @click="onPlay" :disabled="playing">播放</a-button>
            <a-button @click="onPause" :disabled="!playing">暂停</a-button>
            <a-input v-model:value="seek" type="number" style="width: 100px; margin-right: 10px"/>
            <a-button @click="onSeek" :disabled="!playing">设置进度</a-button>
            <a-button @click="onDisconnect">断开连接</a-button>
          </template>
          <template v-else>
            <a-button @click="onConnect">连接</a-button>
          </template>

        </div>
      </template>


    </div>


  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

const ipcRenderer = window.require('electron').ipcRenderer;

export default defineComponent({
  data() {
    return {
      status: '',
      deviceList: [],
      selectedDeviceIndex: -1,
      loadingDevice: false,
      volume: 0,
      playing: false,
      connected: null,
      movie: '',
      seek: 43
    }
  },
  computed: {
    statusLabel() {
      switch (this.status) {
        case 'connecting':
          return '连接中'
        case 'connected':
          return '已连接'
        case 'disconnected':
          return '断开连接'
      }
      return ""
    },

  },
  watch: {},
  methods: {
    fetchAllDevice() {
      this.loadingDevice = true
      ipcRenderer.send('device-fetch-all-devices')
      ipcRenderer.on('device-fetch-all-devices-result', (event: any, result: any) => {
        this.deviceList = result
        if (result.length > 0) {
          this.selectedDeviceIndex = 0
        }
        this.loadingDevice = false
      })
    },
    onConnect() {
      if (this.selectedDeviceIndex < 0) {
        return
      }
      ipcRenderer.send('device-connect', this.selectedDeviceIndex)
    },
    onDisconnect() {
      ipcRenderer.send('device-disconnect')
    },
    onVolumeMinus() {
      let vol = this.volume - 5;
      vol = vol === 0 ? 0 : vol
      ipcRenderer.send('device-set-volume', vol)
    },
    onVolumePlus() {
      let vol = this.volume + 5;
      vol = vol === 100 ? 100 : vol
      ipcRenderer.send('device-set-volume', vol)
    },
    onPlay() {
      ipcRenderer.send('device-play')
    },
    onPause() {
      ipcRenderer.send('device-pause')
    },
    onSeek() {
      ipcRenderer.send('device-set-seek',this.seek)
    },
    bindEvent() {
      ipcRenderer.on('device-connect-change', (event: any, status: any, message: any) => {
        switch (status) {
          case 'connected':
            this.connected = message
            break
          case 'connect-error':
            this.connected = null
            break
          case 'disconnect':
            this.connected = null
            break
        }
        this.status = status
      })

      ipcRenderer.on('device-play-change', (event: any, status: any) => {
        this.playing = status
      })

      ipcRenderer.on('device-volume-change', (event: any, vol: number) => {
        this.volume = vol
      })

      ipcRenderer.on('device-movie-change', (event: any, vol: string) => {
        this.movie = vol
      })
    },
    fetchStatus() {
      ipcRenderer.send('device-fetch-status')
    }
  },
  mounted() {
    this.fetchAllDevice()
    this.bindEvent()
    this.fetchStatus()
  }
})
</script>

<style lang="scss" scoped>
#control {
  height: 250px;
  flex: none;
  padding: 20px;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .ant-select {
      min-width: 250px;
    }

    .status {
      font-size: 12px;
      color: darkred;
    }
  }


  .body {
    margin-top: 20px;

    .device {
      text-align: center;
      margin-bottom: 20px;

      .title {
        font-size: 30px;
        font-weight: bold;
      }

      .movie {
        color: #999999;
      }

    }

    .remote-control {
      text-align: center;

      .ant-btn {
        margin-right: 10px;
      }

      .ant-btn:last-child {
        margin-right: 0;
      }
    }

  }
}
</style>