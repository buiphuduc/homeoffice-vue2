import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/main.css';
import RevealDirective from './utils/revealDirective';

/**
 * src/main.js
 * ------------------------------------------------------------------
 * Điểm khởi động duy nhất của toàn bộ app. File này CHỈ làm 1 việc:
 * ghép App.vue + router + store lại rồi gắn vào thẻ <div id="app">
 * trong public/index.html. Không viết logic nghiệp vụ ở đây.
 * ------------------------------------------------------------------
 */
Vue.config.productionTip = false;
Vue.config.devtools = true
Vue.use(RevealDirective);

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// Wait for products only in the build browser; normal mounting is unchanged.
if (window.__SEO_PRERENDER__) {
  (async () => {
    await new Promise((resolve, reject) => router.onReady(resolve, reject));
    if (!store.state.products.loaded) await new Promise((resolve) => {
      const stop = app.$watch(() => store.state.products.loaded, (loaded) => {
        if (loaded) { stop(); resolve(); }
      });
    });
    await Vue.nextTick();
    const { createPrerenderBridge } = await import('./utils/prerender');
    window.__SEO_RENDER__ = createPrerenderBridge(app, router, store);
  })();
}
