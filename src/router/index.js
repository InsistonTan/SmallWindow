import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Register from '@/components/register'
import Home from '@/components/home/home'
import Search from '@/components/search/search'
import Visit from '@/components/visit/visit';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/Home/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Register/',
      name: 'Register',
      component: Register
    },
    {
      path: '/Search/',
      name: 'Search',
      component: Search
    },
    {
      path: '/Visit/',
      name: 'Visit',
      component: Visit
    }
  ]
})
