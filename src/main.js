import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/main.css';

/**
 * src/main.js
 * ------------------------------------------------------------------
 * Điểm khởi động duy nhất của toàn bộ app. File này CHỈ làm 1 việc:
 * ghép App.vue + router + store lại rồi gắn vào thẻ <div id="app">
 * trong public/index.html. Không viết logic nghiệp vụ ở đây.
 * ------------------------------------------------------------------
 */
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
