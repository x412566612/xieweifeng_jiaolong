<template>
  <div style="width:100%;height: 100%;">
    <el-container style="height: 100%" direction="vertical">
      <el-header style="font-size: 12px;text-align: left">
        <span style="font-size:25px;margin-right:60%;">
            信息平台
            <el-tooltip ref="tip" class="item" effect="dark"  placement="top-start" v-bind:content="mycontent">
              <i class="el-icon-menu" @click="openParentClose()"></i>
            </el-tooltip>

            &lt;!&ndash; 提示音 &ndash;&gt;
            <audio id="yinpin" src="../../static/tishi/tishiyin.mp3"> </audio>
            <audio id="en" src="../../static/tishi/en.mp3"> </audio>
            <audio id="qingsong" src="../../static/tishi/qingsong.mp3"> </audio>
            <audio id="aiya" src="../../static/tishi/aiya.mp3"> </audio>


        </span>


          <div style="float:right" >
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c">首页</el-dropdown-item>
                <el-dropdown-item command="a">查看</el-dropdown-item>
                <el-dropdown-item command="b">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-image :src="imgUrl" style="width: 30px; height: 30px" ></el-image>
           <!-- <el-avatar :src="'http://localhost:11000/'+userInfo.portrait"></el-avatar>-->
            <span ref="userinfo_username" >{{username}}</span>
            <input ref="userinfo_userid" type="hidden" v-model="userid">
            &nbsp;&nbsp;&nbsp;
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  评论
                  <el-badge class="mark" :value="12" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
       </el-header>

      <el-container noresize:false>
       <!-- &lt;!&ndash; 左侧的菜单 &ndash;&gt;-->
        <mymenu  ref="iiii" v-on:ee="updatePro"></mymenu>
       <!-- &lt;!&ndash; 右侧的主显示区域 &ndash;&gt;-->
        <mymain style="padding:0px"></mymain>
      </el-container>
    </el-container>

    <el-dialog
          title="当前用户信息"
          :visible.sync="dialog1Visible"
          width="40%"
          >
            <el-image :src="'http://127.0.0.1:11000/'+userInfo.portrait" style="width: 100px; height: 100px" ></el-image>
            <el-form  :inline="true" label-width="100px" class="demo-form-inline">
              <el-form-item label="用户名:">{{userInfo.userName}}</el-form-item>
              <el-form-item label="登录名:">{{userInfo.loginName}}</el-form-item>
              <el-form-item label="性别:">{{userInfo.sex}}</el-form-item>
              <br>
              <el-form-item label="电话:">{{userInfo.tel}}</el-form-item>
            </el-form>

          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import mymenu from './datamenu.vue'
  import mymain from './datamain.vue'
  import {setCookie,getCookie,delCookie} from "../../util/util";
  const userinfo={};

  export default {

    data(){
      return{
        connectok:false,
        mycontent:"点击打开菜单",
        dialogVisible: false,
        dialog1Visible: false,
        userid:"",
        username:"",
        currInfo:{
          userName:'',
          loginName:'',
          sex:'',
          tel:'',
          buMen:''
        },
        imgUrl:"http://127.0.0.1:11000/timg (7).jpg",
        userInfo:{}
      }
    },
    components:{mymenu,mymain},
    name: "shouye",
    methods:{
      openParentClose(){
        //调用子组件menu中的openClose()
        this.$refs.iiii.openClose();
      },
      updatePro(uu){
        if(uu){
          this.$data.content="点击打开菜单";
        }else{
          this.$data.content="点击关闭菜单";
        }
      },
      handleCommand(command){
          if(command=="b"){//退出操作
            this.$confirm('确认登出？').then(_ => {
              let map ={};
              //获取全局变量中的id
              map.userId = this.$store.state.userinfo.id;
              //调用方法清空当前ID的后台缓存
               this.$axios.post(this.domain.ssoserverpath+"exitUser",map).then((response)=>{
                   let sts=response.data.success;
                 if(response.data.code ==200){
                   delCookie("token");
                   delCookie("userinfo");
                   //回到登录页面
                      this.$router.push({path:'/'});
                     location.reload();
                   }else if(response.data.code ==500){
                     alert(response.data.success);
                   }
               })
            }).catch(_ => {

            });
          }else if(command=="a"){
             //获取一下隐藏域中的用户ID
             let userid= this.userid;
             //到后台后获取用户的信息
             this.$axios.post(this.domain.serverpath+"findUserInfoById",{id:userid}).then((response)=>{
               if(response.data.code ==200){
               //获取用户信息
                 let userinfo=response.data.result;
                 //打开用户信息的弹出层
                 this.$data.dialog1Visible=true;
                 //填充用户数据
                 this.$data.currInfo=response.data.result
               }else if(response.data.code ==500){
                alert(response.data.success);
              }

             })

          }else if(command=="c"){
             this.$router.push({path:"/system"})
          }
      }
    },
    mounted(){
      this.userInfo = this.$store.state.userinfo;
      //登录之后提示
       this.playAudio("yinpin","yinpin");
       //从本地缓存中获取参数,然后赋值给全局变量
        this.$store.state.userinfo = JSON.parse(window.localStorage.getItem("userInfo"));
        this.$store.state.token = window.localStorage.getItem("token");
        //从全局变量获取参数
        this.userid = this.$store.state.userinfo.id;
        this.username=this.$store.state.userinfo.userName;
        this.portrait ="";
        this.userInfo ={};
        this.userInfo = this.$store.state.userinfo;
        console.log(this.userInfo.authmap)
        //首页显示头像,但不知道为什么显示不出来
        let uri = 'http://127.0.0.1:11000/'+this.userInfo.portrait;
        this.imgUrl = uri;
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height:60px;

  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
