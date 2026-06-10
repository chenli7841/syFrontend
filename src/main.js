import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import request from './utils/request.js';
import order from './utils/order.js';
import parcelInfo from './utils/order.js';
import { toast } from './utils/common.js';
import axios from 'axios';
Vue.prototype.$axios = axios;
Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype.request = request;
Vue.prototype.order = order;
Vue.prototype.$toast = toast;
Vue.prototype.$parcelInfo = parcelInfo;
App.mpType = 'app'
//谷歌地图
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAlx_o5RTm4wEEgnxe8v3s_9T7KOEj3C4k',
        libraries: '3.26',
    },
})
const app = new Vue({
    ...App
})
app.$mount()
