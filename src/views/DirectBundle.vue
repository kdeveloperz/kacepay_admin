<template>
  <v-container class="my-5">
    <div class="">
      <v-card-title
        class="blue-grey--text text-h6 text--darken-1 font-weight-medium"
      >
        <v-icon color="blue-grey" small left> mdi-database </v-icon>
        Direct Data Bundles
      </v-card-title>
    </div>
    <div>
      <v-card translate="yes" class="mx-auto" flat py-6 max-width="430px">
        <!-- <v-card-title class="mb-2 mx-2 text-h5 font-weight-bold d-flex justify-center"><v-img max-height="100" max-width="100" src="../assets/kacepaylogoo.png"></v-img></v-card-title> -->
        <v-card-title
          class="mx-2 text-h5 font-weight-bold d-flex justify-center"
          ><v-img
            max-height="100"
            max-width="100"
            src="../assets/data.png"
          ></v-img>
        </v-card-title>

        <v-card-text>
          <v-form class="mx-4">
            <div class="mx-2 mb-6 d-flex align-center">
              <v-divider class="mr-4" />Fill in your mobile top up
              detail<v-divider class="ml-4 mr-2" />
            </div>

            <v-layout row wrap class="mx-2 py-2 mr-4">
              <v-text-field
                class=""
                v-model="phone_to_recharge"
                label="Phone number"
                single-line
                color="green accent-4"
                type="number"
                hide-details="auto"
                :rules="phone_rules"
                append-icon="mdi-phone-classic"
                filled
              ></v-text-field>
            </v-layout>
            <v-layout column class="mx-2 mr-4 mb-6 mt-0"
              ><div class="align-center">
                <v-switch
                  v-show="beneficiary_on"
                  v-model="beneficiary_on"
                  label="choose from beneficiary"
                  color="orange"
                  value="orange"
                ></v-switch>
                <v-expand-x-transition>
                  <v-select
                    @change="onChangeBeneficiary($event)"
                    v-show="beneficiary_on"
                    v-model="selectedbeneficiary"
                    prepend-inner-icon="mdi-lock-smart"
                    :items="beneficiary"
                    item-text="name"
                    menu-props="auto"
                    hide-details
                    label="Select beneficiary"
                    single-line
                    color="green accent-4"
                    return-object
                  ></v-select>
                </v-expand-x-transition>
              </div>
            </v-layout>
            <v-layout row class="mx-1 mb-6 mt-0">
              <v-select
                v-model="selectedNetwork"
                dense
                color="green accent-4"
                prepend-icon="mdi-web"
                :items="networks"
                menu-props="auto"
                hide-details
                label="Select Network"
                single-line
              ></v-select>
            </v-layout>
            <v-expand-x-transition>
              <v-select
                class="mb-3"
                @change="onPackageSelected($event)"
                filled
                dense
                prepend-icon="mdi-abacus"
                :items="getSelectedNetwork"
                item-text="data"
                menu-props="auto"
                hide-details
                label="Select Package"
                single-line
                color="green accent-4"
                return-object
              ></v-select>
            </v-expand-x-transition>
            <v-layout column class="mx-2 mb-0">
              <v-text-field
                class="mb-2 mx-16"
                v-model="amount_to_recharge"
                label="Amount"
                single-line
                readonly
                color="green accent-4"
                type="number"
                hide-details="auto"
                prepend-inner-icon="mdi-currency-ngn"
              ></v-text-field>
              <v-btn
                :loading="loading3"
                :disabled="loading3"
                color="deep-orange darken-1"
                class="py-6 white--text caption text-capitalize"
                @click="proceed_to_topup"
              >
                Proceed
                <v-icon right dark x-small> mdi-login </v-icon>
              </v-btn>

              <v-alert
                transition="slide-x-transition"
                v-if="ERROR"
                dense
                text
                type="error"
              >
                {{ text }}
              </v-alert>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
    <div class="text-center ma-2">
      <v-snackbar
        top
        right
        elevation="1"
        timeout="3000"
        transition="slide-x-transition"
        text
        outlined
        absolute
        color="error"
        v-model="snackbar"
        ><v-icon class="success--text"> mdi-account-check </v-icon>
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            rounded
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            x
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-row justify="center">
      <!-- confirm Dialog here -->
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title> Data Topup </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-card-text class="text-center">
            <div class="text-center mt-4">
              <div class="">
                <h4 class="blue-grey--text text--darken-1">
                  MTN {{ selectedPackagename }} 
                </h4>
                <v-divider></v-divider>
                <h4 class="blue-grey--text my-2">
                  {{ phone_to_recharge }}
                </h4>
                <v-divider></v-divider>
                <h3 class="grey--text text--darken-1">
                  N{{ amount_to_recharge }}
                </h3>
              </div>
            </div>
          </v-card-text>
          <h3 class="text-center caption blueGrey--text mt-0">
            Do you want to proceed?
          </h3>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red accent-4" text small @click="dialog = false">
              cancel
            </v-btn>

            <v-btn
              color="green accent-4"
              text
              outlined
              dense
              @click="purchase_data()"
            >
              YES
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- confirm Dialog here -->

      <!-- Error Dialog here -->
      <v-dialog
        v-model="failed_dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card class="mt-n4">
          <v-card-text class=""
            ><p>
              <v-btn
                class="mt-8"
                fab
                small
                color=""
                top
                left
                absolute
                @click="closeFailedDialog"
              >
                <v-icon color="red accent-4">mdi-close</v-icon></v-btn
              >
            </p>
            <p class="text-center mt-0 pt-8">
              <v-avatar size="70" class="text-center" color="red accent-4">
                <v-icon x-large dark> mdi-close-octagon </v-icon>
              </v-avatar>
            </p>

            <h2
              class="text-center mt-8 red--text text--accent-5 text--darken-2"
            >
              Recharge Error!
            </h2>
            <h3 class="text-center text-subtitle-2 grey--text mt-2 mb-1">
              Sorry! We could not complete your request, please again later.
            </h3>
          </v-card-text>
          <v-divider color="blue-grey"></v-divider>
          <h4
            class="ma-6 text-center blue-grey--text body-2 font-weight-medium"
          >
            {{ successResponse }}
          </h4>

          <v-divider class="mx-8" color="blue-grey"></v-divider>

          <v-divider class="mx-8" color="blue-grey"></v-divider>

          <v-row class="d-flex">
            <v-col
              class="
                d-flex
                ma-6
                text-right
                pl-6
                text-caption
                font-weight-medium
                grey--text
                text-center
              "
            >
              Thank you for choosing KacePay. If you need any further
              assistance, please do write to us at support@kacepay.tech
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <!-- Error Dialog here -->

      <!-- success Dialog here -->
      <v-dialog
        v-model="success_dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card class="mt-n4">
          <v-card-text class=""
            ><p>
              <v-btn
                class="mt-8"
                fab
                small
                color=""
                top
                left
                absolute
                @click="success_dialog = !success_dialog"
              >
                <v-icon color="red accent-4">mdi-close</v-icon></v-btn
              >
            </p>
            <p class="text-center mt-0 pt-8">
              <v-avatar size="70" class="text-center" color="green accent-4">
                <v-icon x-large dark> mdi-check-all </v-icon>
              </v-avatar>
            </p>

            <h2
              class="text-center mt-8 green--text text--accent-5 text--darken-2"
            >
              Recharge success!
            </h2>
            <h3 class="text-center text-subtitle-2 blue-grey--text mt-2 mb-1">
              Your {{ selectedNetwork }} Topup order was successful!
            </h3>
          </v-card-text>
          <v-divider color="blue-grey"></v-divider>
          <h4
            class="
              ma-6
              text-center
              blue-grey--text
              body-2
              text-uppercase
              font-weight-bold
            "
          >
            Payment Summary
          </h4>

          <v-divider class="mx-8" color="blue-grey"></v-divider>
          <v-container class="">
            <v-row no-gutters>
              <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 8 : 4">
                <v-card v-if="n === 1" class="" tile flat>
                  <span>
                    <v-icon small class="ml-2" color="blue-grey">
                      mdi-wallet
                    </v-icon>
                  </span>

                  <v-icon small color="blue" class=""> mdi-check </v-icon>
                  <span
                    class="
                      text-body-2
                      font-weight-bold
                      blue-grey--text
                      text--darken-2
                    "
                    >Paid Using E-wallet</span
                  >
                  <p
                    class="
                      ml-4
                      mt-n1
                      pl-6
                      text-body-2
                      font-weight-bold
                      grey--text
                    "
                  >
                    Updated Wallet balance
                  </p>
                </v-card>

                <v-card v-if="n === 2" class="" tile flat>
                  <span
                    class="
                      justify-end
                      d-flex
                      text-body-2
                      font-weight-bold
                      blue-grey--text
                      mx-4
                    "
                    >₦{{ amount_to_recharge }}</span
                  >
                  <p
                    class="
                      mx-4
                      text-right
                      mt-n1
                      pl-6
                      text-caption
                      font-weight-bold
                      grey--text
                    "
                  >
                    ₦N/A
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-divider class="mx-4" color="blue-grey"></v-divider>
            <v-row no-gutters>
              <v-col
                class="pt-2"
                v-for="n in 2"
                :key="n"
                :cols="n === 1 ? 8 : 4"
              >
                <v-card v-if="n === 1" class="" tile flat>
                  <span
                    class="
                      ml-4
                      text-body-2
                      font-weight-bold
                      blue-grey--text
                      text--darken-2
                      pl-6
                    "
                    >{{ phone_to_recharge }}</span
                  >
                  <p
                    class="
                      ml-4
                      mt-n1
                      pl-6
                      text-body-2
                      font-weight-bold
                      grey--text
                    "
                  >
                    {{ selectedNetwork }} airtime Topup
                  </p>
                </v-card>
                <v-card v-if="n === 2" class="" tile flat>
                  <span
                    class="
                      justify-end
                      d-flex
                      text-caption
                      font-weight-bold
                      blue-grey--text
                      mx-4
                    "
                    >Feb 11, 2021</span
                  >
                  <p
                    class="
                      mx-4
                      text-right
                      mt-n1
                      pl-6
                      text-body-2
                      font-weight-bold
                      grey--text
                    "
                  >
                    @ 11:22am
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-divider class="mx-4" color="blue-grey"></v-divider>
            <v-row no-gutters class="pt-2">
              <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 6 : 6">
                <v-card v-if="n === 1" class="" tile flat>
                  <span
                    class="
                      ml-4
                      text-body-2
                      font-weight-bold
                      blue-grey--text
                      text--darken-2
                      pl-6
                    "
                    >+2347037735888</span
                  >
                  <p
                    class="
                      ml-4
                      mt-n1
                      pl-6
                      text-body-2
                      font-weight-bold
                      grey--text
                    "
                  >
                    4GB Data Recharge
                  </p>
                </v-card>
                <v-card v-if="n === 2" class="" tile flat>
                  <span
                    class="
                      justify-end
                      d-flex
                      text-caption
                      font-weight-bold
                      blue-grey--text
                      mx-4
                    "
                    >{{ reference }}</span
                  >
                  <p
                    class="
                      mx-4
                      text-right
                      mt-n1
                      pl-6
                      text-body-2
                      font-weight-bold
                      grey--text
                    "
                  >
                    Ref ID
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="mx-8" color="blue-grey"></v-divider>

          <v-row class="d-flex">
            <v-col
              class="
                d-flex
                ma-6
                text-right
                pl-6
                text-caption
                font-weight-bold
                blue-grey--text
                text-center
              "
              >You should get a confirmation message from your network operator.
              Thank you for choosing KacePay. If you need any further
              assistance, please do write to us at support@kacepay.tech
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <!-- success Dialog here -->
    </v-row>
    
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    getSelectedBeneficiary() {
      return this.selectedbeneficiary;
    },
    beneficiary() {
      return this.$store.state.beneficiaries_airtime;
    },
    getSelectedUrl(){
      var option = null
      if(this.selectedNetwork === "MTN"){
        option = 15
      }
      if(this.selectedNetwork === "AIRTEL"){
        option = 1
      }
      if(this.selectedNetwork === "GLO"){
        option = 6
      }
      if(this.selectedNetwork === "9MOBILE"){
        option = 2
      }
      
      return option
      
    },
    getSelectedNetwork(){
      var option = null
      if(this.selectedNetwork === "MTN"){
        option = this.$store.state.mtn_data
      }
      if(this.selectedNetwork === "AIRTEL"){
        option = this.$store.state.airtel_data
      }
      if(this.selectedNetwork === "GLO"){
        option = this.$store.state.glo_data
      }
      if(this.selectedNetwork === "9MOBILE"){
        option = this.$store.state.nmobile_data
      }
      
      return option
      
    },
  },
  async mounted() {
    if(this.$store.state.mtn_data === null){
      var result = null;
    var m =
      "https://mobileairtimeng.com/httpapi/get-items?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&service=mtn";
    var a =
      "https://mobileairtimeng.com/httpapi/get-items?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&service=airtel";
    var g =
      "https://mobileairtimeng.com/httpapi/get-items?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&service=glo";
    var n =
      "https://mobileairtimeng.com/httpapi/get-items?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&service=9mobile";
    try {
      const responsem = await fetch(m);
      const responsea = await fetch(a);
      const responseg = await fetch(g);
      const responsen = await fetch(n);
      const datam = await responsem.json();
      const dataa = await responsea.json();
      const datag = await responseg.json();
      const datan = await responsen.json();

      for (let index = 0; index < 4; index++) {
        console.log("index : ", index);
        if (index === 0) {
          result = {
            code: "mtn",
            products: datam.products
          };
        }
        if (index === 1) {
          result = {
            code: "airtel",
            products: dataa.products
          };
        }
        if (index === 2) {
          result = {
            code: "glo",
            products: datag.products
          };
        }
        if (index === 3) {
          result = {
            code: "nmobile",
            products: datan.products
          };
        }
        this.$store.dispatch("addDataBundle", result);
      }

      console.log("result : ", result);
      
    } catch (error) {
      console.log("error fron down: ", error);
    }
    }
  },
  data() {
    return {
      selectedPackagesize: null,
      successResponse: null,
      failed_dialog: false,
      reference: null,
      success_dialog: false,
      dialog: false,
      saveBeneficiary: false,
      phone_rules: [
        (value) => !!value || "phone number Required.",
        (value) => (value && value.length === 11) || "phone number not valid",
      ],
      amount_rules: [
        (value) => !!value || "Amount Required.",
        (value) => (value && value >= 50) || "Minimum of N50",
        (value) => (value && value <= 10000) || "Maximum of N10000",
      ],
      amount_to_recharge: null,
      phone_to_recharge: "",
      new_beneficiary: null,
      new_beneficiary_name: null,
      selectedbeneficiary: null,
      selectedNetwork: null,
      networks: ["MTN", "AIRTEL", "9MOBILE", "GLO"],

      beneficiary_on: false,
      show1: false,
      ERROR: false,
      snackbar: false,
      text: "",
      loading3: false,
      checkbox: true,
      user: {
        userEmail: "",
        userPassword: "",
      },
    };
  },
  methods: {
    
    uuid() {
      return "kacepay_WEB_xxxxxxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    closeFailedDialog() {
      this.failed_dialog = false;
    },

    async purchase_data() {
      this.dialog = false;
      this.loading3 = true;
      const uuid = this.uuid();
      this.reference = uuid;

      var url = `https://mobileairtimeng.com/httpapi/datatopup?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&network=${this.getSelectedUrl}&phone=${this.phone_to_recharge}&amt=${this.amount_to_recharge}&jsn=json&user_ref=${uuid}`

      try {
        // GET request using fetch with async/await
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 100 && data.message === "Recharge successful") {
          this.successResponse = data;

          this.success_dialog = true;
          this.loading3 = false;
        }
        if (data.code !== 100) {
          this.successResponse = data;
          this.failed_dialog = true;
          this.loading3 = false;
          console.log("Request not successful : ", data.message);
        }

        console.log("Data Details : ", data);
      } catch (error) {
        this.successResponse = error;
        console.log(error);
        this.failed_dialog = true;
        this.loading3 = false;
      }
    },
    onPackageSelected(event) {
      this.amount_to_recharge = event.amount;
      this.selectedPackagename = event.data;
      this.selectedPackagesize = event.size;

      console.log("checked ", this.selectedPackage);
    },
    onChangeBeneficiary(event) {
      this.phone_to_recharge = event.phone;
      this.selectedNetwork = event.network;
    },
    chkU() {
      var us = this.$store.state.user;
      if (us) {
        console.log("Store User : " + us.email);
      } else {
        console.log("Store User : signed out");
      }
      this.snackbar = true;
    },
    proceed_to_topup() {
      this.ERROR = false;
      if (this.phone_to_recharge === "" || this.phone_to_recharge === null) {
        this.text = "All fields requred!!";
        this.ERROR = true;
        return;
      }
      if (this.phone_to_recharge.length != 11) {
        this.text = "Invalid phone number";
        this.ERROR = true;
        return;
      }
      if (this.amount_to_recharge < 40 || this.amount_to_recharge === null) {
        this.text = "Minimum amount is N50";
        this.ERROR = true;
        return;
      }
      if (this.amount_to_recharge > 10000) {
        this.text = "Maximum amount is N10000";
        this.ERROR = true;
        return;
      }
      if (this.selectedNetwork === null) {
        this.text = "Select network type";
        this.ERROR = true;
        return;
      }
      this.dialog = true;
    },
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("signOutUser");
          console.log("Sign-out successful");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loader() {
      this.loading3 = true;
      setTimeout(() => {
        this.loading3 = false;
      }, 3000);
    },
  },
};
</script>

<style scopped>
.v-text-field--filled > .v-input__control > .v-input__slot,
.v-text-field--full-width > .v-input__control > .v-input__slot,
.v-text-field--outlined > .v-input__control > .v-input__slot {
  align-items: inherit;
  min-height: 56px;
  font-family: Muli, sans-serif;
}
.v-input {
  align-items: flex-start;
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
}
.theme--light.v-label {
  color: rgb(0 0 0 / 38%);
}
.v-label {
  font-size: 12px;
  line-height: 1;
  min-height: 6px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>


c30aa6886cb5b64655b1ac9 

https://mobileairtimeng.com/httpapi/balance?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&jsn=json
https://mobileairtimeng.com/httpapi/get-items?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&service=mtn