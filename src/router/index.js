import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Register from '@/components/register'
import Login from '@/components/login'
import Home from '@/components/home/home'
import Search from '@/components/search/search'
import Visit from '@/components/visit/visit';
import ViewMsg from '@/components/viewMsg/viewMsg';
import MultiPage from '@/components/functions/multiPage'
import LetterCenter from '@/components/letter/letterCenter'
import MultiNotice from '@/components/letter/multiNotice'
import LetterChat from '@/components/letter/letterChat'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/Home/',
      name: 'home',
      component: Home,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/Register/',
      name: 'register',
      component: Register
    },
    {
      path: '/Login/',
      name: 'login',
      component: Login
    },
    {
      path: '/Search/',
      name: 'search',
      component: Search,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/Visit/',
      name: 'visit',
      component: Visit,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/ViewMsg/',
      name: 'viewMsg',
      component: ViewMsg,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/MultiPage/',
      name: 'multiPage',
      component: MultiPage,
      meta:{
        keepAlive: true
      }
    },
    {
      path: '/LetterCenter/',
      name: 'LetterCenter',
      component: LetterCenter,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/MultiNotice/',
      name: 'MultiNotice',
      component: MultiNotice,
      meta:{
        keepAlive: false
      }
    },
    {
      path: '/LetterChat/',
      name: 'LetterChat',
      component: LetterChat,
      meta:{
        keepAlive: false
      }
    }
    
  ]
})
