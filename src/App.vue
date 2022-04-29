<template>
  <v-app dark>
     <Navbar :user="USER"/>

    <v-main >
     <router-view :currentUser="currentUser" v-slot="{ Component }">
       <transition name="route" mode="out-in">
         <component :is="Component"></component>
       </transition>
     </router-view>
    </v-main>
    <Footer/>

    
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'
//import firebase from 'firebase'

export default {
  name: "App",
   mounted() {
       this.$store.dispatch("getUser")
    
    this.currentUser = this.$store.state.user
       
      
    
  },
  components: {
    Navbar,
    Footer
  },
  computed: {
    USER() {
      
      return this.$store.state.user
      
    },
  },
  watch: {
    // USER () {
    //   // Our fancy notification (2).
    //   console.log(" Watcher User APP VUE fired!!! : ")
    //   var dd = null
    //   if(dd){
    //     console.log(" Watcher User APP VUE fired!!! yyyy "+dd)
    //   }
      

    // }
  },
  data() {
    return {
      user: {},
      currentUser:null
    }
  },
  methods: {
    
  }
}
</script>
<style lang="scss">
@import '~bootstrap/scss/bootstrap';

.route-enter-active, .route-leave-active {
  transition: opacity 5s;
}
.route-enter, .route-leave-to{
  opacity: 0;
}

</style>
