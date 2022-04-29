<template>
  <v-menu bottom origin="center center" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-icon small v-bind="attrs" class="teal--text" v-on="on"> mdi-square-edit-outline </v-icon>
    </template>

    <v-list nav dense>
        
      <v-list-item-group ><FundDialog :user="user" @notifyFundSuccess="notifyFundSuccess"  @notifyData="notifyupdate" />
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-icon>
            <v-icon  v-text="item.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content v-if="item.text == 'Recent Transactions'">
            <v-list-item-title @click="showRecentTransactions(user)"  v-text="item.text"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title  v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

    </v-list>
  </v-menu>
</template>

<script>
import FundDialog from "./FundDialog.vue";
export default {
    props: {
  // fname: String,
  // lname: String,
  // email: String,
  // uid: String,
  // kid: String,
  // phone: String,
  // bal: Number,
  //dialog: Boolean,
  user: Object 
},
methods: {
  showRecentTransactions(user){
    this.$router.push(`/transactions/${user.uid}`)
  },
  sho(address){
    alert(address.uid)
  },
    notifyupdate(){
        this.$emit("showAlert")
    },
    notifyFundSuccess(){
          this.menu = false
          this.$emit("notifyFundSuccess");
      },

},
    components: { FundDialog },
  data: () => ({
    items: [
      { text: 'Edit Info', icon: 'mdi-account-edit' },
        { text: 'Deactivate User', icon: 'mdi-account-cancel' },
        { text: 'Recent Transactions', icon: 'mdi-history' },
    ],
  }),
};
</script>

<style>
</style>