import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase";
import axios from 'axios';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fund_total: 0,
    debit_total: 0,
    DSTV_PLANS:[],
    GOTV_PLANS:[],
    STARTIMES_PLANS:[],
    user: null,
    users: [],
    transactionList: [],
    gift_data: [
      { value: "Gift 500MB", size: 500, amount: 150 },
      { value: "Gift 1GB", size: 1000, amount: 260 },
      { value: "Gift 2GB", size: 2000, amount: 520 },
      { value: "Gift 3GB", size: 3000, amount: 780 },
      { value: "Gift 4GB", size: 4000, amount: 1040 },
      { value: "Gift 5GB", size: 5000, amount: 1300 },
      { value: "Gift 10GB", size: 10000, amount: 2600 },
    ],
    sme_data: [
      { value: "SME 500MB", size: 500, amount: 160 },
      { value: "SME 1GB", size: 1000, amount: 270 },
      { value: "SME 2GB", size: 2000, amount: 540 },
      { value: "SME 3GB", size: 3000, amount: 810 },
      { value: "SME 4GB", size: 4000, amount: 1080 },
      { value: "SME 5GB", size: 5000, amount: 1350 },
      { value: "SME 10GB", size: 10000, amount: 2700 },
    ],
    airtel_data_share: [
      { value: "500MB", size: 500, amount: 230 },
      { value: "1GB", size: 1000, amount: 455 },
      { value: "2GB", size: 2000, amount: 910 },
      { value: "5GB", size: 5000, amount: 2275 },
      { value: "10GB", size: 10000, amount: 4550 },
    ],
    
    beneficiaries_airtime: [
      {name: "Vankace MTN", phone: "07037735888", network:"MTN"},
      {name: "Vankace AIRTEL", phone: "09019606999", network:"AIRTEL"},
      {name: "Marvis MTN", phone: "08147899001", network:"MTN"}
    ],
    beneficiaries_cable_tv: [
      {name: "Vankace DSTV", iuc: "2028835301", operator:"DSTV"},
      {name: "Vankace STARTIMES", iuc: "02724448061", operator:"STARTIMES"},
      {name: "Kufre GOTV", iuc: "2028835301", operator:"GOTV"}
    ],
    discos:null,
    mtn_data:null,
    airtel_data:null,
    glo_data:null,
    nmobile_data:null, 
  },
  mutations: {
    
    UPDATE_TRANS_COUNT: (state, data) => {
      
      state.transaction_count = data
    },
    getTransactions: (state, transactions) => {
      state.transactionList = transactions
    },
    getUsers: (state, users) => {
      state.users = users
    },
    GET_USER: (state, user) => {
      state.user = user
    },
    SIGN_OUT: (state, user) => {
      state.user = user
    },
    ADD_MTN: (state, data) => {
      
      state.mtn_data = data
    },
    ADD_AIRTEL: (state, data) => {
      
      state.airtel_data = data
    },
    ADD_GLO: (state, data) => {
      
      state.glo_data = data
    },
    ADD_NMOBILE: (state, data) => {
      
      state.nmobile_data = data
    },
    ADD_BENEFICIARIES_AIRTIME: (state, beneficiaries) => {
      
      state.beneficiaries_airtime = beneficiaries
    },
    ADD_BENEFICIARIES_CABLE_TV: (state, beneficiaries) => {
      
      state.beneficiaries_cable_tv = beneficiaries
    },
    CREATE_DSTV_PACKAGES: (state, packages) => {
      
      state.DSTV_PLANS = packages
    },
    CREATE_GOTV_PACKAGES: (state, packages) => {
      
      state.GOTV_PLANS = packages
    },
    CREATE_STARTIMES_PACKAGES: (state, packages) => {
      
      state.STARTIMES_PLANS = packages
    },
    ADD_DISCOS: (state, discos) => {
      
      state.discos = discos
    },
    UPDATE_FUND_TOTAL: (state, data) => {

      state.fund_total = data
    },
    UPDATE_DEBIT_TOTAL: (state, data) => {

      state.debit_total = data
    },
    
  },
  actions: {
    updateTransactionCount(contx, data){
      
      contx.commit('UPDATE_TRANS_COUNT', data)
    },
    updateFundTotal(contx, data){
      contx.commit('UPDATE_FUND_TOTAL', data)
    },
    updateDebitTotal(contx, data){
      contx.commit('UPDATE_DEBIT_TOTAL', data)
    },
    addDataBundle: (contx, data) => {
      var bene = null
      if (data.code === "mtn") {
        data.products.forEach(element => {
          element.value = element.data
        });
        bene = data.products
        contx.commit('ADD_MTN', bene)
      }
      if (data.code === "airtel") {
        data.products.forEach(element => {
          element.value = element.data
        });
        bene = data.products
        contx.commit('ADD_AIRTEL', bene)
      }
      if (data.code === "glo") {
        data.products.forEach(element => {
          element.value = element.data
        });
        bene = data.products
        contx.commit('ADD_GLO', bene)
      }
      if (data.code === "nmobile") {
        data.products.forEach(element => {
          element.value = element.data
        });
        bene = data.products
        contx.commit('ADD_NMOBILE', bene)
      }
     },
     addDiscos: (contx, discos) => {
      var bene = discos
      
      contx.commit('ADD_DISCOS', bene)
     
    },
    addBeneficiary_airtime: (contx, beneficiary) => {
      var bene = contx.state.beneficiaries_airtime
      bene.push(beneficiary)
      
      contx.commit('ADD_BENEFICIARIES_AIRTIME', bene)
     
    },
    addBeneficiary_cable_tv: (contx, beneficiary) => {
      var bene = contx.state.beneficiaries_cable_tv
      bene.push(beneficiary)
      
      contx.commit('ADD_BENEFICIARIES_CABLE_TV', bene)
     
    },
    getTransactions: async (contx) => {
      contx.dispatch('getUser')
      const resBal = await axios.post(`http://localhost:8000/api/get_transactions/${contx.state.user.uid}`);
      //console.log(resBal.data);
      var dd= []
      var dat = {}
      resBal.data.forEach(element => {
        
        if(element.time) {
              dat = {
              name: "nill",
              email: "nill",
              status: "nill",
              type: element.type === "ACCOUNT_FUNDING"? "credit" :"debit",
              created_at: element.time,
              uid: contx.state.user.uid,
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
          contx.commit('getTransactions', dd.reverse());
     
     


    },

    getUser: contx => {
      var user = null
      if(Vue.prototype.$session.exists()){
        user = Vue.prototype.$session.get('user') 
        console.log('session exixts');
      }
      contx.commit('GET_USER', user)
     
    },
    signOutUser: contx => {
      const user =  null
      
      if(Vue.prototype.$session.exists()){
        Vue.prototype.$session.clear()
        Vue.prototype.$session.destroy()
      }
      
      console.log("user session Data Cleared from store")
       contx.commit('SIGN_OUT', user)
      
     },
    getUsers: contx => {
      const ref = firebase.database().ref("/users/");
      let userReturn = [];
      ref.once("value", (snapshot) => {
        snapshot.forEach((data) => {
          
          var user = {
            fname: data.val().first_name,
            lname: data.val().last_name,
            uid: data.val().uid,
            name: `${data.val().first_name} ${data.val().last_name}`,
            email: data.val().email,
            kpid: data.val().kacepay_id,
            phone: data.val().phone,
            bal: `₦ ${data.val().balance}`,
            originalBalance: data.val().balance
          }
          userReturn.push(user);
          contx.commit('getUsers', userReturn)
        });
      });
    },
    createCableTV_Plans: contx => {
      var dstv_plans = ["DStv Compact (N7900)",
        "DStv Compact Asian Add-on (N6200)",
        "DStv Compact French 11 Bouquet E36 (N3260)",
        "DStv Compact French Plus (N8100)",
        "DStv Compact French Touch (N2300)",
        "DStv Compact HDPVR/XtraView (N2500)",
        "DStv Compact Plus (N12400)",
        "DStv Compact Plus Asian Add-on (N6200)",
        "DStv Compact Plus HDPVR/XtraView (N2500)",
        "DStv Compact Plus French 11 Bouquet E36 (N3260)",
        "DStv Compact Plus French Plus (N8100)",
        "DStv Compact Plus French Touch (N2300)",
        "DStv Premium (N18400)",
        "DStv Compact Premium Asian Add-on (N6200)",
        "DStv Compact Premium French 11 Bouquet E36 (N3260)",
        "DStv Compact Premium French Plus (N8100)",
        "DStv Compact Premium French Touch (N2300)",
        "DStv Compact Premium HDPVR/XtraView (N2500)",
        "Asian Bouquet (N6200)",
        "Asian Bouquet French 11 Bouquet E36 (N3260)",
        "Asian Bouquet French Plus (N8100)",
        "Asian Bouquet French Touch (N2300)",
        "Asian Bouquet HDPVR/XtraView (N2500)",
        "DStv Yanga Bouquet E36 (N2565)",
        "DStv Yanga Bouquet Asian Add-on (N6200)",
        "DStv Yanga Bouquet French 11 Bouquet E36 (N3260)",
        "DStv Yanga Bouquet French Plus (N8100)",
        "DStv Yanga Bouquet French Touch (N2300)",
        "DStv Yanga Bouquet HDPVR/XtraView (N2500)",
        "DStv Confam Bouquet E36 (N4615)",
        "DStv Confam Bouquet Asian Add-on (N6200)",
        "DStv Confam Bouquet French 11 Bouquet E36 (N3260)",
        "DStv Confam Bouquet French Plus (N8100)",
        "DStv Confam Bouquet French Touch (N2300)",
        "DStv Confam Bouquet HDPVR/XtraView (N2500)",
        "Padi Bouquet (N1850)",
        "Padi Bouquet Asian Add-on (N6200)",
        "Padi Bouquet French 11 Bouquet E36 (N3260)",
        "Padi Bouquet French Plus (N8100)",
        "Padi Bouquet French Touch (N2300)",
        "Padi Bouquet HDPVR/XtraView (N2500)",
        "DStv Premium French (N25550)",
        "DStv Premium French HDPVR/XtraView (N2500)"
]
var dstv_amounts = [7900.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        12400.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        18400.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        2565.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        4615.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        1850.0, 6200.0, 3260.0, 8100.0, 2300.0, 2500.0,
        25550.0, 2500.0
]
var startimes_plans = [
        "Startimes Nova - 1 Day (N90)",
        "Startimes Basic - 1 Day (N160)",
        "Startimes Smart - 1 Day (N200)",
        "Startimes Classic - 1 Day (N320)",
        "Startimes Super - 1 Day (N400)",
        "Startimes Nova - 1 Week (N300)",
        "Startimes Basic - 1 Week (N600)",
        "Startimes Smart - 1 Week (N700)",
        "Startimes Classic - 1 Week (N1200)",
        "Startimes Super - 1 Week (N1500)",
        "Startimes Nova - 1 Month (N900)",
        "Startimes Basic - 1 Month (N1700)",
        "Startimes Smart - 1 Month (N2200)",
        "Startimes Classic - 1 Month (N2500)",
        "Startimes Super - 1 Month (N4200)"

]
var gotv_plans = ["GOtv Smallie - Monthly (N800)",
        "GOtv Smallie - Quarterly (N2100)",
        "GOtv Smallie - Yearly (N6200)",
        "GOtv Max (N3600)",
        "GOtv Jinja Bouquet (N1640)",
        "GOtv Jolli Bouquet (N2460)"
]
var gotv_amounts = [800.00, 2100.00, 6200.00, 3600.00, 1640.00, 2400.00]
var startimes_amounts = [90.0, 160.0, 200.0, 320.0, 400.0, 300.0, 600.0,
        700.0, 1200.0, 1500.0, 900.0, 1700.0, 2200.0, 2500.0, 4200.0]
var dstv=[]
var gotv=[]
var startimes=[]
// for (let index = 0; index < dstv_plans.length; index++) {
//   const element ={packageName: dstv_plans[index], subAmount: dstv_amounts[index] } 
  
// }

dstv_plans.forEach((element,index) => {
  const item ={packageName: element, subAmount: dstv_amounts[index] }
  dstv.push(item)
  
});
gotv_plans.forEach((element,index) => {
  const item ={packageName: element, subAmount: gotv_amounts[index] }
  gotv.push(item)
  
});
startimes_plans.forEach((element,index) => {
  const item ={packageName: element, subAmount: startimes_amounts[index] }
  startimes.push(item)
  
});
contx.commit('CREATE_STARTIMES_PACKAGES', startimes)
contx.commit('CREATE_DSTV_PACKAGES', dstv)
contx.commit('CREATE_GOTV_PACKAGES', gotv)
console.log("DSTV : ",dstv)
console.log("GOTV : ",gotv)
console.log("STARTIMES : ",startimes)
    }

  },
  modules: {
  }
})
