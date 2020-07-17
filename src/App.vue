<template>
  <div id="app">
    <!-- :key="$route.fullPath+new Date().toString()" -->
    <router-view v-if="show==true&&$route.meta.keepAlive!=true" :key="$route.fullPath"/>
    <keep-alive>
      <router-view v-if="show==true&&$route.meta.keepAlive==true" :key="$route.fullPath"/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      show:true
    }
  },
  methods:{
    reload(){
      this.show=false;
      this.$nextTick(function(){
        this.show=true;
      });
    },
    // key(){
    //   var date=new Date();
    //   var s=date.toString();
    //   alert(s);
    //   return 1;
    // }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
#nprogress .bar{
  background: rgb(205,133,63);
}
</style>
