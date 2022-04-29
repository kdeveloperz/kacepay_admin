<template>
  <v-app>
    <div style="background: #e9ecef" class="">
      <div class="content-header">
        <div class="container-fluid">
          <!-- title and breadcrum row -->
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="fmenu">All Users</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item fmenu">
                  <router-link class="kacepay" to="/dashboard"
                    >Dashboard</router-link
                  >
                </li>
                <li class="breadcrumb-item fmenu active">All users</li>
              </ol>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-sm-12 mt-n6">
              <el-card class="box-card">
                <user-edit-dialog :currentUser="currentUser"></user-edit-dialog>
                <fund-user-wallet :currentUser="currentUser"></fund-user-wallet>
                <div
                  slot="header"
                  element-loading-text="Checking transaction status..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255,255,255,0.8)"
                  v-loading="loadingx"
                  class="clearfix"
                >
                  <span style="font-weight: bold" class="fmenu">All Registered Users</span>
                  
                  <el-input
                    v-model="search"
                    size="small"
                    placeholder="Search here..."
                    style="max-width: 200px; float: right; padding: 0px 0"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
                </div>
                <el-table
                  v-loading="loading"
                  element-loading-text="Loading transactions..."
                  element-loading-background="rgba(255,255,255,0.8)"
                  border
                  height="350"
                  :data="
                    selectedFilter.filter(
                      (data) =>
                        !search || 
                        data.first_name.toLowerCase().includes(search.toLowerCase()) || 
                        data.last_name.toLowerCase().includes(search.toLowerCase()) ||
                        data.email.toLowerCase().includes(search.toLowerCase()) || 
                        data.phone.toLowerCase().includes(search.toLowerCase()) ||
                        data.kacepay_id.toLowerCase().includes(search.toLowerCase()) 
                    )
                  "
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

                  <el-table-column align="center" style="text-transform: capitalize;"  label="Name" width="220">
                    <template slot-scope="scope">
                      {{ capsText(`${scope.row.first_name} ${scope.row.last_name}`) }}
                      {{  }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    sortable
                    align="center"
                    prop="phone"
                    label="Phone"
                    width="150"
                  >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    sortable
                    label="Email"
                    prop="email"
                    width="200"
                  >
                  </el-table-column>

                  <el-table-column
                    align="center"
                    prop="kacepay_id"
                    label="KPay ID"
                    width="120"
                  >
                  </el-table-column>

                  <el-table-column align="center" label="Balance" width="80">
                    <template slot-scope="scope">
                      ₦{{ scope.row.balance }}
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
                        <v-menu
                          rounded="b-xl"
                          left
                          transition="scale-transition"
                          origin="center center"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <el-button
                              v-bind="attrs"
                              v-on="on"
                              type="text"
                              size="small"
                            >
                              <i class="fas fa-edit"> </i> </el-button
                          ></template>
                          <div
                            style="left: inherit; right: 0px; background: white"
                          >
                            <span class="py-2 dropdown-header fmenu bg-primary"
                              >Balance:
                              <strong style="">
                                ₦{{
                                  scope.row.balance === 0
                                    ? "0.00"
                                    : scope.row.balance
                                }}</strong
                              ></span
                            >
                            <div class="dropdown-divider my-0"></div>
                            <a
                              @click="editUserDialog(scope.row)"
                              class="py-2 fmenu dropdown-item"
                            >
                              <i class="fas fa-user-cog mr-2"></i>Update user
                              info
                            </a>
                            <div class="dropdown-divider my-0"></div>
                            <a
                              @click="fundUserDialog(scope.row)"
                              class="py-2 fmenu dropdown-item"
                            >
                              <i class="fas fa-wallet mr-2"></i>Fund user
                              E-Wallet
                            </a>
                            <div class="dropdown-divider my-0"></div>
                            <a href="#" class="py-2 fmenu dropdown-item">
                              <i class="fas fa-comment mr-2"></i> Message user
                            </a>
                            <div class="dropdown-divider my-0"></div>
                            <a
                              style="color: red"
                              href="#"
                              class="py-2 fmenu dropdown-item"
                            >
                              <i class="fas fa-ban mr-2"></i> Block user account
                            </a>
                          </div>
                        </v-menu>
                      </el-tooltip>
                      <el-divider direction="vertical"></el-divider>
                      <el-button type="text" size="small">
                        <i class="fas fa-tasks"> </i>
                      </el-button>
                    </template>
                  </el-table-column> </el-table
              ></el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="Transaction Details"
      style="
        font-family: 'Nunito', sans-serif;
        font-size: 0.9rem;
        line-height: 1.6;
        width: 100%;
      "
      :visible.sync="dT"
    >
      <div class="col-12">
        <p class="lead">
          <strong
            style="
              font-family: 'Nunito', sans-serif;
              font-size: 0.9rem;
              line-height: 1.6;
              font-weight: bold;
              width: 100%;
              color: teal;
            "
          >
            Pin :
            {{
              transaction === null ? "" : transaction.big_description.pincode
            }}</strong
          >
        </p>
        <div class="table-responsive">
          <table class="table">
            <tbody>
              <tr>
                <th class="text-right" style="width: 30%">Meter No :</th>
                <td>
                  {{ transaction === null ? "" : transaction.destination }}
                </td>
              </tr>
              <tr>
                <th class="text-right">Meter Name :</th>
                <td>
                  {{
                    transaction === null
                      ? ""
                      : transaction.big_description.meter_name
                  }}
                </td>
              </tr>
              <tr>
                <th class="text-right">Ref :</th>
                <td>{{ transaction === null ? "" : transaction.ref }}</td>
              </tr>
              <tr>
                <th class="text-right">Credit Token:</th>
                <td style="font-weight: bold; color: black">
                  {{
                    transaction === null
                      ? ""
                      : transaction.big_description.pincode
                  }}
                </td>
              </tr>
              <tr>
                <th class="text-right">Date :</th>
                <td>
                  {{
                    transaction === null
                      ? ""
                      : transaction.created_at | myReceiptDate
                  }}
                </td>
              </tr>
              <tr>
                <th class="text-right">Pin Details:</th>
                <td>{{ transaction === null ? "N/A" : formatCurrency }}</td>
              </tr>
              <tr>
                <th class="text-right">Status :</th>
                <td>
                  {{
                    transaction === null
                      ? "N/A"
                      : transaction.big_description.message
                  }}
                </td>
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
  </v-app>
</template>

<script>
import axios from "axios";
//import firebase from "firebase";
import UserEditDialog from "./UserEditDialog.vue";
import FundUserWallet from "./FundUserWallet.vue";
// import Swal from 'sweetalert2'
export default {
  components: { UserEditDialog, FundUserWallet },
  props: {
    currentUser: Object,
  },
  computed: {
    formatCurrency() {
      return `₦${this.transaction.amount}`;
    },
    selectedFilter() {
      var filT = [];
      if (this.tableData.length) {
       
        
          filT = this.tableData;
        
      }

      return filT;
    },
    
  },
  mounted() {
    Event.$on("taskAdded", () => {
      axios
        .get("api/get_all_users")
        .then((response) => (this.tableData = response.data.users))
        .catch((error) => {
          console.log(error);
        });
    });
  },
  async created() {this.loading = true;
    try {
      //const response = await axios.get("api/get_all_users");
      
      this.tableData = this.getTrans();
      
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  },
  data() {
    return {
      dT: false,
      transaction: null,
      dialog: true,
      loadingx: false,
      loading: false,
      fp: null,
      fc: null,
      FTR: null,
      pendingText: "pending",
      search: "",
      tableData: null,
    };
  },
  methods: {
    capsText(text){
    return text.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });
       
    },
    async getTrans() {
      this.loading = true;
      var dd = [];
      const resBal = await axios.post(`${process.env.VUE_APP_API_URL}firebase`);
      //console.log(resBal.data);
      resBal.data.forEach((element) => {
        dd.push(element);
      });
      this.tableData = dd;
      this.loading = false;
      return this.tableData;
    },
    
    // getUsers() {
    //   this.loading = true;
    //   //let ff = this.$session.get('user')
    //   const ref = firebase.database().ref(`users/`); //.limitToFirst(5);
    //   let userReturn = [];
    //   var dat = {};
    //   ref.once("value", (snapshot) => {
    //     snapshot.forEach((data) => {
    //       //  if(dat.key === this.currentUser.uid){

    //       // dat.forEach(data => {

    //       dat = data.val();

    //       userReturn.push(dat);

    //       // })

    //       //  }

    //       //contx.commit('getUsers', userReturn)
    //     });
    //     console.log("getUsers", userReturn);
    //     this.tableData = userReturn;
    //     this.loading = false;
    //   });
    //   return this.tableData;
    // },
    editUserDialog(user) {
      Event.$emit("editUser", user);
    },
    fundUserDialog(user) {
      //console.log("json : ", user);
      Event.$emit("fundUser", user);
    },
    showReceipt(transaction) {
      try {
        this.transaction = transaction;
        this.dT = true;
      } catch (error) {
        console.log("json Error: ", error);
      }
    },
    filterCompleted() {
      var filT = [];
      this.tableData.forEach((element) => {
        if (element.status === "completed") {
          filT.push(element);
        }
      });
      return filT;
    },
    filterPending() {
      var filT = [];
      this.tableData.forEach((element) => {
        if (element.status === "pending") {
          filT.push(element);
        }
      });
      return filT;
    },
    async checkTransStats(id, ref) {
      this.loadingx = true;
      console.log("to update : ", id);
      try {
        const response = await axios.patch(`api/get_all_users/${id}`, {
          ref: ref,
        });
        //this.re = response.data.transactions;
        Event.$emit("taskAdded");
        console.log("trans updated : ", response.data);
        this.loadingx = false;
        if (response.data.message === "completed") {
          this.$notify({
            title: "Success",
            message: "This Order has been completed successfully.",
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
.fmenu {
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>