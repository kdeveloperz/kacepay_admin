<template>
<v-row>
    <v-dialog scrollable max-width="500px" v-model="fundDialog">
      <div style="background: transparent" class="col-md-12 pa-0 ">
        <div class="card card-primary card-outline">
          <div class="card-header">
            <h3 class="card-title fmenu">Fund User Account</h3>
          </div>

          <form
            class="fmenu"
            v-if="user"
            @submit.prevent="fundUser()"
          >
            <div
              class="card-body"
              element-loading-text="Funding user account..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255,0.90)"
              v-loading="loadingx"
            >
              
              <div class="form-group">
                <div class="row">
                  <div class="col-md-6">
                    <label for="balance">Available Balance (₦) </label>
                    <input
                      disabled
                      type="text"
                      v-model="user.balance"
                      class="form-control"
                      id="balance"
                      placeholder="Balance"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="fundamount">Funding Amount (₦) </label>
                    <input
                      
                      type="number"
                      v-model="amount"
                      class="form-control"
                      id="fundamount"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                  v-model="checkbox"
                  @change="checkAddress"
                />
                <label style="color:red" class="form-check-label" for="exampleCheck1"
                  >N/B : This action is not reversible!!</label
                >
              </div>
            </div>

            <div class="card-footer">
              <p>Last Updated at : {{ user.updated_at | myReceiptDate }}</p>
              <button :disabled="bgt" type="submit" class="btn btn-primary">
                <i class="fas fa-edit"></i> Update Detail
              </button>
            </div>
          </form>
        </div>
      </div>
    </v-dialog>
  </v-row>  
</template>

<script>

import axios from 'axios';
//import firebase from "firebase";
import Swal from 'sweetalert2'
export default {
  props: {
    currentUser: Object,
  },
  mounted() {
    Event.$on("updateFundTotal", () => {
      this.$store.dispatch('getTransactions')
    });
  },
  created() {
    
    Event.$on("fundUser", (user) => {
      this.fundDialog = true;
      this.user = user;
      //console.log('up : ',this.user);
    });
  },
  data() {
    return {
      fundDialog:false,
      user:null,
      amount:null,
      bgt:true,
      checkbox: null,
      loadingx:false,
    };
  },
  methods: {
    formatAmount(amount){
      var v = `${amount}`
      
      return parseFloat(v).toFixed(2);
    },
    uuid() {
      return "kpwxxxxxxxxxxxx".replace(/[x]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    checkAddress() {
      if (this.checkbox) {
        this.bgt = false;
      } else {
        this.bgt = true;
      }
    },
    async fundUser() {
      if(this.amount === null || this.amount ===""){
        return
      }
      this.loadingx = true;
      const uuid = this.uuid();
      this.reference = uuid;
      var dd = this.user.balance / 1 + this.amount / 1;
          var tdp = dd.toFixed(2);
          var bal_after = parseFloat(tdp).toFixed(2);
          var transaction = {
            name: this.user.first_name,
            email: this.user.email,
            uid: this.user.id,
            type: "credit",
            service: "Account Funding",
            description: `Account credited by admin`,
            destination: "N/A",
            reference: this.reference,
            amount: this.amount,
            bal_before: this.user.balance,
            bal_after: bal_after,
            network: "N/A",
            status: "completed",
          };
      try {
        const response = await axios.post(`http://localhost:8000/api/credit-user/${this.user.uid}`, {
          transaction: transaction,
        });
        
        if (response.data === "success") {

           this.loadingx = false
          this.fundDialog = false
          Event.$emit('updateFundTotal')
          let subject = `Transaction Notification [${transaction.type} alert]`
         this.sendMail(subject, transaction)
          this.showAlert(
            "success",
            "Transaction Successfull!",
            "User account was successfully credited."
          );
          //this.saveTransaction(reRes);
          
        }else{
          this.loadingx = false;
          this.showAlert(
          "error",
          "Funding Failed!",
          "Unknown Network error. Please try again later."
        );
        }
      } catch (error) {
        this.loadingx = false;
        this.showAlert(
          "error",
          "Funding Failed!",
          "Sorry, we could not credit the user. Please try again later."
        );
      }
    },
    
    async saveTransaction(transaction) {
      try {
        const response = await axios.post("api/airtime", {
          email: transaction.email,
          uid: transaction.uid,
          type: transaction.type,
          service: transaction.service,
          description: transaction.description,
          destination: transaction.destination,
          reference: transaction.reference,
          amount: transaction.amount,
          bal_before: transaction.bal_before,
          bal_after: transaction.bal_after,
          network: transaction.network,
          status: transaction.status,
        });
        console.log("Transaction added! : ", response.data);
        if (response.data === "success") {
          console.log("Recharge Completed : ", transaction);
          Event.$emit("taskAdded");
          
          
        } else {
          this.loadingx = false;
          this.fundDialog = false
          this.showAlert(
          "error",
          "Transaction Recording failed!",
          "Sorry, we could not record the transaction, but the user was credited."
        );
        this.rollback()
        return
        }
      } catch (error) {
        console.log("saving to database error Error: ", error);
        this.loadingx = false;
        this.fundDialog = false
          this.showAlert(
          "error",
          "unknown Recording error!",
          "Sorry, we could not record the transaction, but the user was credited."
        );
        this.rollback()
        return
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
    async rollback(){
      try {
        const response = await axios.post(`api/user-update`, {
          id: this.user.id,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          phone: this.user.phone,
          role: this.user.type,
          email: this.user.email,
          balance: this.user.balance,
        });
        console.log("rollback : ",this.user.balance )
        if (response.data === "success"){
          this.$notify({
            title: "Notice",
            message: "Rollback completed.",
            type: "warning",
          });
        }
      }catch(error){
        this.$notify({
            title: "Notice",
            message: "Rollback failed. Please initiale rollback manually.",
            type: "error",
          });
      }
    },
    
    async sendMail(subject, transaction){
      
      try {
      const responsebal = await axios.post(`http://localhost:8000/api/emsend`, {
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
  },
}
</script>
