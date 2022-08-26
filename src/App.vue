<template>
  <div>
    <Header></Header>
	<router-view></router-view>
	<Footer  v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: '',
  components: {
    Header,
	Footer,
  },

  mounted(){
    //只发送一次请求，性能优化
    //派发action，获取分类列表数据
    this.$store.dispatch("categoryList");
  }
};
</script>

<style>
</style>