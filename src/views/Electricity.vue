<template>
  <v-app style="background: #e9ecef">
    <div class="">
      <div class="content-header">
        <div class="container-fluid">
          <!-- title and breadcrum row -->
          <div class="row mb-2">
            <div class="col-sm-6">
              <h4
                style="font-family: 'Nunito', sans-serif; line-height: 1"
                class=""
              >
               Electricity bills
              </h4>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item fmenu "><router-link class="kacepay" to="/dashboard">Dashboard</router-link></li>
                <li class="breadcrumb-item fmenu active">Electricity bills</li>
              </ol>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6">
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
              <el-card
                class="box-card"
                
              >
                <div slot="header" class="clearfix">
                  <span
                    style="
                      font-family: 'Nunito', sans-serif;
                      font-size: 0.9rem;
                      line-height: 1.6;">Buy Power</span
                  >
                  <el-button
                    
                    style="float: right; padding: 3px 0"
                    type="text"
                  ></el-button>
                </div>
                <!-- card body g -->

                <div class="card-body mt-n4 ml-n4" element-loading-text="Loading please wait..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255,0.90)"
                v-loading="loadingp">
                  <el-select element-loading-text="Loading Discos..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255,0.80)"
                v-loading="loadingx"
                    @change="onDiscoSelected($event)"
                    style="width: 100%"
                    class="ma-2"
                    v-model="selectedDisco"
                    placeholder="Select Disco"
                  >
                    <el-option
                      v-for="(item, i) in getDiscos"
                      :key="i"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  
                  <el-input
                    class="ma-2"
                    @input="checkmeter()"
                    prefix-icon="el-icon-phone"
                    type="numeric"
                    style="width: 100%"
                    placeholder="Meter Number"
                    v-model="meter_to_recharge"
                    clearable
                  >
                  </el-input>
                  <el-select element-loading-text="Verifying meter..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255,255,255,0.90)"
                v-loading="loading0"
                    style="width: 100%"
                    @change="onMeterTypeSelected($event)"
                    class="ma-2"
                    v-model="meterType"
                    placeholder="Meter Type"
                  >
                    <el-option
                      v-for="item in meterTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
              <v-alert 
                class="mb-3 ml-2 text--lowercase"
                style="
                  font-family: 'Nunito', sans-serif;
                  font-size: 0.9rem; width:100%
                  line-height: 1.6;
                "
                transition="slide-x-transition"
                v-show="loading5"
                dense
                text
                :type="
                  userDetail === 'Error : Incorrect Meter No.'
                    ? 'error'
                    : 'success'
                "
              >
                {{ userDetail }}
              </v-alert>
                  <el-input-number 
                    class="ma-2"
                    v-model="amount_to_recharge"
                    controls-position="right"
                    
                  ></el-input-number>
                  <el-row>
                    <el-button
                      class="ma-2"
                      @click="showDataWindow()"
                      :loading="loading"
                      type="primary"
                      plain
                      >proceed</el-button
                    >
                  </el-row>
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
  computed:{
    getDiscos(){
      return this.$store.state.discos
    },
    getMinamount(){
      return this.selectedDisco === null ? 0 : parseInt(this.selectedDisco.min_denomination);
    },getMaxamount(){
      return this.selectedDisco === null ? 0 : parseInt(this.selectedDisco.max_denomination)
    },
  },
  async created() {},
  async mounted() {
    var vcas = []
    if (this.$store.state.discos === null) {
      
      this.loadingx = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}electricity`, {
          params: {
            scope: "getdiscos",
          }
        });
        const data = response.data;
        data.forEach(element => {
          element.value = element.name
          vcas.push(element);
        });
        this.loadingx = false
        this.$store.dispatch("addDiscos", vcas);
        
      }
      catch(error){
        console.log("error  retriving discos ", error);
        this.loadingx = false
      }
    }
  },
  data(){
    return {
      sData:null,
      loadingp:false,
      loading5:false,
      loading0:false,
      userDetail:'',
      ERROR:false,
      text:"",
      alertType: "error",
      loading:false,
      loadingx: false,
      discos:null,
      selectedDisco: null,
      amount_to_recharge:null,
      meterType:null,
      meter_to_recharge:"45051063266",
      meterTypeOption: [
        {
          value: 1,
          label: "PREPAID",
        },
        {
          value: 0,
          label: "POSTPAID",
        },
        
      ],
    }
  },
  methods: {
    uuid() {
      return "kpwxxxxxxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
   async verifyMeterDetails(product_id, meter_no){
      this.loading5 = false
      this.loading0 = true
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}electricity`, {
          params: {
            scope: "meterinfo",
            product_id: product_id,
            meterno: meter_no
          }
        });
        const data = response.data;
        if(data.code){
          if(data.code === 100){
            this.userDetail = data.message
          }
          else{
            this.userDetail = 'Error : Incorrect Meter No.'
          }
        }
        this.loading5 = true
        this.loading0 = false
        
      }
      catch(error){
        console.log("error  retrieving discos ", error);
        this.userDetail = 'Connection Error!'
        
        this.loading0 = false
        this.loading5 = true
      }
    },
    showDataWindow() {
      this.text = "";
      this.ERROR = false;
      if (
        this.amount_to_recharge === null ||
        this.meter_to_recharge === null ||
        this.selectedDisco === null
      ) {
        this.text = "All fields required!";
        this.ERROR = true;
        this.alertType = "error";
        return;
      }
      if (this.meter_to_recharge.length != 11) {
        this.text = "meter number not valid!";
        this.ERROR = true;
        this.alertType = "error";
        return;
      }if (this.meterType === null) {
        this.text = "Select your Meter Type";
        this.ERROR = true;
        this.alertType = "error";
        return;
      }
      if (this.amount_to_recharge < this.getMinamount) {
        this.text = `Minimum amount is N${this.getMinamount} for ${this.selectedDisco.name}`;
        this.ERROR = true;
        this.alertType = "error";
        return;
      }
      this.loading = true;
      
      var topup = {
        product_id: this.selectedDisco.product_id,
        amount: this.amount_to_recharge,
        meter_no: this.meter_to_recharge,
        meter_type: this.meterType.value,
      };
      this.open(topup);
      
    },
    open(topup) {
      this.$confirm("Do you want to proceed?", "Confirm", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.checkBal(topup);
        })
        .catch(() => {
          this.$message({
            type: "danger",
            message: "Order canceled",
          });
          this.loading = false;
        });
    },
    async checkBal(topup) {
      this.loadingp = true
      try {
        const responsebal = await axios.get(`${process.env.VUE_APP_API_URL}get_balance/${this.currentUser.uid}`, {
          params: {
            scope: "checkbalance",
          },
        });
        
        this.bal_before = responsebal.data;
        if (responsebal.data >= topup.amount) {
          this.topup(topup);
          
        } else if (responsebal.data < topup.amount) {
          console.log("Balance too low to proceed : ", responsebal.data);
          this.loading = false;
          this.loadingx = false;
          this.alertType = "error";
          this.text ="Insufficient balance! Please fund your account to proceed.";
          this.ERROR = true;
        } else {
          console.log("Internet access Error: ",);
          this.loading = false;
          this.loadingx = false;
          this.alertType = "error";
          this.text = "internet Connection error, please retry later.";
          this.ERROR = true;
        }
      } catch (error) {
        this.loadingx = false;
        console.log("Balance API Error: ", error);
        this.loading = false;
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
          var bal_after = parseFloat(tdp).toFixed(2);
      var transaction = {
        name: this.currentUser.first_name,
            email: this.currentUser.email,
            uid: this.currentUser.uid,
            type: "debit",
            service: `Electricity Bill`,
            description: `${this.selectedDisco.name} `,
            destination: topup.meter_no,
            reference: this.reference,
            amount: topup.amount,
            bal_before: this.bal_before,
            bal_after: bal_after,
            network: this.selectedDisco.product_id,
            status: "pending",
          };
      try {
         
        const response = await axios.get(`${process.env.VUE_APP_API_URL}electricity`, {
          params: {
            reference: this.reference,
            amount: topup.amount,
            meterno: topup.meter_no,
            meterType: topup.meter_type,
            product_id: topup.product_id,
            meter_name: this.userDetail,
            transaction: transaction,
          },
        });
        var dataret = response.data.data
        // console.log("Response : ", response.data);
        if (response.data.marvis === "success") {
          
          console.log("Recharge Completed : ", response.data.data);
          Event.$emit('updateFundTotal')
          this.alertType = "success";
          this.loading = false;
          this.loadingp = false;
          this.text = "Recharge completed successfully.";
          this.ERROR = true;
          this.phone_to_recharge = null;
          this.dataType = null;
          this.bundle = null;
          this.amount_to_recharge = null;
          let subject = `Transaction Notification [${transaction.type} alert]`
          transaction.meter_name = dataret.meter_name
          transaction.pinToken = dataret.pincode
          transaction.pinmessage = dataret.pinmessage
          this.sendMail(subject, transaction)
          this.showAlert();
        } 
        else if(response.data.marvis === "failed"){
          //console.log("Server down... : with code  ", response.data);
          this.alertType = "error";
          this.text = "your recharge was successful but we could not register your transaction at the moment";
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
          this.loadingp = false;
          this.loadingx = false;
          this.alertType = "error";
          this.ERROR = true;
          this.phone_to_recharge = null;
          this.dataType = null;
          this.bundle = null;
          this.amount_to_recharge = null;
          let subject = `Transaction Notification [${transaction.type} alert]`
          transaction.meter_name = dataret.meter_name
          transaction.pinToken = dataret.pincode
          transaction.pinmessage = dataret.pinmessage
          this.sendMail(subject, transaction)
          this.showAlert();
        } 
        else {
          //console.log("Server down... : with code  ", response.data);
          this.alertType = "error";
          this.text = response.data;
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
          this.loadingp = false;
        }
        
      } catch (error) {
        
        console.log("Database error: ", error);
        this.loadingx = false;
        this.loading = false;
        this.loadingp = false;
        this.alertType = "error";
        this.text = "Unknown error.";
        this.ERROR = true;
      }
    },
    
    onDiscoSelected(event){
      if(this.meter_to_recharge && this.meter_to_recharge.length === 11){
        this.verifyMeterDetails(event.product_id, this.meter_to_recharge)
      }
    },
    onMeterTypeSelected(){

    },
    checkmeter(){
      if(this.selectedDisco && this.meter_to_recharge.length === 11){

        this.verifyMeterDetails(this.selectedDisco.product_id, this.meter_to_recharge)
      }
      
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

    formatAmount(amount){
      
      var v = `${amount}`
      
      return parseFloat(v).toFixed(2);
    },
    async sendMail(subject, transaction, ){
      
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
      console.log("email feedback : ", responsebal.data);
      
      if(responsebal.data === 'success'){
        console.log("email Sent successfully : ");
      }else{
        console.log("error : ", responsebal.data);
      }
      
    } catch (error) {
      //this.bal_available = this.currentUser.balance;
    }
    }
  }
};
</script>
