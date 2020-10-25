<template>
  <control/>
  <div class="body">
    <ul class="tab">
      <li @click="tab = 0" v-bind:class="{'active':tab === 0}">本地文件</li>
      <li @click="tab = 1" v-bind:class="{'active':tab === 1}">电视</li>
    </ul>
    <folder v-if="tab === 0"/>
    <tv v-if="tab === 1"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Control from './components/Control.vue'
import Folder from './components/Folder.vue'
import Tv from './components/Tv.vue'

export default defineComponent({
  components: {
    Control,
    Folder,
    Tv
  },
  data() {
    return {
      tab: 0
    }
  }
});
</script>

<style lang="scss">
#app {
  .tab {
    padding: 0;
    margin: 0;
    background: #ececec;

    li {
      display: inline-block;
      padding: 10px 20px;
      cursor: pointer;
    }

    .active {
      color: cadetblue;
    }
  }
}
</style>
