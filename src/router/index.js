import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/login'
import user from '@/view/list/user'
import role from '@/view/list/role'
import tmenu from '@/view/list/tmenu'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },

    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {//子模块
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}},
            {path: '/user', component: user, meta:{require: true}},
            {path: '/role', component: role, meta:{require: true}},
            {path: '/tmenu', component: tmenu, meta:{require: true}},
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    }
  ]
})
