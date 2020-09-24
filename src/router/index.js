import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Storage from '../views/Storage.vue'
import Users from '../views/Users.vue'
import Genomes from '../views/Genomes.vue'
import Databases from '../views/Databases.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      user: true
    }
  },

  {
    path: '/storage',
    name: 'Storage',
    component: Storage,
    meta: {
      user: true
    }
  },

  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      user: true
    }
  },
  {
    path: '/genomes',
    name: 'Genomes',
    component: Genomes,
    meta: {
      user: true
    }
  },
  {
    path: '/databases',
    name: 'Databases',
    component: Databases,
    meta: {
      user: true
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {

  const rutasProtegida = to.matched.some(record => record.meta.user);
  
  if(rutasProtegida){
      //console.log(`rutas protegida: ${rutasProtegida}`)
    if(store.state.user && store.state.user.role === 'ADMIN_ROLE'){
      next()
    }else{
      console.log("El usuario no ha iniciado session")
      next({name:'Login'})
    } 
  }else{
    next()
  }
})
export default router
