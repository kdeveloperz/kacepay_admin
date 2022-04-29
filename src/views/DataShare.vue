<template>
  <v-app style="background: #e9ecef">
    <div class="">
      <div class="content-header">
        <div class="container-fluid">
          <!-- title and breadcrum row -->
          <div class="row mb-0">
            <div class="col-sm-6">
              <h1 class="m-0 fmenu">{{dataOption}} Datashare</h1>
                
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item fmenu">
                  <router-link class="kacepay" to="/dashboard"
                    >Dashboard</router-link
                  >
                </li>
                <li class="breadcrumb-item fmenu active">{{dataOption}} Datashare</li>
              </ol>
            </div>
          </div>
          <div class="mt-n3">
            <el-radio-group class="fmenu" :text-color="isAIRTEL ? '#ffffff' : '#000000'" :fill="isAIRTEL ? '#ff0000' : '#FDD835'" @change="selectOption" v-model="dataOption">
              <el-radio-button  label="MTN"></el-radio-button>
              <el-radio-button label="AIRTEL"></el-radio-button>
            </el-radio-group>
          </div>
          <transition name="el-zoom-in-top">
            <mtn-data-share :currentUser="currentUser" v-show="isMTN" v-if="isMTN" />
          </transition>
          <transition name="el-zoom-in-center">
          <airtel-data-share :currentUser="currentUser" v-show="isAIRTEL" v-if="isAIRTEL" />
          </transition>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import MTNData from "../components/MTNData.vue";
import AIRTELData from "../components/AirtelData.vue";
export default {
  props: {
    currentUser: Object,
  },
  components: {
    "mtn-data-share": MTNData,
    "airtel-data-share": AIRTELData,
  },
  methods: {
    selectOption() {
      if (this.dataOption === "MTN") {
        this.isAIRTEL = false;
        setTimeout(() => {
          this.isMTN = true;
        }, 500);
      }
      if (this.dataOption === "AIRTEL") {
        this.isMTN = false;
        setTimeout(() => {
          this.isAIRTEL = true;
        }, 500);
      }
      console.log(" option : ", this.dataOption);
    },
  },
  data() {
    return {
      dataOption: "MTN",
      isMTN: true,
      isAIRTEL: false,
    };
  },
};
</script>

