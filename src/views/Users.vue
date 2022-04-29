<template>
  <div class="users ma-4">
    <h1 class="caption grey--text" @click="alert = !alert">Users</h1>
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
        color="success"
        v-model="snackbar"
        ><v-icon class="success--text"> mdi-account-check </v-icon>
        Transaction successful... your account has been successfully funded.

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
    <!-- <v-btn @click="show = !show">call users</v-btn> -->
    
      <v-layout row wrap>
      <v-flex offset-8 xs6 sm4 md6>
        <v-spacer></v-spacer>
    <v-alert
    v-model="alert"
  border="left"
  dismissible
  elevation="11"
  outlined transition="scroll-x-reverse-transition"
  type="success"
  class="caption"
>
      You've got <strong>5</strong> new updates on your timeline!.
    </v-alert>
      </v-flex>
    </v-layout>
    <v-container class="my-5">
      
      <!-- <v-slide-y-transition>
        <v-btn v-if="show">vannnnnnnnn</v-btn>
      </v-slide-y-transition> -->
      <Dialog :user="obj" :dialog="dialog" @clD="dialog = false" />
      <v-layout row wrap class="mb-3 mx-3">
        <v-flex xs12 md12>
          <v-progress-linear v-if="!Users.length"
            color="deep-orange"
            indeterminate
            rounded
            height="6"
            
          ></v-progress-linear>
          <p v-if="!Users.length" class="text-center headline">Loading Users please wait...</p>
          <v-card flat v-if="Users.length">
            <v-card-title>
              All Users
             
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
              ></v-text-field>
            </v-card-title>
            <v-slide-y-transition>
            <v-data-table
              app
              :headers="headers"
              :items="Users"
              :search="search"
              :items-per-page="5"
            >
              <template v-slot:item.active="{ item }">
                <v-simple-checkbox
                  :ripple="false"
                  v-model="item.kid"
                  selected
                  color="success"
                ></v-simple-checkbox>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2 deep-orange--text" @click="popUserDialog(item)">
                  mdi-account-alert
                </v-icon>
                <UserListMenu :user="item"  @showAlert="showTimedAlert" @notifyFundSuccess="fundSuccess" />
              </template>
            </v-data-table>
            </v-slide-y-transition>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import Dialog from "../components/Dialog.vue";
import UserListMenu from "../components/UserListMenu.vue";
export default {
  components: {
    Dialog,
    UserListMenu
  },
  created() {
    if (!this.Users.length) {
      console.log("we run...");
      this.$store.dispatch("getUsers");
    } else {
      console.log("no runing...");
    }
  },
  computed: {
    Users() {
      return this.$store.state.users;
    },
  },
  data() {
    return {
      snackbar: false,
      alert: false,
      show: true,
      dialog: false,
      obj: {},
      kid: '',
      user: "",
      search: "",
      headers: [
        {
          text: "Full Names",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Email Address", value: "email", align: "start" },
        { text: "Kacepay ID", value: "kpid" },
        { text: "Phone", value: "phone" },
        { text: "Balance", value: "bal" },
        { text: "Actions", value: "actions", sortable: false },
        { text: "Active", value: "active", sortable: false },
      ],
    };
  },
  methods: {
    showTimedAlert(){
      this.alert = true
      setTimeout(() => {
        this.alert = false
      }, 4000);
    },
    fundSuccess(){
      this.snackbar = true
    },
    popUserDialog(userItem){
      this.obj = userItem
      this.dialog = true

    },
    loginUser() {
      firebase
        .auth()
        .signInWithEmailAndPassword("vankace@gmail.com", "kacemasu")
        .then((data) => {
          //this.$router.replace({ name: "Dashboard" });
          this.user = data.user.uid;
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    callUsers() {
      const ref = firebase.database().ref("/users/");
      let userReturn = [];
      ref.once("value", (snapshot) => {
        snapshot.forEach((data) => {
          var user = {
            name: `${data.val().first_name} ${data.val().last_name}`,
            email: data.val().email,
            kpid: data.val().kacepay_id,
            phone: data.val().phone,
            bal: `₦ ${data.val().balance}`,
          };
          userReturn.push(user);
        });
        this.users = userReturn;
        console.log("last treturn  : " + userReturn[3]);
      });
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
  },
};
</script>
<style>
</style>