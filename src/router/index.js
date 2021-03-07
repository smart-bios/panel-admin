import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Storage from '../views/Storage.vue'
import Files from '../views/Files.vue'
import Users from '../views/Users.vue'
import Species from '../views/Species.vue'
import Projects from '../views/Projects.vue'
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
    path: '/files',
    name: 'Files',
    component: Files,
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
    path: '/species',
    name: 'Soecies',
    component: Species,
    meta: {
      user: true
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
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
    if(store.state.user && store.state.user.role === 'ADMIN'){
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
