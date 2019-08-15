<template>
  <div class="login-wrap" :style="divimg">
    <div>
      <p class="p-title">测试前端登录页面</p>
    </div>
    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
            <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <div class="form-inline-input">
            <div class="code-box" id="code-box">
              <input ref="coderef" type="text" v-model="ruleForm.code" class="code-input" />
              <p></p>
              <span style="color:#909399">
                     拖动验证
                  </span>
            </div>
          </div>
        </el-form-item>

        <el-form-item  prop="checked">
          <template>
            <!-- `checked` 为 true 或 false -->
            <el-checkbox v-model="ruleForm.checked">七天免登陆</el-checkbox>
          </template>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!-- 登录进度 -->
        <el-progress ref="jindu" :style="jindustyle"  :text-inside="true"
                     :stroke-width="18"
                     :percentage="percent"
                     status="success"></el-progress>

      </el-form>
    </div>

  </div>
</template>

<script>
  import {setCookie,getCookie,delCookie} from "../../util/util";

  export default {
        name: "login",
      data(){
          return{
            divimg:{
              backgroundImage:"url(" + require('../../assets/yun.jpg') + ")",//设置背景图片的路径
              backgroundRepeat:"no-repeat",//背景图片是否平铺
              width:"100%",//宽度
              height:"100%",
              overflow:"hidden",//溢出隐藏
              backgroundSize:"cover"//自动适应容器大小
            },
            ruleForm:{
              username:'zhangsan',//表单对象初始值
              password:'123456',//表单对象初始值
              checked:true
            },
            rules: {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
              ]
            },
            jindustyle:{
              display:'none'
            },
            percent:0 //进度条起始进度
          }
      },
      mounted(){

          let _this = this;
          //获取验证码
          this.$axios.post(this.domain.ssoserverpath+"getCode").then(response=>{
            if(response.data.code ==200){
             let code = response.data.result;
              this.moveCode(code,_this);
              this.$store.state.userinfo =  getCookie("userinfo");
              if (this.$store.state.userinfo!=undefined){
                let map = {};
                //获取表单内的参数,并存入对象中
                map.loginName = this.$store.state.userinfo.loginName;
                map.password = this.$store.state.userinfo.password;
                map.code = code;
                map.cookieKey = this.Cookies.get("authcode");
                map.token = getCookie("token");
                map.checked = true;
                this.$axios.post(this.domain.ssoserverpath+"login",map).then(response=>{
                  if(response.data.code==200){
                    //将token和对象,存入自定义的store全局变量中
                    setCookie("userinfo",response.data.result,7);
                    this.$store.state.token = response.data.token;
                    this.$store.state.userinfo = response.data.result;
                    //将token和对象,存入本地session中,这样可以将参数持久化,在点击刷新后,能让参数不被刷掉
                    window.localStorage.setItem("userInfo",JSON.stringify(response.data.result));
                    window.localStorage.setItem("token",response.data.token);
                    this.$router.push({path:'/view/shouye/shouye',
                      query:{
                        username:response.data.result.userName,
                        userid:response.data.result.id
                      }
                    });
                  }else if(respo.error!=null){
                    this.$notify.error({
                      title: '提示',
                      duration:1000,
                      message: respo.error
                    });
                  }
                }).catch(error=>{
                  alert("用户名或密码错误");
                })
              }else if(response.data.code ==500){
                alert(response.data.success);
              }
            }
          }).catch(error=>{
            alert(error);
          })
      },
      methods:{
        submitForm(obj){
          if(this.ruleForm.username==""||this.ruleForm.password==""){
            alert("用户名或密码不能为空")
            return;
          }
          //获取拖动框内的验证码
          let code = this.$refs.coderef.value;
          if(code!=null||code!=""){
            this.$data.jindustyle.display = "block";
            //登录条样式
            var timer=setInterval(()=>{
              let pp=this.$data.percent+10;
              if(pp>=100){
                pp=99;
              }
              this.$data.percent=pp;
            },100)

            let map = {};
            //获取表单内的参数,并存入对象中
            map.loginName = this.ruleForm.username;
            map.password = this.ruleForm.password;
            map.code = code;
            map.cookieKey = this.Cookies.get("authcode");
            map.checked = this.ruleForm.checked;
            //登录
            this.$axios.post(this.domain.ssoserverpath+"login",map).then(response=>{
              if(response.data.code==200){
                //将token和对象,存入自定义的store全局变量中
                setCookie("userinfo",response.data.result,7);
                setCookie("token",response.data.token,7);
                this.$store.state.token = response.data.token;
                this.$store.state.userinfo = response.data.result;
                //将token和对象,存入本地session中,这样可以将参数持久化,在点击刷新后,能让参数不被刷掉
                window.localStorage.setItem("userInfo",JSON.stringify(response.data.result));
                window.localStorage.setItem("token",response.data.token);
                //关闭加载窗
                this.$data.percent=100
                //隐藏进度条
                this.$data.jindustyle.display='none'
                //关闭定时
                clearInterval(timer)
                //this.$router.push({path:'/index/user',query:{username:response.data.result.userName,userid:response.data.result.id}});
                this.$router.push({path:'/view/shouye/shouye',
                  query:{
                    username:response.data.result.userName,
                    userid:response.data.result.id
                  }
                });
              }else if(respo.error!=null){
                alert("失败");
                //关闭加载窗
                this.$data.percent=100
                //隐藏进度条
                this.$data.jindustyle.display='none'
                //关闭定时
                clearInterval(timer)
                this.$notify.error({
                  title: '提示',
                  duration:1000,
                  message: respo.error
                });
              }
            }).catch(error=>{
              alert("失败");
              alert(error);
            })
          }else {
            //关闭加载窗
            this.$data.percent=100;
            //隐藏进度条
            this.$data.jindustyle.display='none';
            //关闭定时
            clearInterval(timer);
            this.$notify.error({
              title: '错误',
              message: '出错了~_~，请联系管理员！'
            });
          }
        },
        //拖动验证start,老师的东西,我抄的-,-,不会!!!!!!!!!
        getOffset(box,direction){
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        },
        moveCode(code,_this){
          var fn = {codeVluae : code};
          var box = document.querySelector("#code-box"),
            progress = box.querySelector("p"),
            codeInput = box.querySelector('.code-input'),
            evenBox = box.querySelector("span");
          //默认事件
          var boxEven = ['mousedown','mousemove','mouseup'];
          //改变手机端与pc事件类型
          if(typeof document.ontouchstart == 'object'){
            boxEven = ['touchstart','touchmove','touchend'];
          }
          var goX,offsetLeft,deviation,evenWidth,endX;
          function moveFn(e){
            e.preventDefault();
            e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
            endX = e.clientX - goX;
            endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
            if(endX > evenWidth * 0.7){
              progress.innerText = '松开验证';
              progress.style.backgroundColor = "#66CC66";
            }else{
              progress.innerText = '';
              progress.style.backgroundColor = "#FFFF99";
            }
            progress.style.width = endX+deviation+'px';
            evenBox.style.left = endX+'px';
          }
          function removeFn() {
            document.removeEventListener(boxEven['2'],removeFn,false);
            document.removeEventListener(boxEven['1'],moveFn,false);
            if(endX > evenWidth * 0.8){
              progress.innerText = '验证成功';
              progress.style.width = evenWidth+deviation+'px';
              evenBox.style.left = evenWidth+'px'
              codeInput.value = fn.codeVluae;
              evenBox.onmousedown = null;
              _this.ruleForm.verification = true;

              //alert( codeInput.value);

            }else{
              progress.style.width = '0px';
              evenBox.style.left = '0px';
            }
          };
          function getOffset(box,direction){
            var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
            var offset = box[setDirection];
            var parentBox = box.offsetParent;
            while(parentBox){
              offset+=parentBox[setDirection];
              parentBox = parentBox.offsetParent;
            }
            parentBox = null;
            return parseInt(offset);
          };
          evenBox.addEventListener(boxEven['0'], function(e) {
            e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
            goX = e.clientX,
              offsetLeft = getOffset(box,'left'),
              deviation = this.clientWidth,
              evenWidth = box.clientWidth - deviation,
              endX;
            document.addEventListener(boxEven['1'],moveFn,false);
            document.addEventListener(boxEven['2'],removeFn,false);
          },false);
          fn.setCode = function(code){
            if(code)
              fn.codeVluae = code;
          }
          fn.getCode = function(){
            return fn.codeVluae;
          }
          fn.resetCode = function(){
            alert("====")
            evenBox.removeAttribute('style');
            progress.removeAttribute('style');
            codeInput.value = '';
          };
          return fn;
        }//拖动验证end

      }
    }
</script>

<style scoped>
  .ms-title{
    width:100%;
    line-height: 50px;
    text-align: left;
    font-size:20px;
    color: #fff;
    font-style:italic;
    border-bottom: 1px solid #ddd;
  }
  .ms-login{
    position: absolute;
    left:70%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content{
    padding: 30px 30px;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
  }

  /** 滑动验证start **/
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 70px;
    background-color:#fff;
    font-size: 12px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .p-title{
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style:italic
  }
  /** 滑动验证end **/
</style>
