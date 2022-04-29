<template>
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
        class="box-card mt-n6"
        element-loading-text="Loading please wait..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255,0.90)"
        v-loading="loadingx"
      >
        <div slot="header" class="clearfix">
          <img height="50px" src="../assets/airtel.jpg" alt=""/> <span class="ml-3"
            style=" font-weight: bold;
              font-family: 'Nunito', sans-serif;
              font-size: 20px 1.6; color: #ff0000;
            "
            >AIRTEL Data Share</span
          >
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
          ></el-button>
        </div>

        <div class="card-body mt-n4 ml-n4">
          <el-select
            style="width: 100%"
            @change="onNetworkSelected($event)"
            class="ma-2"
            v-model="dataType"
            placeholder="Select data Type"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            @change="onPackageTypeSelected($event)"
            class="ma-2"
            style="width: 100%"
            v-model="bundle"
            placeholder=" Data size"
          >
            <el-option
              v-for="item in dataOption"
              :key="item.value"
              :label="`${item.value} @ N${item.amount}`"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-input
            class="ma-2"
            prefix-icon="el-icon-phone"
            type="numeric"
            style="width: 100%"
            placeholder="Phone Number"
            v-model="phone_to_recharge"
            clearable
          >
          </el-input>
          <el-input-number
            class="ma-2"
            :disabled="true"
            v-model="amount_to_recharge"
            :precision="2"
            :min="50"
            :max="10000"
          ></el-input-number>
          <el-row>
            <el-button
              class="ma-2"
              @click="showDataWindow()"
              :loading="loading"
              type="warning"
              plain
              >proceed</el-button
            >
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
  props: {
    currentUser: Object,
  },
  
  mounted() {},
  data() {
    return {
      loadingx: false,
      success_dialog: false,
      bal_before: null,
      ERROR: false,
      text: "error ooooooo",
      alertType: "error",
      loading: false,
      phone_to_recharge: null,
      amount_to_recharge: null,
      dataOption: null,
      options: [
        {
          value: "AIRTEL",
          label: "AIRTEL Datashare",
        },
      ],

      dataType: null,
      bundle: null,
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
      this.$confirm("Do you want to proceed?", "Confirm", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.checkBal(topup);
          console.log(topup);
        })
        .catch(() => {
          this.$message({
            type: "danger",
            message: "Order canceled",
          });
          this.loading = false;
        });
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
        this.alertType = "error";
        return;
      }
      if (this.phone_to_recharge.length != 11) {
        this.text = "phone number not valid!";
        this.ERROR = true;
        this.alertType = "error";
        return;
      }
      if (this.amount_to_recharge < 50) {
        this.text = "Minimum amount is N50!";
        this.ERROR = true;
        this.alertType = "error";
        return;
      }
      this.loading = true;

      var topup = {
        dataName: this.bundle.value,
        amount: this.bundle.amount,
        phone: this.phone_to_recharge,
        network: 'AIRTEL',
        dataType: this.dataType,
        size: this.bundle.size,
      };
      this.open(topup);
      // this.checkBal(topup);
      // console.log(topup);
    },
    async checkBal(topup) {
      try {
        this.loadingx = true;
        const responsebal = await axios.get(`${process.env.VUE_APP_API_URL}get_balance/${this.currentUser.uid}`);
        this.bal_before = responsebal.data;
        if (responsebal.data >= topup.amount) {
          this.topup(topup);
          console.log("suppose to proceed");
          this.loadingx = true;
        } else if (responsebal.data < topup.amount) {
          console.log("Balance too low to proceed : ", responsebal.data);
          this.loading = false;
          this.loadingx = false;
          this.alertType = "error";
          this.text =
            "Insufficient balance! Please fund your account to proceed.";
          this.ERROR = true;
        } else {
          this.loading = false;
          this.loadingx = false;
          this.alertType = "error";
          this.text = "internet Connection error, please retry later.";
          this.ERROR = true;
        }
      } catch (error) {
        console.log("Balance API Error: ", error);
        this.loading = false;
        this.loadingx = false;
        this.alertType = "error";
        this.text = "Connection error,\n please retry later.";
        this.ERROR = true;
      }
    },

    async topup(topup) {
      const uuid = this.uuid();
      this.reference = uuid;
      var dd = this.bal_before / 1 - topup.amount / 1;
          var tdp = dd.toFixed(2);
          var bal_after = parseFloat(tdp)
      var transaction = {
            name: this.currentUser.first_name,
            email: this.currentUser.email,
            uid: this.currentUser.uid,
            type: "debit",
            service: `Airtel Datashare`,
            description: `AIRTEL ${topup.dataName}  DATA`,
            destination: topup.phone,
            reference: this.reference,
            amount: parseFloat(parseFloat(topup.amount).toFixed(2)),
            bal_before: this.bal_before,
            bal_after: bal_after,
            network: "AIRTEL",
            status: "pending",
          };
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}datashare`, {
          params: {
            reference: this.reference,
            amount: topup.amount,
            phone: topup.phone,
            network: topup.network,
            dataType: topup.dataType,
            dataSize: topup.size,
            transaction: transaction,
          },
        });
        console.log("Response : ", response.data);
         if (response.data === "success") {
          this.alertType = "success";
          this.loading = false;
          this.loadingx = false;
          this.text = "Recharge completed successfully.";
          this.ERROR = true;
          Event.$emit('updateFundTotal')
          this.phone_to_recharge = null;
          this.dataType = null;
          this.bundle = null;
          this.amount_to_recharge = null;
          let subject = `Transaction Notification [${transaction.type} alert]`
          this.sendMail(subject, transaction)
          this.$notify({
            title: "Success",
            message: "Order completed successfully.",
            type: "success",
          });
        }
        else if(response.data.code === 103){
          //console.log("Server down... : with code  ", response.data);
          this.alertType = "error";
          this.text = "Server downtime error. Please try again later.";
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
        }else if(response.data.code === 101){
          //console.log("Server down... : with code  ", response.data);
          this.alertType = "error";
          this.text = response.data.message;
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
        } 
        else {
          if(response.data.error){
          //console.log("Server down... : with code  ", response.data);
          this.alertType = "error";
          this.text = response.data.error;
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
        }else{
          this.alertType = "error";
          this.text = "Server downtime error. Please try again later.";
          this.ERROR = true;
          this.loading = false;
          this.loadingx = false;
        }
          //console.log("Server down... : with code  ", response.data);
          
        }
      } catch (error) {
        console.log("Database error: ", error);
        this.loading = false;
        this.loadingx = false;
        this.alertType = "error";
        this.text = "Database error, your request may have been processed.";
        this.ERROR = true;
      }
    },
    
    onNetworkSelected() {
      
        this.dataOption = this.$store.state.airtel_data_share;
      
      
    },
    onPackageTypeSelected(event) {
      this.amount_to_recharge = event.amount;
      console.log("selected data : ", event);
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
      //console.log("email feedback : ", responsebal.data);
      
      if(responsebal.data === 'success'){
        console.log("email Sent successfully : ");
      }else{
        console.log("error : ", responsebal.data);
      }
      
    } catch (error) {
      //this.bal_available = this.currentUser.balance;
    }
    },
    showAlert(type, title, message) {
      Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonText: "Close",
        confirmButtonColor: type === "success" ? "#00C853" : "#ff0000"
      });
    },
  },
};
</script>

<style>
</style>