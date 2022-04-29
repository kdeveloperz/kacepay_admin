<template>
  <v-app style="background: #e9ecef">
    <div class="">
      <div class="content-header">
        <div class="container-fluid">
          <!-- title and breadcrum row -->
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="fmenu">Transactions History</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item fmenu "><router-link class="kacepay" to="/dashboard">Dashboard</router-link></li>
                <li class="breadcrumb-item fmenu active">My Transactions</li>
              </ol>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-sm-12">
              <el-card shadow="hover" class="box-card fmenu">
                <div
                  slot="header"
                  element-loading-text="Checking transaction status..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255,255,255,0.8)"
                  v-loading="loadingx"
                  class="clearfix"
                >
                  <span class="">Filter Transactions </span>
                  <el-checkbox
                    v-model="fc"
                    @change="ddetc($event)"
                    label="Filter completed"
                    border
                    size="mini"
                  ></el-checkbox>
                  <el-checkbox
                    v-model="fp"
                    @change="dde($event)"
                    label="Filter pending"
                    border
                    type="danger"
                    size="mini"
                  ></el-checkbox>
                  <el-input
                    v-model="search"
                    size="small"
                    placeholder="Search here..."
                    style="max-width: 200px; float: right; padding: 3px 0"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
                </div>
                <el-table class="fmenu"
                  v-loading="loading" element-loading-spinner="el-icon-loading"
                  element-loading-text="Loading transactions..."
                  element-loading-background="rgba(255,255,255,0.8)"
                  border height="350" fit
                  :data="selectedFilter.filter((data) =>
                        !search || data.destination.toLowerCase().includes(search.toLowerCase())
                        || data.description.toLowerCase().includes(search.toLowerCase())
                        
                        )"
                  style="width: 100%; color: "
                >
                  <el-table-column
                    label="S/N"
                    width="50"
                    style="color: #ff0000"
                  >
                    <template slot-scope="scope">
                      {{ ++scope.$index }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    label="Description"
                    width="220"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description }}
                      <el-button @click="showReceipt(scope.row)"
                        plain
                        type="primary"
                        icon="el-icon-view"
                        v-show="scope.row.big_description !== 'N/A'"
                        size="small"
                        >View Receipt</el-button
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="destination"
                    label="Destination"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    sortable
                    label="Status"
                    prop="service"
                    width="120"
                  >
                    
                  </el-table-column>
                  <el-table-column
                    sortable
                    align="center"
                    label="Date"
                    width="200"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.created_at | myDate }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Amount" width="80">
                    <template slot-scope="scope">
                      ₦{{ scope.row.amount }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="Balance" width="120">
                    <template slot-scope="scope">
                      ₦{{ scope.row.bal_after }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    fixed="right"
                    align="center"
                    label="Operations"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <el-tooltip
                        content="Order Status"
                        placement="left"
                        effect="light"
                      >
                        <el-button
                          type="text"
                          size="small"
                          @click="checkTransStats(scope.row.id, scope.row.ref)"
                        >
                          <v-icon small style="color: green"
                            >mdi-briefcase-clock</v-icon
                          ></el-button
                        ></el-tooltip
                      >
                      <el-divider direction="vertical"></el-divider>
                      <el-tooltip
                        content="Manage transaction"
                        placement="left"
                        effect="light"
                      >
                        <el-button type="text" size="small"
                          ><v-icon small style="color: orange"
                            >mdi-briefcase-edit</v-icon
                          >
                        </el-button></el-tooltip
                      >
                    </template>
                  </el-table-column>
                </el-table></el-card
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="Transaction Details" style="font-family: 'Nunito', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          width: 100%;" :visible.sync="dT">
      <div class="col-12">
        <p class="lead"><strong style="font-family: 'Nunito', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6; font-weight: bold;
          width: 100%; color:teal"> Pin : {{ transaction === null ? "" : transaction.big_description.pincode }}</strong></p>
        <div class="table-responsive">
          <table  class="table">
            <tbody>
              <tr>
                <th class="text-right" style="width: 30%">Meter No :</th>
                <td>{{ transaction === null ? "" : transaction.destination }}</td>
              </tr>
              <tr>
                <th class="text-right">Meter Name :</th>
                <td>{{ transaction === null ? "" : transaction.big_description.meter_name }}</td>
              </tr>
              <tr>
                <th class="text-right">Ref :</th>
                <td>{{ transaction === null ? "" : transaction.ref }}</td>
              </tr>
              <tr>
                <th class="text-right">Credit Token:</th>
                <td style="font-weight: bold; color:black">{{ transaction === null ? "" : transaction.big_description.pincode }}</td>
              </tr>
              <tr>
                <th class="text-right">Date :</th>
                <td>{{ transaction === null ? "" : transaction. created_at | myReceiptDate }}</td>
              </tr>
              <tr>
                <th class="text-right">Pin Details:</th>
                <td>{{ transaction === null ? "N/A" : formatCurrency }}</td>
              </tr>
              <tr>
                <th class="text-right">Status :</th>
                <td>{{ transaction === null ? "N/A" : transaction.big_description.message}}</td>
              </tr>
            </tbody>
            
          </table>
        <p
          style="
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            line-height: 1.6;
          "
          class="text-right font-weight-medium blue-grey--text text-center"
        >
          Thank you for choosing KacePay. If you need any further assistance,
          please do write to us at support@kacepay.tech
        </p>
        </div>
      </div>
    </el-dialog>
    <v-btn @click="getFundingTotal()">get fun</v-btn>
  </v-app>
</template>

<script>
import axios from 'axios';
//import firebase from "firebase";
// import Swal from 'sweetalert2'
export default {
    props: {
    currentUser: Object,
  },
  computed: {
    formatCurrency(){
      return `₦${this.transaction.amount}`
    },
    getRecentTransactionsData(){
      var data = []
      if(this.currentUser){
        data = this.getData()
      }
      return data
    },
    selectedFilter() {
      var filT = [];
      if (this.tableData.length) {
       
        
          filT = this.tableData;
        
      }

      return filT;
    },
    //checkStats()
  },
  //
  // async created() {
  //   this.loadingx = true;
  //   try {
  //     //const response = await axios.get(`api/transaction/${this.currentUser.email}`);
  //     this.tableData = this.getData()
  //     this.loadingx = false;
  //   } catch (error) {
  //     console.log(error);
  //     this.loadingx = true;
  //   }
  // },
  async mounted() {
    
    try {
      //const response = await axios.get(`api/transaction/${this.currentUser.email}`);
      this.tableData = this.getData()
      this.loadingx = false;
    } catch (error) {
      console.log(error);
      this.loadingx = false;
    }
  },
  data() {
    return {
      dT: false,
      transaction:null,
      
      loadingx: false,
      loading: false,
      fp: null,
      fc: null,
      FTR: null,
      pendingText: "pending",
      search: "",
      tableData: [
        {
        "amount": 50,
        "bal_after": 42181.22,
        "bal_before": 42231.22,
        "created_at": 1650888280446,
        "description": "MTN VTU 50",
        "destination": "07037735888",
        "email": "vankace@gmail.com",
        "name": "Vankace",
        "network": 15,
        "reference": "kpwd1010197c979",
        "service": "airtime",
        "status": "pending",
        "type": "debit",
        "uid": "9QnkG07GFYXelWSnCHQ9VmfNI5r2"
    }
      ],
      
    };
  },
  methods: {

     async getData(){
       this.loadingx = true;
       //get_user_transactions
       var dd = []
       let ff = this.$session.get('user')
      const resBal = await axios.post(`${process.env.VUE_APP_API_URL}get_transactions/${ff.uid}`);
      //console.log(resBal.data);
      var dat = {}
      resBal.data.forEach(element => {
        
        if(element.time) {
              dat = {
              name: "nill",
              email: "nill",
              status: "nill",
              type: "debit",
              created_at: element.time,
              uid: this.currentUser.uid,
              service: element.type,
              amount: element.amount,
              network: element.network,
              reference: element.reference,
              destination: element.phone,
              bal_before: "nill",
              bal_after: "nill",
              description: `${element.network} ${element.amount}`,
              }
              
            }else{
              dat = element
            }
            dd.push(dat)
      });
      this.tableData = dd.reverse();
      this.loadingx = false;
      return this.tableData

    },
    showReceipt(transaction){
      try {
        
      this.transaction = transaction
      this.dT = true
      } catch (error) {
        console.log("json Error: ",error)
      }
      
    },
    
    async checkTransStats(id, ref) {
      this.loadingx = true;
      console.log("to update : ", id);
      try {
        const response = await axios.patch(`api/transaction/${id}`, {
          ref: ref,
        });
        //this.re = response.data.transactions;
        Event.$emit("taskAdded");
        console.log("trans updated : ", response.data);
        this.loadingx = false;
        if (response.data.message === "completed" || response.data.message === "refunded" || response.data.message === "in progress") {
          this.$notify({
            title: "Success",
            message: `This Order is ${response.data.message}.`,
            type: "success",
          });
        } else {
          this.$notify({
            title: "Error",
            message:
              "This Order could not be verified bacause it was not placed from this platform.",
            type: "error",
          });
        }
      } catch (error) {
        console.log("could not update : ", error);
        this.loadingx = false;
      }
    },

    dde(event) {
      if (this.fp) {
        this.FTR = "pending";
        this.fc = false;
        console.log(event);
      } else {
        this.FTR = "";
      }
    },
    ddetc(event) {
      if (this.fc) {
        this.FTR = "completed";
        this.fp = false;
        console.log(event);
      } else {
        this.FTR = "";
      }
    },
    showLoader(text = "'loading...") {
      this.loader = this.$loading({
        lock: true,
        text: text,
        spinner: "el-icon-loading",
        background: "rgba(255,255,255,0.99)",
      });
    },
    hideLoader() {
      this.loader.close();
    },
    showDataWindow() {
      alert("what the fuck");
    },
  },
};
</script>
<style >
.el-table thead {
  color: #212529;
  font-weight: 500;
}
.el-table {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: #212529;
}
</style>