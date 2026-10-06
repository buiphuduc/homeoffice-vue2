import Vue from 'vue';
import articles from '@/content/inspirationArticles';
import legalPages from '@/content/legalPages';
import config from '@/config';
import { listingPath } from './listingRoutes';
import { productMatchesCategoryPath } from './category';

// Render the actual Vue components so SEO content has one source of truth.
export function createPrerenderBridge(app, router, store) {
  const products = store.getters['products/all'];
  if (store.state.products.error) throw new Error(store.state.products.error);
  if (!products.length) throw new Error('Không có sản phẩm Published=Yes để dựng SEO.');
  const ids = new Set();
  products.forEach((product) => {
    if (!product.sku || ids.has(product.id)) throw new Error(`SKU thiếu hoặc trùng: ${product.id}`);
    ids.add(product.id);
  });
  const paths = ['/', '/gioi-thieu', '/lien-he', '/cam-hung-sang-tao'];
  const categories = new Map([['', []]]);
  products.forEach((product) => {
    paths.push(`/san-pham/${encodeURIComponent(product.id)}`);
    product.categoryPaths.forEach((parts) => parts.forEach((_, index) => {
      const prefix = parts.slice(0, index + 1);
      categories.set(JSON.stringify(prefix), prefix);
    }));
  });
  categories.forEach((parts) => {
    const count = products.filter((product) => productMatchesCategoryPath(product, parts)).length;
    for (let page = 1; page <= Math.ceil(count / config.listing.pageSize); page += 1) paths.push(listingPath(parts, page));
  });
  articles.forEach(({ slug }) => paths.push(`/cam-hung-sang-tao/${encodeURIComponent(slug)}`));
  legalPages.forEach(({ slug }) => paths.push(`/chinh-sach/${encodeURIComponent(slug)}`));
  return {
    paths: [...new Set(paths)],
    siteUrl: config.siteUrl,
    async navigate(path) {
      if (router.currentRoute.fullPath !== path) await router.push(path);
      await Vue.nextTick();
      const view = app.$children[0].$children.find((child) => child.$vnode && child.$vnode.data.routerView);
      if (view && view.updateSeo) view.updateSeo(view.product);
      await Vue.nextTick();
      window.scrollTo(0, 0);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (path === '/' && view && !view.booted) await new Promise((resolve) => {
        const stop = view.$watch('booted', (ready) => { if (ready) { stop(); resolve(); } });
      });
      return router.currentRoute.fullPath;
    },
  };
}
