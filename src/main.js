import Vue from 'vue'
import VueSession from 'vue-session'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'
import VueCookies from 'vue-cookie'
import moment from "moment";
import axios from 'axios';
import Element from 'element-ui'
import './assets/styles/adminlte.css';
import './assets/styles/app.scss'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import 'bootstrap/dist/css/bootstrap.min.css';

var options = {
  persist: true
}
Vue.use(VueSession, options)


Vue.filter('myDate', function name(createdAt) {
  return moment(createdAt).format('Do MMM, YY : h:mm a');
});
Vue.filter('myReceiptDate', function name(createdAt) {
  return moment(createdAt).format('Do MMMM, YYYY @ h:mm a');
});
var firebaseConfig = {
  apiKey: "AIzaSyCtp65wvil_dKH5ldqNii6f3lw7aZrqxlI",
  authDomain: "kacepay-mobile.firebaseapp.com",
  databaseURL: "https://kacepay-mobile-default-rtdb.firebaseio.com",
  projectId: "kacepay-mobile",
  storageBucket: "kacepay-mobile.appspot.com",
  messagingSenderId: "1080386551375",
  appId: "1:1080386551375:web:7153ea818fb943b5f4343a",
  measurementId: "G-Q9GM6GCT7D"
};
firebase.initializeApp(firebaseConfig);

Vue.prototype.$http = axios;
Vue.use(Element, { locale })
window.Event = new Vue();

new Vue({
  VueSession,
  router,
  store,
  vuetify,
  VueCookies,
   render: h => h(App)
}).$mount('#app')