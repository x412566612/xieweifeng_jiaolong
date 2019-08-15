// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
/*
import Blob from '@/excel/Blob.js'
import export2Excel from  '@/excel/export2Excel.js'
*/

Vue.config.productionTip = false
//引入全局变量
import gloable from './store/gloable'
Vue.prototype.domain = gloable;


//引入VUEX
import store from './store/store'
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入axios
import axios from 'axios'
// 允许携带cookie
// 允许携带cookie
axios.defaults.withCredentials=true

Vue.prototype.$axios=axios

//引入cookie插件
import Cookies from 'js-cookie'
Vue.prototype.Cookies=Cookies
//为axios添加一个请求拦截器start
axios.interceptors.request.use(request=>{

  console.log("打印请求"+request.url);
  if(request.url.includes("getCode")){
   let authcode = Cookies.get("authcode");
   if(authcode==null){
     Cookies.set("authcode",{path:"/",domain:"localhost",age:-1});
   }
  }else {
    if(!request.url.includes("login")){
      console.log("添加token");
    /* let token =  window.localStorage.getItem("token");*/
      let token =  window.localStorage.getItem("token");
      request.headers.token= token;
    }
  }

  return request;
})
//为axios添加一个请求拦截器end

//设置一个响应拦截器用来刷新token信息start
axios.interceptors.response.use((response)=>{
  let yy=response.data.token;
  if(yy!=undefined&&yy!=null){
    //重新设置localStorge中的token的值，用来刷新tocken
    console.log("刷新token");
    window.localStorage.setItem("token",response.data.token);
  }
  return response;
},(error)=>{
  //失败跳转到登录界面
  console.log("token失效了");
  router.replace({
    path: '/',
    query: {redirect: router.currentRoute.fullPath}
  })
})
//设置一个响应拦截器end

//添加路由拦截，拦截路由权限start
router.beforeEach((to,from,next)=>{
  //判断是否登录 to.meta.require是true说明需要进行登录的验证
  if(to.meta.require){

    //获取本地存储中的jwt token
    let token=window.localStorage.getItem("token");
    /*let token=window.localStorage.getItem("token");*/
    if(token!=null){
      next();
    }else{
      next({path:"/"});//跳转到登录页面
    }
  }else{
    //否则说明不需要进行登录的验证
    next();
  }
  //判断是否在权限列表中
});
//添加路由拦截，拦截路由权限end



//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'
/* eslint-disable no-new */

//音频文件的使用
import yinpin from '../static/tishiyin/tishiyin.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import qingsong from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id,yinyue) => {

  let buttonAudio = document.getElementById(id);

  if(yinyue=="yinpin"){
    buttonAudio.setAttribute('src',yinpin)
  }
  if(yinyue=="en"){
    buttonAudio.setAttribute('src',en)
  }
  if(yinyue=="aiya"){
    buttonAudio.setAttribute('src',aiya)
  }
  if(yinyue=="qingsong"){
    buttonAudio.setAttribute('src',qingsong)
  }
  buttonAudio.play(); //没有就播放
  /*if (buttonAudio.paused) { //判读是否播放
    buttonAudio.paused=false;

  }*/

}


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

