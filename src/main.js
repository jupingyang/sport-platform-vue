import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faPersonBiking, faAddressBook, faLock, faPersonSwimming, faCartShopping, faBook, faFire, faBowlRice, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// 導入axios
import axios from 'axios';
// import axios from 'axios'
// // 掛載axios
// Vue.prototype.$http = axios
// // 設置訪問根路徑
// axios.defaults.baseURL = "http://localhost:9000"

library.add(faUser, faPersonBiking, faAddressBook, faLock, faPersonSwimming, faCartShopping, faBook, faFire, faBowlRice, faAngleRight)

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.component("FontAwesomeIcon", FontAwesomeIcon)
app.mount('#app')
app.config.globalProperties.$axios = axios;