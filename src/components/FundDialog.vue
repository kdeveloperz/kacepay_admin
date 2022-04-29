<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-alpha-n-circle</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-bind="attrs" v-on="on">
              Fund Account</v-list-item-title
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon color="deep-orange"> mdi-cash-multiple</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                >Fund {{ user.fname }}'s eWallet</v-list-item-title
              >
            </v-list-item-content>

            <v-list-item-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="sendAlert" color="deep-orange"></v-switch>
            </v-list-item-action>
            <v-list-item-title class="caption"
              >Send Fund alert</v-list-item-title
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-text-field
                v-model="fundAmount"
                class="caption"
                outlined
                dense
                filled
                label="Enter Amount"
                prepend-icon="mdi-bank-plus"
              ></v-text-field>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="error" text @click="notifyD"> Cancel </v-btn>
          <v-btn color="success" text @click="fundWallet"> Fund Account </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    
  </div>
</template>
<script>
import firebase from "firebase";
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
    user: Object,
  },
  data() {
    return {
      fundAmount: 0,
      fav: true,
      menu: false,
      sendAlert: true,
      hints: true,
    };
  },
  methods: {
      notifyD(){
          this.menu = false
          this.$emit("notifyData");
      },
      notifyFundSuccess(){
          this.menu = false
          this.$emit("notifyFundSuccess");
      },
    fundWallet() {
      //alert(this.user.fname + " Balance is " + this.user.originalBalance);
      const ref = firebase.database().ref("/users/" + this.user.uid);
      const amount = (this.fundAmount/1) + (this.user.originalBalance/1)
      ref.update(
        {
          balance: parseFloat(Number(amount).toFixed(2)),
        },
        (error) => {
          if (error) {
            console.log("The update failed...");
          } else {
            console.log("Account funded successfully! : NGN"+  amount);
            this.notifyFundSuccess()
            this.menu = false;
          }
        }
      );
    },
  },
};
</script>