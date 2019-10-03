import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'

Vue.config.productionTip = false


const instance = axios.create({
  baseURL: "https://4u31f8kq2i.execute-api.us-east-1.amazonaws.com/dev"
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

export default instance