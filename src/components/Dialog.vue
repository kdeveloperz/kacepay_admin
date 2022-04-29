<template>
  <v-dialog persistent v-model="dialog" max-width="600">
    <template v-slot:default>
      <v-card>
        <v-toolbar color="warning" dark>{{ user.fname }} {{ user.lname }}</v-toolbar>
        <v-card-text>
          <v-form class="ma-3">
            <v-layout row>
              <v-text-field
              label="First Name"
              :value="user.fname"
              prepend-icon="mdi-account"
            ></v-text-field>
            <v-text-field
              label="Last Name"
              :value="user.lname"
              prepend-icon="mdi-account-supervisor"
            ></v-text-field>
            </v-layout>
            
            <v-layout row>
              <v-text-field 
            label="Kacepay ID"
            :value="user.kpid"
            readonly filled
            rounded
            prepend-icon="mdi-alpha-k-box-outline"
            dense
          ></v-text-field>
              <v-text-field readonly
              label="Email Address"
              :value="user.email"
              prepend-icon="mdi-email-check"
            ></v-text-field>
            
            
            </v-layout>
            <v-layout row>
              <v-text-field readonly
              label="Phone Number"
              :value="user.phone"
              prepend-icon="mdi-cellphone-basic"
            ></v-text-field>
            
             <v-text-field 
            label="Account Balance"
            :value="user.bal"
            filled readonly
            rounded
            prepend-icon="mdi-cash-multiple"
            dense
          ></v-text-field>
            </v-layout>
            <v-layout row>
              
            <v-text-field
            
            label="UID"
            filled disabled
            rounded
            :value="user.uid"
            readonly
          ></v-text-field>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeD">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  //props: ['dialog', 'kid', 'uid', 'fname', 'lname', 'email', 'bal'],
  props: {
  // fname: String,
  // lname: String,
  // email: String,
  // uid: String,
  // kid: String,
  // phone: String,
  // bal: Number,
  dialog: Boolean,
  user: Object // or any other constructor
},
  data() {
    return {
      
    };
  },
  methods: {
    closeD() {
      this.$emit("clD");
    },
  },
};
</script>

<style>
</style>