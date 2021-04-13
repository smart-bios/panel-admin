import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: null
  
  },

  mutations: {
    setToken(state, token){
      state.token = token;
    },

    setUsuario(state, user){
      state.user = user;
    }
  },

  actions: {
    saveToken({commit}, token){
      commit("setToken", token)
      commit("setUsuario", decode(token))
      window.localStorage.setItem("token", token)
      return decode(token)
    },

    autoLogin({commit}){
      let token = localStorage.getItem("token");
      if(token) {
        commit("setToken", token);
        commit("setUsuario", decode(token));
        router.push({name: 'Home'});
      }   
    },

    logout({commit}){
      commit("setToken", null);
      commit("setUsuario", null);
      localStorage.removeItem("token");
      router.push({name: 'Login'});
    }

  }
})
