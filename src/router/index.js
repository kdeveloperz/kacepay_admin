import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import UserTransactions from '../views/UserTransactions.vue'
import TransactionDetails from '../views/TransactionDetails.vue'
import NotFound from '../components/NotFound.vue'
import BuyAirtime from '../views/BuyAirtime.vue'
import CableTv from '../views/CableTv.vue'
import Electricity from '../views/Electricity.vue'
import DataShare from '../views/DataShare.vue'
import DirectDataBundle from '../views/DirectDataBundle.vue'
import Settings from '../views/Settings.vue'
// import Users from '../views/Users.vue'
import AllUsers from '../views/AllUsers.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPassword from '../views/ResetPassword.vue'
//import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  { path: '/404', component: NotFound },  
  { path: '*', redirect: '/404' }, 
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Transactions',
    name: 'transactions',
    component: UserTransactions,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Transactions/:id',
    name: 'TransactionDetails',
    component: TransactionDetails,
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    
  },
  {
    path: '/airtime-topup',
    name: 'AirtimeTopup',
    component: BuyAirtime,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/cable-tv',
    name: 'CableTv',
    component: CableTv,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/electricity-bill',
    name: 'Electricity',
    component: Electricity,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/data-share',
    name: 'DataShare',
    component: DataShare,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/direct-data-bundle',
    name: 'DirectBundle',
    component: DirectDataBundle,
    meta: {
      requiresAuth: true
    }
  },
  
  {
    path: '/Settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/Users',
    name: 'users',
    component: AllUsers,
    meta: {
      requiresAuth: true
    }
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = Vue.prototype.$session.get('user')
   if (requiresAuth && !isAuthenticated) {
    //console.log("not authenticated")
    next('/login')
  } else {
    //console.log("authenticated : user "+ isAuthenticated)
    next()
  }
}) 
export default router
