<template>
  <div class="transaction-details ma-4">
    <h1 class="caption grey--text">Transactions Details of  {{ username }}</h1>
    <v-layout row class="mb-0 mx-3">
       

      
      </v-layout>
    <v-container class="my-5 mx-3">
      <v-flex xs12 md12 >
         <v-progress-linear v-if="!users.length"
            color="deep-orange"
            indeterminate
            rounded
            height="6"
            
          ></v-progress-linear>
          <p v-if="!users.length" class="text-center headline">Loading Please wait...</p>
          <v-card flat v-if="users.length">
            <v-card-title >
              
               <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
        <v-btn small plain color="grey" @click="filter('electricity')"  v-bind="attrs"
          v-on="on">
          <v-icon left small>mdi-folder</v-icon>
          <span class="caption text-lowercase">by Electricity bills</span>
        </v-btn>
        </template>
        <span>Filter by Electricity bills</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
        <v-btn small plain color="grey" @click="filter('recharge')" v-bind="attrs"
          v-on="on">
          <v-icon left small>mdi-account</v-icon>
          <span class="caption text-lowercase">by mobile recharge</span>
        </v-btn>
        </template>
        <span>Filter by Airtime/Data </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
        <v-btn small plain color="grey" @click="filterToday()" v-bind="attrs"
          v-on="on">
          <v-icon left small>mdi-calender</v-icon>
          <span class="caption text-lowercase">by Today</span>
        </v-btn>
        </template>
        <span>Filter Today </span>
      </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table 
              v-model="selected"
              item-key="reference"
              app
              :headers="headers"
              :items="users"
              :search="search"
              :items-per-page="5"
            >
           
            <template v-slot:top>
              
            </template>

            </v-data-table>
          </v-card>
        </v-flex>
    </v-container>
    
  </div>
</template>
<script>
import firebase from "firebase";
export default {
    props: ['id'],
    data() {
        return {
            search: '',
            selected: [],
            username: '',
            users: [],
            headers: [
                {text: "s/n", value: "sn"},
                {
                text: "Transaction Type",
                align: "start",
                sortable: false,
                value: "type",
                },
                { text: "Network", value: "network", align: "start" },
                { text: "Reference", value: "reference" },
                { text: "Phone", value: "phone" },
                { text: "Amount", value: "amount" },
                { text: "Date", value: "time" }
                
            ],
        }
    },
    methods: {
        filter(p) {
      this.search = p
    },
    filterToday(){
         this.search = this.todaysDate()
    },
    todaysDate(){
            var date = new Date();
            var year=date.getFullYear();
            var month=date.getMonth()+1 //getMonth is zero based;
            var day=date.getDate();
            var formatted=day+"-"+month+"-"+year;
            return formatted;
            },
        formDate(dd){
            var date = new Date(dd);
            var year=date.getFullYear();
            var month=date.getMonth()+1 //getMonth is zero based;
            var day=date.getDate();
            var formatted=day+"-"+month+"-"+year;
            return formatted;
            },
    getUserName(userid){
      const refUser = firebase.database().ref("/users/"+userid);
      refUser.on('value', (snapshot) => {
     const userName = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      //console.log(" from inside "+userName)
      this.username = userName
    })
    },
        oga() {
            const ref = firebase.database().ref("/transaction/"+this.id).orderByKey().limitToLast(5);
            let userReturn = []; //0110364620
            var counter = 0
            ref.once("value", (snapshot) => {
                snapshot.forEach((data) => {
                counter++
                var transaction = {
                    sn: counter,
                    type: data.val().type,
                    network: data.val().network,
                    reference: data.val().reference,
                    phone: data.val().phone,
                    amount: "₦" +data.val().amount,
                    time: this.formDate(data.val().time)
                }
                
                
                userReturn.push(transaction);
                
                
                })
            })
            
            this.users = userReturn

            
        }
    },
    created() {
        this.getUserName(this.id)
        this.oga()
        this.todaysDate()
    }
}
</script>