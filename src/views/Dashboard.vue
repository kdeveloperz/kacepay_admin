<template>
  <div style="background: #e9ecef" class="">
    <div class="content-header">
      <div class="container-fluid">
        <!-- title and breadcrum row -->
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 fmenu">Dashboard</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb fmenu float-sm-right">
              <li class="breadcrumb-item">
                <a class="kacepay" href="#">Home</a>
              </li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
        <!-- title and breadcrum row -->
        <!-- admin row -->
        <div v-show="currentUser.role" class="row">
          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-info">
              <div class="inner">
                <h3>150</h3>
                <p>New Orders</p>
              </div>
              <div class="icon">
                <i class="fas fa-dolly" large></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-success">
              <div class="inner">
                <h3>53<sup style="font-size: 20px">%</sup></h3>
                <p>Bounce Rate</p>
              </div>
              <div class="icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-warning">
              <div class="inner">
                <h3>44</h3>
                <p>User Registrations</p>
              </div>
              <div class="icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-danger">
              <div class="inner">
                <h3>65</h3>
                <p>Unique Visitors</p>
              </div>
              <div class="icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>
        </div>
        <!-- admin row -->

        <div class="row">
          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-purple"
                ><i class="far fa-envelope"></i
              ></span>
              <div class="info-box-content">
                <span class="info-box-text">Messages</span>
                <span class="info-box-number">1,410</span>
              </div>
            </div>
          </div>

          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-danger"
                ><i class="far fa-flag"></i
              ></span>
              <div class="info-box-content">
                <span class="info-box-text">Bookmarks</span>
                <span class="info-box-number">410</span>
              </div>
            </div>
          </div>

          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-secondary"
                ><i class="far fa-copy"></i
              ></span>
              <div class="info-box-content">
                <span class="info-box-text">Uploads</span>
                <span class="info-box-number">13,648</span>
              </div>
            </div>
          </div>

          <div class="col-md-3 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-blue"
                ><i class="far fa-star"></i
              ></span>
              <div class="info-box-content">
                <span class="info-box-text">Likes</span>
                <span class="info-box-number">93,139</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-warning">
              <div class="inner">
                <h3>
                  {{ getTransactionCount }}<sup style="font-size: 20px"></sup>
                </h3>
                <p>Total Transactions</p>
              </div>
              <div class="icon">
                <i class="fas fa-dolly" large></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-blue">
              <div class="inner">
                <h3>34<sup style="font-size: 20px">%</sup></h3>
                <p>Bounce Rate</p>
              </div>
              <div class="icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-success">
              <div class="inner">
                <h3>₦{{ getFundTotal }}</h3>
                <p>Total Credit</p>
              </div>
              <div class="icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-3 col-6">
            <div class="fmenu small-box bg-danger">
              <div class="inner">
                <h3>₦{{ getDebitTotal }}</h3>
                <p>Total Debit</p>
              </div>
              <div class="icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <a href="#" class="small-box-footer"
                >More info <i class="fas fa-arrow-circle-right"></i
              ></a>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="card-columns">
            <div class="card">
              <div class="fmenu card-body text-center">
                <h4 class="card-text">Customer</h4>
                <h2 class="text-secondary"><i class="fa fa-user fa-2x"></i></h2>
                <p class="card-text">
                  {{ full_name }}<br /><b>KacePay ID:</b
                  >{{ currentUser ? currentUser.kacepay_id : "" }}
                </p>
              </div>
            </div>
            <div class="card">
              <div class="fmenu card-body text-center">
                <h4 class="card-text">Level</h4>
                <h2 class="text-secondary">
                  <i class="fa fa-id-card fa-2x"></i>
                </h2>
                <p class="card-text">
                  Admin User
                  <br />
                  <a class="kacepay" href="#"><b>Upgrade Account</b></a>
                </p>
              </div>
            </div>
            <div class="card">
              <div class="fmenu card-body text-center">
                <h4 class="card-text">E-Wallet</h4>
                <h2 class="text-secondary">
                  <i class="fa fa-wallet fa-2x"></i>
                </h2>
                <p class="card-text">
                  Available Balance <br />
                  <b
                    ><v-icon style="color: black" class="pb-1" small
                      >mdi-currency-ngn</v-icon
                    >{{ currentUser ? currentUser.balance : "" }}</b
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="fmenu col-md-12 col-12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="font-weight-bold">Recent Transactions</span>
                <el-input
                  size="mini"
                  placeholder="Search here..."
                  style="max-width: 200px; float: right; padding: 0 0"
                  prefix-icon="el-icon-search"
                >
                </el-input>
              </div>

              <el-table
                border
                :data="getRecentTransactionsData"
                style="width: 100%; color: "
              >
                <el-table-column
                  fixed
                  prop="sn"
                  label="S/N"
                  width="80"
                  style="color: #ff0000"
                >
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="Description"
                  width="160"
                  class="seccess"
                >
                </el-table-column>
                <el-table-column
                  prop="destination"
                  label="Destination"
                  width="150"
                >
                </el-table-column>
                <el-table-column prop="network" label="Operator" width="120">
                </el-table-column>
                <el-table-column label="Reference ID" width="300">
                  <template slot-scope="scope">
                    {{ scope.row.ref | myDate }}
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="Amount" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="Operations" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"
                      >Detail{{ scope.id }}</el-button
                    >
                    <el-button type="text" size="small">Edit</el-button>
                  </template>
                </el-table-column>
              </el-table></el-card
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: {
    currentUser: Object,
  },
  computed: {
    full_name() {
      var name = "";
      if (this.currentUser) {
        name =
          `${this.currentUser.first_name} ${this.currentUser.last_name}`.toUpperCase();
      }
      return name;
    },
    convertCurrency() {
      return parseFloat(this.currentUser.balance).toFixed(2);
    },
    getTransactionCount() {
      this.getFundingTotal();
      return this.$store.state.transaction_count;
    },
    getFundTotal() {
      this.getFundingTotal();

      return this.$store.state.fund_total;
    },
    getDebitTotal() {
      this.getFundingTotal();
      return this.$store.state.debit_total;
    },
    getRecentTransactionsData() {
      var data = [];
      if (this.currentUser) {
        data = this.getData();
      }
      return data;
    },
  },
  async created() {
    this.$store.dispatch("getTransactions");
  },
  async mounted() {
    // Event.$on(['trans_count'], (data) => {
    //   console.log(data.name);
    //   console.log(data.value);
    //   this.$store.dispatch("updateTransactionCount", data.value);
    //   this.transCount = data.value;
    // });
    // Event.$on(['fund_tot'], (data) => {
    //   console.log(data.name);
    //   console.log(data.value);
    //   this.$store.dispatch("updateFundTotal", data.value);
    //   //this.transCount = data.value;
    // });
  },
  methods: {
    getFundingTotal() {
      var debitTotal = 0;
      var counter = 0;
      var total = 0;
      this.$store.state.transactionList.forEach((element) => {
        ++counter;
        if (element.type === "credit") {
          total = total / 1 + element.amount / 1;
        }
        if (element.type === "debit") {
          debitTotal = debitTotal / 1 + element.amount / 1;
        }
      });

      this.$store.dispatch("updateFundTotal", parseFloat(total.toFixed(2)));
      this.$store.dispatch(
        "updateDebitTotal",
        parseFloat(debitTotal.toFixed(2))
      );
      this.$store.dispatch("updateTransactionCount", counter);
    },
    getData() {
      //this.currentUser = this.$session.get('user')
      const ref = firebase
        .database()
        .ref(`transactions/${this.currentUser.uid}`)
        .limitToFirst(5);
      let userReturn = [];
      var counter = 5;
      ref.once("value", (snapshot) => {
        snapshot.forEach((data) => {
          //  if(dat.key === this.currentUser.uid){

          // dat.forEach(data => {

          --counter;
          var tran = {
            sn: counter + 1,
            description: data.val().description,
            destination: data.val().destination,
            amount: data.val().amount,
            ref: data.val().created_at,
            network: data.val().email,
          };
          userReturn.push(tran);

          // })

          //  }

          //contx.commit('getUsers', userReturn)
        });
        this.tableData = userReturn.reverse();
      });
      return this.tableData;
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
  },
  data() {
    return {
      transCount: null,
      tableData: [],
    };
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