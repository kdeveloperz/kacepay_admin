<template>
  <nav>
    <v-app-bar   app>
      <!-- <div class="d-flex align-center">
      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://kacepay.tech/img/logo1.png"
        width="100"
      /> 
    </div> -->
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="deep-orange--text"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">kacepay</span>
        <span class="deep-orange--text">admin</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user" text outlined x-small>
        <span class="mr-2 text-capitalize caption"
          ><v-icon color="green accent-4" class="mb-1" small
            >mdi-cash-multiple</v-icon
          ></span
        >
        <v-icon x-small>mdi-currency-ngn</v-icon>
        <span 
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255,0.90)"
                v-loading="loadingx" class="mr-2 text-capitalize text-body-2">{{ totBalance }}</span>
      </v-btn>

      <v-btn v-else text small class="success--text">
        <span class="mr-2 text-uppercase">sign in</span>
        <v-icon small>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="user"  app v-model="drawer">
      <v-list>
        <v-list-item class="px-2" link>
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title style="font-family: 'Nunito', sans-serif;" v-if="user">
              Admin
            </v-list-item-title>
            <v-list-item-subtitle  style="font-family: 'Nunito', sans-serif; line-height: 1" v-if="user">
              {{ user.email }}</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-icon @click="drawer = !drawer">mdi-menu-left</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <!-- <v-list dense>xxxxx </v-list> -->

      <v-list shaped nav dense class="pink--text">
        <v-list-group class="fmenu" no-action color="deep-orange">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold"
                ><v-icon left small>mdi-wallet</v-icon> E-Wallet</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item class="ml-n8 ma-n2 " v-for="(a, i) in 3" :key="i">
            <v-list-item-icon>
              <v-icon x-small >{{a===3 ? 'mdi-cash-multiple ':""}}{{a===1 ? 'mdi-currency-ngn ':""}}{{a===2 ? 'mdi-cash ':""}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="ml-n8 ">
              <v-list-item-title class="fmenu ">{{a===3 ? 'Request payout ':""}} {{a===2 ? 'Fund wallet ':""}} {{a===1 ? 'Available balance':""}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
  <v-divider class="ma-2"></v-divider>
        <v-list-item-group
          active-class="white"
          class="deep-orange--text" 
          v-for="(link, index) in links"
          :key="index"
          >
          <v-list-item router :to="link.route">
            <v-list-item-icon>
              <v-icon small v-text="link.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content   class="ml-n6 fmenu">
              <v-list-item-title style="font-size:14.4px"  v-text="link.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider class="ma-2"></v-divider>
            <v-list-group no-action color="deep-orange">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold"
                ><v-icon left small>mdi-cog</v-icon>  Settings</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item class="ml-n8 ma-n2" v-for="(a, i) in 2" :key="i">
            <v-list-item-icon>
              <v-icon x-small >{{a===1 ? 'mdi-account-cog ':""}}{{a===2 ? 'mdi-cog-transfer ':""}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="ml-n8">
              <v-list-item-title class="blue-grey--text text--darken-2 caption"> {{a===2 ? 'Change password ':""}} {{a===1 ? 'Account settings ':""}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-list shaped>
          <v-list-item dense class="grey lighten-3" link>
            <v-list-item-icon>
              <v-icon small>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="red--text font-weight-black" v-if="user" @click="logOut"
                >Logout</v-list-item-title
              >
              <v-list-item-title v-if="!user" @click="login"
                >Login</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  async created() {
    this.loadingx = true
    this.$store.dispatch('getTransactions')
    Event.$on("updateFundTotal", () => {
      this.getFundingTotal()
      console.log('up fired: ');
    });
    const response = await fetch(`${process.env.VUE_APP_API_URL}balance`);
    const data = await response.json();
    this.totBalance = data;
    this.loadingx = false
    
    },

  computed: {
    isLogincheck() {
      return this.$store.state.user;
    },
  },
  watch: {
    user() {},
  },
  methods: {
    getFundingTotal(){
      var debitTotal = 0;
      var counter = 0;
      var total = 0;
      this.$store.state.transactionList.forEach(element => {
         ++counter
        if(element.type === 'credit'){
          
          total = ((total/1) + (element.amount/1))
          
        }
        if(element.type === 'debit'){
          
          debitTotal = ((debitTotal/1) + (element.amount/1))
          
        }
      });
       
     this.$store.dispatch('updateFundTotal', parseFloat(total.toFixed(2)))
      this.$store.dispatch('updateDebitTotal', parseFloat(debitTotal.toFixed(2)))
      this.$store.dispatch('updateTransactionCount', counter)
      
    },
    chkUser() {
      var ff = this.$store.state.user;
      console.log(" User : " + ff);
    },
    login() {
      this.$router.push("login");
    },
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("signOutUser");
          console.log("Sign-out successful");
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  props: {
    user: Object,
  },
  data() {
    return {
      loadingx:false,
      totBalance: 0.0,
      off: true,
      isLogin: false,
      drawer: true,
      links: [
        { icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },
        { icon: "mdi-account-multiple", text: "Users", route: "/users" },
        {
          icon: "mdi-clock-outline",
          text: "Transactions",
          route: "/transactions",
        },
        {
          icon: "mdi-phone-classic",
          text: "Airtime Topup",
          route: "/airtime-topup",
        },
        {
          icon: "mdi-television-classic",
          text: "CableTv Subscription",
          route: "/cable-tv",
        },
        {
          icon: "mdi-database-marker",
          text: "MTN Datashare",
          route: "/data-share",
        },
        {
          icon: "mdi-database",
          text: "Direct data bundles",
          route: "/direct-data-bundle",
        },
        {
          icon: "mdi-transmission-tower",
          text: "Electricity bill",
          route: "/electricity-bill",
        },
        {
          icon: "mdi-cash-multiple",
          text: "Airtime to cash",
          route: "/#",
        },
        {
          icon: "mdi-cash-100",
          text: "E-Pins purchase",
          route: "/yuy",
        },
      ],
    };
  },
};
</script>

<style scoped>
.border {
  border-width: 1px;
  border-radius: 10px;
}
</style>