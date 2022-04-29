<template>
  <!-- <h1 class="caption grey--text">CableTv</h1> -->
  <v-container class="my-5">
    <div class="">
      <v-card-title
        class="blue-grey--text text-h6 text--darken-1 font-weight-medium"
      >
        <v-icon color="blue-grey" small left> mdi-television-classic </v-icon>
        CableTv Subscription
        {{ userPP === null ? "not fetched yet" : userPP.phone }}
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
            src="../assets/tv.jpg"
          ></v-img>
        </v-card-title>

        <v-card-text>
          <v-form class="mx-4">
            <div class="mx-2 mb-6 d-flex align-center">
              <v-divider class="mr-4" />Fill in your decoder detail<v-divider
                class="ml-4 mr-2"
              />
            </div>

            <v-layout row wrap class="mx-2 py-2 mr-4">
              <v-text-field
                class=""
                v-model="iuc_number"
                label="IUC Number"
                single-line
                color="green accent-4"
                type="number"
                hide-details="auto"
                :rules="phone_rules"
                append-icon="mdi-badge-account"
                filled
              ></v-text-field>
            </v-layout>
            <v-layout column class="mx-2 mr-4 mb-6 mt-0"
              ><div class="align-center">
                <v-switch
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
            <v-layout row class="mx-2 mb-6 mt-0"
              ><div class="d-flex align-center">
                <v-select
                  @change="onOperatedSelected($event)"
                  v-model="selectedNetwork"
                  dense
                  :disabled="iuccheck"
                  color="green accent-4"
                  prepend-icon="mdi-television-classic"
                  :items="networks"
                  menu-props="auto"
                  hide-details
                  :label="
                    !iuccheck === true ? 'Select Operator' : 'Invalid IUC'
                  "
                  single-line
                ></v-select
                ><v-btn
                  class="mx-2 pa-5"
                  outlined
                  color="deep-purple lighten-4"
                >
                  <v-img
                    v-if="selectedNetwork == 'DSTV'"
                    max-height="30"
                    max-width="50"
                    src="../assets/dstv.png"
                  ></v-img>

                  <v-img
                    v-if="selectedNetwork == 'GOTV'"
                    max-height="30"
                    max-width="30"
                    src="../assets/gotv.jpg"
                  ></v-img>

                  <v-img
                    v-if="selectedNetwork == 'STARTIMES'"
                    max-height="30"
                    max-width="30"
                    src="../assets/startimes.png"
                  ></v-img>

                  <v-img
                    v-if="selectedNetwork == null"
                    max-height="30"
                    max-width="30"
                    ><v-icon>mdi-help</v-icon></v-img
                  >
                </v-btn>
              </div>
            </v-layout>

            <v-layout column class="mx-2 mb-0">
              <v-expand-x-transition>
                <v-select
                  class="mb-3"
                  @change="onPackageSelected($event)"
                  filled
                  dense
                  v-model="selectedPackage"
                  prepend-inner-icon="mdi-abacus"
                  :items="getSelectedCablePlan"
                  item-text="packageName"
                  menu-props="auto"
                  hide-details
                  label="Select Package"
                  single-line
                  color="green accent-4"
                  return-object
                ></v-select>
              </v-expand-x-transition>
              <v-btn
                :loading="loading0"
                :disabled="loading0"
                text
                x-small
                :color="
                  userDetail === 'Error : Incorrect IUC/Operator'
                    ? 'red accent-4'
                    : 'green accent-4'
                "
                class="
                  mb-2
                  white--text
                  text-capitalize
                  caption
                  font-weight-light
                "
                >{{ userDetail }}</v-btn
              >
              <v-btn
                :loading="loading3"
                :disabled="disableProceedButton"
                color="deep-orange darken-1"
                class="py-6 white--text caption text-capitalize"
                @click="proceed_to_topup"
              >
                Proceed
                <v-icon right dark x-small> mdi-login </v-icon>
              </v-btn>
              <v-checkbox
                class="d-flex align-center"
                v-model="saveBeneficiary"
                color="amber darken-3"
                value="amber darken-3"
                label="save beneficiary"
              ></v-checkbox>
              <v-expand-x-transition>
                <v-text-field
                  class="mb-2 mx-2"
                  v-show="saveBeneficiary"
                  v-model="new_beneficiary_name"
                  label="Beneficiary name"
                  single-line 
                  readonly
                  disabled
                  color="amber accent-4"
                  dense
                  append-icon="mdi-account"
                ></v-text-field>
              </v-expand-x-transition>
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
      <!-- Confirm Dialog -->
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title> CableTv Subscription </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <v-card-text class="text-center"
            ><v-btn class="mx-2 pa-5" outlined color="deep-purple lighten-4">
              <v-img
                v-if="selectedNetwork == 'STARTIMES'"
                max-height="30"
                max-width="30"
                src="../assets/startimes.png"
              ></v-img>

              <v-img
                v-if="selectedNetwork == 'DSTV'"
                max-height="30"
                max-width="30"
                src="../assets/dstv.png"
              ></v-img>

              <v-img
                v-if="selectedNetwork == 'GOTV'"
                max-height="30"
                max-width="30"
                src="../assets/gotv.jpg"
              ></v-img>
            </v-btn>
            <div class="text-center mt-4">
              <div class="">
                <h4 class="caption">{{ selectedPackagename }}</h4>
                <v-divider></v-divider>
                <h4 class="blue-grey--text text--darken-1 my-2">
                  {{ iuc_number }}
                </h4>
                <v-divider></v-divider>
                <h3 class="blue-grey--text">N{{ amount_to_recharge }}</h3>
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
              @click="purchase_cableTV()"
            >
              YES
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Confirm Dialog -->


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
            class="
              ma-6
              text-center
              blue-grey--text
              body-2
              font-weight-medium
            "
          >
        {{  successResponse  }}
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
                @click="closeSuccessDialog"
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
              Your {{ selectedNetwork }} decoder was successfully Recharged !
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
              <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 7 : 5">
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
                    >₦ {{ amount_to_recharge }}</span
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
                    ₦4000.94
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
                    >{{ iuc_number }}</span
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
                    Kufre Clement Ekpenyong
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
                      text-caption
                      font-weight-bold
                      grey--text
                    "
                  >
                    11:22am
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-divider class="mx-4" color="blue-grey"></v-divider>
            <v-row no-gutters class="pt-2">
              <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 12 : 12">
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
                    >{{ selectedNetwork }} subscription</span
                  >
                  <p
                    class="
                      ml-4
                      mt-n1
                      pl-6
                      text-caption
                      font-weight-bold
                      grey--text
                    "
                  >
                    {{ selectedPackagename }}
                    {{ successResponse }}
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
                      text-caption
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
  created() {
    this.$store.dispatch("createCableTV_Plans");
  },
  computed: {
    getSelectedBeneficiary() {
      return this.selectedbeneficiary;
    },
    getSelectedCablePlan() {
      var option = null;
      if (this.selectedNetwork === "DSTV") {
        option = this.$store.state.DSTV_PLANS;
      }
      if (this.selectedNetwork === "GOTV") {
        option = this.$store.state.GOTV_PLANS;
      }
      if (this.selectedNetwork === "STARTIMES") {
        option = this.$store.state.STARTIMES_PLANS;
      }
      return option;
    },
    beneficiary() {
      return this.$store.state.beneficiaries_cable_tv;
    },
    iuccheck() {
      var ttt = true;
      if (this.iuc_number.length === 10 || this.iuc_number.length === 11) {
        ttt = false;
      } else {
        ttt = true;
      }

      return ttt;
    },
    packages() {
      var option = null;
      if (this.selectedNetwork === "DSTV") {
        option = this.packages_dstv;
      }
      if (this.selectedNetwork === "GOTV") {
        option = this.packages_gotv;
      }
      if (this.selectedNetwork === "STARTIMES") {
        option = this.packages_startimes;
      }
      return option;
    },
    operatorType() {
      var option = null;
      if (this.selectedNetwork === "DSTV") {
        option = "dstv";
      }
      if (this.selectedNetwork === "GOTV") {
        option = "gotv";
      }
      if (this.selectedNetwork === "STARTIMES") {
        option = "startimes";
      }
      return option;
    },
  },
  mounted() {
    
    if (this.userPP === null) {
      this.$store.state.users.forEach((element) => {
        if (element.email === "vankace@gmail.com") {
          this.userPP = element;
          console.log("the userPP : ", this.userPP);
        }
      });
    }
  },
  data() {
    return {
      reference: null,
      successResponse:null,
      userPP: null,
      disableProceedButton: true,
      subscriberDetail: null,
      iuc_number: "",
      userDetail: null,
      loading0: false,
      success_dialog: false,
      failed_dialog: false,
      dialog: false,
      saveBeneficiary: false,
      phone_rules: [
        (value) => !!value || "phone number Required.",
        (value) => (value && value.length < 12) || "IUC number not valid",
        (value) => (value && value.length > 9) || "IUC number not valid",
      ],
      amount_rules: [
        (value) => !!value || "Amount Required.",
        (value) => (value && value >= 50) || "Minimum of N50",
        (value) => (value && value <= 10000) || "Maximum of N10000",
      ],
      operator: null,
      amount_to_recharge: null,
      phone_to_recharge: "",
      new_beneficiary: null,
      new_beneficiary_name: null,
      selectedPackagename: "",
      selectedPackage: null,
      selectedbeneficiary: null,
      selectedNetwork: null,
      networks: ["DSTV", "GOTV", "STARTIMES"],

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
    async purchase_cableTV() {
      this.dialog = false;
      this.loading3 = true;
      const uuid = this.uuid();
      this.refernce = uuid
      const notiPhone = this.userPP.phone
      const customerName = this.subscriberDetail.customerName
      const invoice = this.subscriberDetail.invoice
      const customernumber = this.subscriberDetail.customerNumber
      var url = "";
      var billType = ""
      if (this.selectedNetwork === "GOTV"){
        billType = "gotv"
      }
      if (this.selectedNetwork === "DSTV"){
        billType = "dstv"
      }
       if(this.selectedNetwork === "STARTIMES"){
          url = `https://mobileairtimeng.com/httpapi/startimes?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&phone=${notiPhone}&amt=${this.amount_to_recharge}&smartno=${this.iuc_number}&jsn=json&user_ref=${uuid}`

      }
      if (this.selectedNetwork === "GOTV" || this.selectedNetwork === "DSTV") {
        url = `https://mobileairtimeng.com/httpapi/multichoice?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&phone=${notiPhone}&amt=${this.amount_to_recharge}&smartno=${this.iuc_number}&customer=${customerName}&invoice=${invoice}&billtype=${billType}&customernumber=${customernumber}&jsn=json`;
      }

      

      try {
        // GET request using fetch with async/await
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === 100 && data.message === "Successful") {
          this.successResponse = data
          if(this.saveBeneficiary){
          var beneficiary = {
            phone: this.phone_to_recharge,
            network: this.selectedNetwork,
            name: this.new_beneficiary_name,
          };
          this.new_beneficiary = beneficiary;
          this.$store.dispatch("addBeneficiary_cable_tv", this.new_beneficiary);
          setTimeout(() => {
            console.log("this is bene list : ", this.$store.state.beneficiaries_cable_tv);

          }, 3000);
          }
          this.success_dialog = true
          this.loading3 = false;
        }
        if (data.code !== 100) {
          this.successResponse = data
          this.failed_dialog = true
          this.loading3 = false;
          console.log("Request not successful : ", data.message)
        }

        console.log("Decoder Details : ", data);
        
      } catch (error) {
        this.successResponse = error
        console.log(error);
        this.failed_dialog = true
        this.loading3 = false;
      }
    },

    closeSuccessDialog() {
      this.phone_to_recharge = "";
      this.selectedNetwork = null;
      this.new_beneficiary_name = null;
      this.amount_to_recharge = null;
      this.success_dialog = false;
      this.saveBeneficiary = false;
      this.beneficiary_on = false;
    },closeFailedDialog() {
      this.failed_dialog = false;
    },
    onChangeBeneficiary(event) {
      this.iuc_number = event.iuc;
      this.selectedNetwork = event.operator;
      this.onOperatedSelected();
    },
    onPackageSelected(event) {
      this.selectedPackage = event;
      this.amount_to_recharge = event.subAmount;
      this.selectedPackagename = event.packageName;
      console.log("checked ", this.selectedPackage);
    },
    async onOperatedSelected() {
      this.disableProceedButton = true;
      this.userDetail = "";
      var url = "";
      //url 2028835301= `https://mobileairtimeng.com/httpapi/multichoice?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&phone=xxx&amt=xxx&smartno=xxx&customer=xxx&invoice=x&billtype=xx&customernumber=x&jsn=json`
      url = `https://mobileairtimeng.com/httpapi/customercheck?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&bill=${this.operatorType}&smartno=${this.iuc_number}&jsn=json`;
      this.loading0 = true;
      try {
        // GET request using fetch with async/await
        const response = await fetch(url);
        const data = await response.json();

        // https://mobileairtimeng.com/httpapi/balance?userid=07037735888&pass=c30aa6886cb5b64655b1ac9&jsn=json"

        // JSON responses are automatically parsed.

        if (data.code === 100 && data.balance !== undefined) {
          this.disableProceedButton = false;
          this.userDetail = `${data.customerName} || Bal: N${data.balance}`;
          this.subscriberDetail = data;
           this.new_beneficiary_name = `${data.customerName}(${this.selectedNetwork})`
        }
        if (data.code === 100 && data.balance === undefined) {
          this.disableProceedButton = false;
          this.userDetail = `${data.customerName}`;
          this.subscriberDetail = data;
          this.new_beneficiary_name = `${data.customerName}(${this.selectedNetwork})`
        }
        if (data.code === 108) {
          this.disableProceedButton = true;
          this.subscriberDetail = null;
          this.userDetail = `Error : Incorrect IUC/Operator`;
        }

        this.loading0 = false;
        console.log("Decoder Details : ", this.subscriberDetail);
      } catch (error) {
        console.log(error);
      }
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
      if (this.iuc_number === "" || this.iuc_number === null) {
        this.text = "All fields requred!!";
        this.ERROR = true;
        return;
      }
      if (this.iuc_number.length < 10 || this.iuc_number.length > 11) {
        this.text = "Invalid IUC number";
        this.ERROR = true;
        return;
      }
      if (this.amount_to_recharge === null) {
        this.text = "Seleck Package";
        this.ERROR = true;
        return;
      }

      if (this.selectedNetwork === null) {
        this.text = "Select operator type";
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
 