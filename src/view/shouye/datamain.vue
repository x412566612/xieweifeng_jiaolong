<template>
  <el-main id="et" :style="{height:wheight+'px','background-color':'#ffebcd'}">

      <router-view style="padding: 0px" ></router-view>

  </el-main>

</template>

<script>
    export default {
        name: "datamain",
      data(){
          return{
            wheight:window.innerHeight-60
          }

      },
      created(){
          this.$router.push({path:"/system"})
      }
    }
</script>

<style scoped>

</style>
