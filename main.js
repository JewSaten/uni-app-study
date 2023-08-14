import App from './App'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import wxShare from 'untils/wxShare.js'

Vue.mixin(wxShare)
Vue.use(uView)
Vue.config.productionTip = false
Vue.prototype.$store = store;
App.mpType = 'app'
if (uni.getSystemInfoSync().platform !== "devtools") {
	console.log = () => {}
}
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

