<template>

    <v-app style="background: #e9ecef">
      <div class="">
      <div class="content-header">
        <div class="container-fluid">
          <!-- title and breadcrum row -->
          <div class="row mb-2">
            <div class="col-sm-6">
               <h1 class="fmenu">Airtime Topup</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item fmenu "><router-link class="kacepay" to="/dashboard">Dashboard</router-link></li>
                <li class="breadcrumb-item fmenu active">Buy Airtime</li>
              </ol>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="mx-2 d-flex justify-center"></div>
              <div class="mx-2 d-flex align-center">
                <v-divider class="mr-4" />Fill in your mobile top up
                detail<v-divider class="ml-4 mr-2" />
              </div>
              <v-alert
                class="mb-3"
                style="
                  font-family: 'Nunito', sans-serif;
                  font-size: 0.9rem;
                  line-height: 1.6;
                "
                transition="slide-x-transition"
                v-show="ERROR"
                dense
                text
                :type="alertType"
              >
                {{ text }}
              </v-alert>
              <el-card class="box-card" element-loading-text="Loading please wait..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255,255,255,0.90)"  v-loading="loadingx">
                <div slot="header" class="clearfix">
                  <span class="fmenu">Buy Airtime</span>
                  <el-button
                    
                    style="float: right; padding: 3px 0"
                    type="text"
                    ></el-button
                  >
                </div>
                <div
                  class="card-body font-weight-light px-6"
                  style="
                    font-family: 'Nunito', sans-serif;
                    font-size: 0.9rem;
                    line-height: 1.6;
                  "
                >
                  <v-form ref="form">
                    <v-select
                      append-outer-icon="mdi-web"
                      v-model="selectedNetwork"
                      :items="items"
                      color="green accent-4"
                      item-text="name"
                      return-object
                      dense
                      outlined
                      label="Select Network"
                      class="mb-3"
                    ></v-select>
                    <v-text-field
                      class="mb-3 mt-n4"
                      label="Phone number"
                      type="number"
                      :rules="phone_rules"
                      append-outer-icon="mdi-phone-classic"
                      dense
                      outlined
                      clearable
                      color="green accent-4"
                      v-model="phone_to_recharge"
                    ></v-text-field>
                    <v-text-field
                      class=""
                      label="Amount"
                      placeholder="Enter amount"
                      filled
                      dense
                      outlined
                      color="green accent-4"
                      :rules="amount_rules"
                      type="number"
                      hide-details="auto"
                      append-outer-icon="mdi-currency-ngn"
                      v-model="amount_to_recharge"
                    ></v-text-field>
                  </v-form>
                  <v-divider></v-divider
                  ><v-btn
                    :loading="btnloading"
                    :disabled="btnloading"
                    @click="showDataWindow"
                    color="green accent-4 "
                    class="white--text text-capitalize"
                  >
                    Place order
                  </v-btn>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
  props: {
    currentUser: Object,
  },
  
  mounted() {
  },
  data() {
    return {
      loadingx:false,
      bal_before: null,
      search: "",
      alertType: "error",

      btnloading: false,
      ERROR: false,
      text: "",
      phone_rules: [
        (value) => !!value || "phone number Required.",
        (value) => (value && value.length === 11) || "phone number not valid",
      ],
      amount_rules: [
        (value) => !!value || "Amount Required.",
        (value) => (value && value >= 50) || "Minimum of N50",
        (value) => (value && value <= 10000) || "Maximum of N10000",
      ],
      phone_to_recharge: null,
      selectedNetwork: null,
      amount_to_recharge: null,
      items: [
        { name: "MTN VTU", code: 15 },
        { name: "MTN AWUFU", code: 20 },
        { name: "AIRTEL", code: 1 },
        { name: "GLO", code: 6 },
        { name: "9MOBILE", code: 2 },
      ],
    };
  },
  methods: {
   
    uuid() {
      return "kpwxxxxxxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    open(topup) {
      this.$confirm(
        "Do you want to proceed?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.checkBal(topup);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Order canceled",
          });
          this.btnloading = false;
          this.loadingx = false
        });
    },
    async checkBal(topup) {
      try {
        const responsebal = await axios.get(`${process.env.VUE_APP_API_URL}get_balance/${this.currentUser.uid}`);
        this.bal_before = responsebal.data;
        if (responsebal.data >= topup.amount) {
         this.topup(topup);
          
        } 
        else if (responsebal.data < topup.amount) {
          console.log("Balance too low to proceed : ", responsebal.data);
          this.btnloading = false;
          this.loadingx = false
          this.alertType = "error";
          this.text = "Insufficient balance! Please fund your account to proceed.";
          this.ERROR = true; 
        }
        else{
          console.log("Internet access Error: ");
        this.btnloading = false;
        this.loadingx = false
        this.alertType = "error";
        this.text = "internet Connection error, please retry later.";
        this.ERROR = true;
        }
      } catch (error) {
        console.log("Balance API Error: ", error);
        this.btnloading = false;
        this.loadingx = false
        this.alertType = "error";
        this.text = "Network error, please retry later.";
        this.ERROR = true;
      }
    },

    async topup(topup) {
      const uuid = this.uuid();
      this.reference = uuid;
      var dd = this.bal_before / 1 - topup.amount / 1;
          var tdp = dd.toFixed(2);
          var bal_after = parseFloat(tdp);
          var transaction = {
            name: this.currentUser.first_name,
            email: this.currentUser.email,
            uid: this.currentUser.uid,
            type: "debit",
            service: "airtime",
            description: `${this.selectedNetwork.name} ${this.amount_to_recharge}`,
            destination: topup.phone,
            reference: this.reference,
            amount: parseFloat(parseFloat(topup.amount).toFixed(2)),
            bal_before: this.bal_before,
            bal_after: bal_after,
            network: topup.network,
            status: "pending",
          };

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}airtime`, {
          params: {
            reference: this.reference,
            amount: topup.amount,
            phone: topup.phone,
            network: topup.network,
            transaction: transaction,
          },
        });
        //console.log("Response get with params : ", response.data);
        if (response.data === "success") {
          Event.$emit('updateFundTotal')
          //console.log("Recharge Completed : ", transaction);
          this.alertType = "success";
          this.btnloading = false;
          this.loadingx = false
          this.text = "Recharge completed successfully.";
          this.ERROR = true;
          this.phone_to_recharge = null;
          this.selectedNetwork = null;
          this.amount_to_recharge = null;
          this.$refs.form.reset();
          let subject = `Transaction Notification [${transaction.type} alert]`
          this.sendMail(subject, transaction)
          this.$notify({
            title: "Success",
            message: "Order completed successfully.",
            type: "success",
          });
          
        } 
        
      } catch (error) {
        console.log("Database error: ", error);
        this.btnloading = false;
        this.loadingx = false
        this.alertType = "error";
        this.text = "Database error, your request may have been processed.";
        this.ERROR = true;
      }
    },
    showDataWindow() {
      
      this.text = "";
      this.ERROR = false;
      if (
        this.amount_to_recharge === null ||
        this.phone_to_recharge === null ||
        this.selectedNetwork === null
      ) {
        this.text = "All fields required!";
        this.ERROR = true;
        return;
      }
      if (this.phone_to_recharge.length != 11) {
        this.text = "phone number not valid!";
        this.ERROR = true;
        return;
      }
      if (this.amount_to_recharge < 50) {
        this.text = "Minimum amount is N50!";
        this.ERROR = true;
        return;
      }
      this.btnloading = true;
      this.loadingx =true

      var topup = {
        amount: this.amount_to_recharge,
        phone: this.phone_to_recharge,
        network: this.selectedNetwork.code,
      };
      this.open(topup);
    },
    onNetworkSelected(event) {
      this.amount_to_recharge = event.amount;
      this.selectedPackagename = event.data;
      this.selectedPackagesize = event.size;

    },
    
    formatAmount(amount){
      var v = `${amount}`
      
      return parseFloat(v).toFixed(2);
    },
    async sendMail(subject, transaction){
      
      try {
      const responsebal = await axios.post(`${process.env.VUE_APP_API_URL}emsend`, {
        email: transaction.email,
        service:transaction.service,
        subject: subject,
        name: transaction.name,
        amount: this.formatAmount(transaction.amount),
        bal_before: this.formatAmount(transaction.bal_before),
        bal_after: this.formatAmount(transaction.bal_after),
        transaction: transaction
      });
      
      if(responsebal.data === 'success'){
        console.log("email Sent successfully : ");
      }else{
        console.log("error : ", responsebal.data);
      }
      
    } catch (error) {
      
      console.log("network error : ", error);
    }
    },
    ff(){
      //this.$session.destroy()
      let y = this.$session.get('user');
      console.log('sesseio : ',  y);
    },
    async gg(){
      this.$notify({
            title: "Success",
            message: "Order completed successfully.",
            type: "success",
          });
    },
    showAlert() {
      Swal.fire({
        title: "Transaction Successfull!",
        text: "Your purchase was successfull.",
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#00C853",
      });
    },
   
  },
};
</script>
<style>

</style>


