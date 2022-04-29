<template>
  <v-container>
    <div >
      <v-card translate="yes" class="mx-auto " flat py-6 max-width="430px">
        <!-- <v-card-title class="mb-2 mx-2 text-h5 font-weight-bold d-flex justify-center"><v-img max-height="100" max-width="100" src="../assets/kacepaylogoo.png"></v-img></v-card-title> -->
        <v-card-title class=" mx-2 text-h5 font-weight-bold d-flex justify-center"> Create an account </v-card-title>
        
        <v-card-text>
          <v-form class="mx-4">
            <div class="mx-2 d-flex align-center">
              <v-divider class="mr-4" />With your<v-divider class="ml-4" />
            </div>
            <div class="mx-2 my-4 d-flex justify-center">
              <v-btn class="mx-2 pa-6" outlined color="deep-purple lighten-4">
          <v-img max-height="30" max-width="30" src="../assets/gg.png"></v-img>
        </v-btn>
        <v-btn class="mx-2 pa-6"  elevation="0"  color="blue darken-2">
          <v-icon color="white">mdi-facebook</v-icon>
        </v-btn>
        <v-btn class="mx-2 pa-6"    color="black lighten-3">
         <v-icon color="white">mdi-github</v-icon>
        </v-btn>
            </div>
              <div class="mx-2 my-4 d-flex align-center">
              <v-divider class="mr-4" />Or<v-divider class="ml-4" />
            </div>
            <v-layout column class="mx-2 py-2">
              <!-- <v-text-field
                v-model="user.userEmail"
                color="deep-orange"
                label="Email"
                outlined
              ></v-text-field> -->
              <el-input  class="py-2 mt-n2"  label="Frist Name" placeholder="Frist Name" v-model="user.first_name"></el-input>
              <el-input  class="py-2 mt-n2"  label="Last Name" placeholder="Last Name" v-model="user.last_name"></el-input>              
              <el-input  class="py-2 mt-n2"  label="Email" placeholder="Email" v-model="user.userEmail"></el-input>              
            </v-layout>
            <v-layout column class="mx-2 mb-0 "> <el-input  class="py-2 mt-n2"  label="Phone Number" placeholder="Phone Number" v-model="user.userEmail"></el-input>
              
            <el-input class="py-2"
            type="password"
            size="x-large" 
            label="Password" 
            placeholder="Password"
            show-password="true"
            v-model="user.userPassword">
            </el-input>
            <v-btn
                :loading="loading3"
                :disabled="loading3"
                color="deep-orange darken-1"
                class="py-5 white--text caption text-capitalize"
                @click="loginUser"
              >
                Login
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
              
      <v-btn large   link to="/login" text
        class="mr-2 my-2  fmenu d-flex align-center font-weight-medium  text-lowercase">Already have an account?
        
      </v-btn>
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
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {},
  beforeCreate() {
    var uss = firebase.auth().currentUser;
    console.log(" BeforeCreate Login VUE fired!!! : " + uss);
    if (uss) {
      console.log("User " + uss);
      this.user = uss.uid;
      this.$store.dispatch("getUser");
      this.$router.push("/");
    }
  },
  mounted() {
    var uss = this.$store.state.user;
    console.log(" Mounted Login VUE fired!!! : " + uss);
    if (uss) {
      console.log("User " + uss);
      this.user = uss.uid;
      this.$store.dispatch("getUser");
      this.$router.push("/");
    }
  },
  data() {
    return {
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
    chkU() {
      var us = this.$store.state.user;
      if (us) {
        console.log("Store User : " + us.email);
      } else {
        console.log("Store User : signed out");
      }
      this.snackbar = true;
    },
    loginUser() {
      this.ERROR = false;
      if (this.user.userEmail === "" || this.user.userEmail === null) {
        this.text = "All fields requred!!";
        this.ERROR = true;
        return;
      }
      this.loading3 = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.userEmail, this.user.userPassword)
        .then((data) => {
          //this.$router.replace({ name: "Dashboard" });
          this.user = data.user;
          if (this.user.email === "kace@kace.com") {
            sessionStorage.setItem("loggedUserEmail", this.user.email);
            sessionStorage.setItem("loggedUserId", this.user.uid);
            this.text = "Login Successful!";
            this.snackbar = true;
            this.$store.dispatch("getUser");
            this.$router.push("/");
            this.loading3 = false;
          } else {
            this.ERROR = true;
            this.text = "Please login with Admin credentials";
            this.snackbar = true;
            this.loading3 = false;
            this.logOut();
            this.user = {
              userEmail: "",
              userPassword: "",
            };
          }
        })
        .catch((err) => {
          this.text = "Incorrect username/password";
          console.log(err)
          this.loading3 = false;
        });
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
  min-height: 50px;
  font-family: 'Nunito', sans-serif;
}
.v-input {
  align-items: flex-start;
  display: flex;
  flex: 1 1 auto;
  font-size: 12px;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
}
.theme--light.v-label {
    color: rgb(0 0 0 / 38%);
}
.v-label {
    font-size: 14px;
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