<template>

  <control/>
  <folder/>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Control from './components/Control.vue'
import Folder from './components/Folder.vue'

export default defineComponent({
  components: {
    Control,
    Folder,
  },

});
</script>

<style lang="scss">
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
