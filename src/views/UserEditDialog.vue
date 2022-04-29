<template>
  <v-row
    ><div class="clearfix"></div>
    <v-dialog scrollable max-width="500px" v-model="dialog">
      <div style="background: transparent" class="col-md-12 pa-0 mt-8">
        <div class="card card-primary card-outline">
          <div class="card-header">
            <h3 class="card-title fmenu">Update User Information</h3>
          </div>

          <form
            class="fmenu"
            v-if="user"
            @submit.prevent="checkIfUserIsModified()"
          >
            <div
              class="card-body"
              element-loading-text="Updating profile detail..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255,0.90)"
              v-loading="loadingx"
            >
              <div class="form-group">
                <div class="row">
                  <div class="col-md-6">
                    <label for="fname">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.first_name"
                      id="fname"
                      placeholder="first name"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="lname">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.last_name"
                      id="lname"
                      placeholder="last name"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-md-6">
                    <label for="email">Email address</label>
                    <input
                      type="email"
                      class="form-control"
                      v-model="user.email"
                      id="email"
                      placeholder="Enter email"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="phone">Phone Number</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="user.phone"
                      id="phone"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-md-6">
                    <label for="password">Password</label>
                    <input
                      type="password"
                      disabled
                      class="form-control"
                      id="password"
                      placeholder="(*** unchanged ***)"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="kacepay_id">Kacepay ID</label>
                    <input
                      disabled
                      type="text"
                      v-model="user.kacepay_id"
                      class="form-control"
                      id="kacepay_id"
                      placeholder="kacepay id"
                    />
                  </div>
                </div>
              </div>
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
                    <label for="type">Role</label>
                    <select
                      id="type"
                      v-model="user.type"
                      class="form-control form-control-sm custom-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="author">Author</option>
                    </select>
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
  // mounted() {
  //     //Event.$emit("editUser");
  //     Event.$on("editUser", (user) => {
  //         this.dialog = true
  //         this.user = user
  //     });
  // },
  created() {
    //Event.$emit("editUser");
    Event.$on("editUser", (user) => {
      this.dialog = true;
      this.user = user;
      this.fname = this.user.first_name;
    this.lname = this.user.last_name;
    this.phone = this.user.phone;
    this.role = this.user.type;
    this.email = this.user.email;
    });
  },
  data() {
    return {
        fname: null,
      lname: null,
      phone: null,
      role: null,
      email: null,
      dialog: false,
      user: null,
      loadingx: false,
      bgt:true,
      checkbox:null
    };
  },
  methods: {
      async updateUser() {
      this.loadingx = true;

      try {
        const response = await axios.post(`api/user-update`, {
          id: this.user.id,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          phone: this.user.phone,
          role: this.user.type,
          email: this.user.email 
        });
        console.log("response mounted.", response.data);
        if (response.data === "success") {
          this.loadingx = false;
          this.dialog = false
          this.showAlert(
            "success",
            "Update Successfull!",
            "User profile was successfully updated."
          );
        }
      } catch (error) {
        this.loadingx = false;
        this.showAlert(
          "error",
          "Update Failed!",
          "Sorry, we could not update User. Please try again later."
        );
      }
    },
      checkIfUserIsModified() {
      var us = false;
      if (this.user.phone !== null && !this.user.phone.length) {
        this.user.phone = null;
      }
      if (
        this.fname === this.user.first_name &&
        this.lname === this.user.last_name &&
        this.phone === this.user.phone &&
        this.role === this.user.type &&
        this.email === this.user.email
      ) {
         us = true;
      }
      if (!us) {
        this.updateUser();
        
      }
    },
    checkAddress() {
      if (this.checkbox) {
        this.bgt = false;
      } else {
        this.bgt = true;
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
