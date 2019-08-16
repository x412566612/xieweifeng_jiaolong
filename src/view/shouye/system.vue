<template>
    <div>

      <el-alert
        :closable="closable"
        title="首页"
        type="success"
        show-icon>
      </el-alert>

      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">新闻公告</span>
          </div>
          <div  class="text item">
             内容
          </div>
        </el-card>
      </div>
      <!-- 6 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">最近信息</span>

          </div>
          <div  class="text item">
            内容
          </div>
        </el-card>
      </div>
      <br>
      <!-- 7 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">汇总统计</span>

          </div>
          <div class="text item">
            <!--为echarts准备一个具备大小的容器dom-->
            <div id="main" style="width: 600px;height: 400px;"></div>
          </div>
        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">类型汇总统计</span>

          </div>
          <div class="text item">
             内容
          </div>

        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:100%;">
        <el-card class="box-card" >

          <div slot="header" class="clearfix">
            <span style="font-weight:bold">操作帮助</span>
            <div style="text-align: center"><span>使用蛟龙快速组织信息</span></div>
          </div>
          <div class="text item">
                <div style="margin-left:50px;float:left;height:100px">
                  <el-tooltip content="点击创库" placement="top" effect="light">
                      <span >
                         <span><img src="../../assets/tiku.png"></span>
                         <br>
                         <span >创建信息</span>
                      </span>
                  </el-tooltip>
                </div>
                <div style="margin-left:50px;float:left">
                  <el-tooltip content="点击导入信息" placement="top" effect="light">
                      <span >
                         <span><img src="../../assets/daoru.jpg" style="width:48px"></span>
                         <br>
                         <span >导入信息</span>
                      </span>
                  </el-tooltip>
                </div>
                <div style="margin-left:50px;float:left">
                  <el-tooltip content="点击创建信息" placement="top" effect="light">
                          <span >
                             <span><img src="../../assets/create.png" style="width:48px"></span>
                             <br>
                             <span >创建信息</span>
                          </span>
                  </el-tooltip>
                </div>
                <div style="margin-left:50px;float:left">

                  <el-badge :value="0" class="item">
                    <el-tooltip content="点击查看结果" placement="top" effect="light">
                          <span >
                             <span><img src="../../assets/chakan.jpg" style="width:48px"></span>
                             <br>
                             <span >查看结果</span>
                          </span>
                    </el-tooltip>
                  </el-badge>


                </div>
            </div>
        </el-card>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "system",
        data(){
          return{
            closable:false,
            styleel:{
              left:'200%'
            },
            loginValues:[],
            loginKeys:[],
            loginCount:"",
            charts: '',
            opinionData: ["3", "2", "4", "4", "5"]
          }
        },
      mounted() {
        this.loginCount = this.$store.state.userinfo.loginCount;
        this.loginValues = this.$store.state.userinfo.loginValues;
        this.loginKeys = this.$store.state.userinfo.loginKeys;
        this.$nextTick(function() {
          this.drawLine('main')
        })
      },
      methods:{
        drawLine(id) {
          this.charts = echarts.init(document.getElementById(id))
          this.charts.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['当月登陆次数']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.loginKeys

            },
            yAxis: {
              type: 'value'
            },

            series: [{
              name: '当天登陆次数',
              type: 'line',
              stack: '总量',
              data: this.loginValues
            }]
          })
        }
      },

    }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width:99.5%;
  }
</style>
