<template>
  <a-locale-provider :locale="locale">
    <a-config-provider :getPopupContainer="triggerNode => triggerNode.parentNode">
      <div id="app">
        <router-view />
      </div>
    </a-config-provider>
  </a-locale-provider>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
body,
html {
  overflow: hidden;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  min-width: 1080px;
  margin: 0;
  padding: 0;
}
</style>
