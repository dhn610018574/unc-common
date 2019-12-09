<template>
  <iframe
    :id="id"
    :src="url"
    frameborder="0"
    scrolling="auto"
    class="iframe"
  ></iframe>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'IframePageContent',
  data() {
    return {
      url: '',
      id: ''
    }
  },
  created() {
    this.goUrl()
  },
  updated() {
    this.goUrl()
  },
  watch: {
    $route(to, from) {
      this.goUrl()
    }
  },
  methods: {
    goUrl() {
      let url = this.$route.meta.url + `&token=${this.$ls.get(ACCESS_TOKEN)}`
      let id = this.$route.path
      this.id = id
      if (url !== null && url !== undefined) {
        this.url = url
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .iframe {
    height: 100%;
    width: 100%;
    display: block;
  }
</style>