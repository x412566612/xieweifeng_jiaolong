import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex)

const store = new vuex.Store({
  state:{
    token:"",
    userinfo:{}
  }
})
export default store
