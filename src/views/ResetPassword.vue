<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <el-card class="box-card" style="max-width: 500px">
          <div slot="header" class="clearfix">
            <span
              
              >Enter your registered email</span
            >
            <el-button class="fmenu" @click="gotoLogin()" style="float: right; padding: 3px 0" type="text"
              >back to login</el-button
            >
          </div>
          <div class="card-body mt-n4 ml-n4">
            <el-input placeholder="Enter email" v-model="email"></el-input>
            <el-button @click="reset()"  class="my-2 fmenu" type="warning">Reset Password</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2'
export default {
  data() {
    return {
      email: null,
    };
  },
  methods: {
     reset() {
        if(this.email === null || this.email === ""){
            this.showAlert()
            return
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCtp65wvil_dKH5ldqNii6f3lw7aZrqxlI'
      const data = {
        email: this.email,
        requestType: "PASSWORD_RESET",
      };
      const headers = {
        "Content-Type": "application/json",
      };
    //   try {
          axios.post(url, data, { headers }).then(res => 
              console.log('ress : ', res.data)
          ).catch(error => {
        
        console.error('There was an error!', error);
    });
      
    //   this.showSuccessAlert()
    //   } catch (error) {
    //       this.showErrorAlert()
    //       console.log('ress Error: ', error);
    //   }
      
    },
    gotoLogin(){
        this.$router.push('/login')
    },
    showErrorAlert() {
      Swal.fire({
        title: "enter email",
        text: "Error!!",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#ff0000",
      });
    },
    showSuccessAlert() {
      Swal.fire({
        title: "Email sent!",
        text: `a password reset email link has been sent to ${this.email}`,
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