<template>
  <div class="legal-view" v-if="page">
    <main class="container">
      <router-link :to="{ name: 'home' }" class="back-link">
        <i class="fa-solid fa-arrow-left"></i> Trang chủ
      </router-link>

      <header class="legal-header">
        <h1>{{ page.title }}</h1>
        <p class="updated-at">{{ page.updatedAt }}</p>
      </header>

      <section v-for="(sec, i) in page.sections" :key="i" class="legal-section">
        <h2>{{ sec.heading }}</h2>
        <p>{{ sec.body }}</p>
      </section>

      <nav class="legal-nav">
        <span>Xem thêm:</span>
        <router-link
          v-for="p in otherPages"
          :key="p.slug"
          :to="{ name: 'legal-page', params: { slug: p.slug } }"
        >{{ p.title }}</router-link>
      </nav>
    </main>
  </div>
  <div class="legal-view legal-not-found" v-else>
    <main class="container">
      <p>Không tìm thấy trang này.</p>
      <router-link :to="{ name: 'home' }" class="btn btn-primary">Về trang chủ</router-link>
    </main>
  </div>
</template>

<script>
import legalPages from '@/content/legalPages';
import { setPageMeta } from '@/utils/seo';

/**
 * src/views/LegalPageView.vue
 * ------------------------------------------------------------------
 * Trang pháp lý (Chính sách đổi trả / bảo mật / Điều khoản sử dụng) —
 * route /chinh-sach/:slug. Nội dung lấy từ src/content/legalPages.js,
 * không hard-code trong component. Có điều hướng nhanh sang 2 trang
 * pháp lý còn lại ở cuối trang.
 * ------------------------------------------------------------------
 */
export default {
  name: 'LegalPageView',
  props: { slug: { type: String, required: true } },
  computed: {
    page() {
      return legalPages.find((p) => p.slug === this.slug) || null;
    },
    otherPages() {
      return legalPages.filter((p) => p.slug !== this.slug);
    },
  },
  watch: {
    slug: {
      immediate: true,
      handler() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.page) {
          setPageMeta({
            title: this.page.title,
            description: `${this.page.title} của HTMVN Shop.`,
            path: this.$route.fullPath,
          });
        }
      },
    },
  },
};
</script>

<style scoped>
.legal-view {
  --primary: #715b3e;
  --surface: #fdf9f2;
  --on-surface: #1c1c17;
  --on-surface-variant: #4d453c;
  --surface-container: #f2ede6;
  background: var(--surface);
  color: var(--on-surface);
  font-family: 'Inter', sans-serif;
  padding-bottom: 80px;
}
.container { max-width: 760px; margin: 0 auto; padding: 48px 20px; }

.back-link {
  display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600;
  color: var(--on-surface-variant); text-decoration: none; margin-bottom: 32px;
}
.back-link:hover { color: var(--primary); }

.legal-header { margin-bottom: 36px; border-bottom: 1px solid rgba(139,115,85,.2); padding-bottom: 20px; }
.legal-header h1 { font-size: 30px; font-weight: 500; margin: 0 0 8px; }
.updated-at { font-size: 12.5px; color: var(--on-surface-variant); margin: 0; }

.legal-section { margin-bottom: 28px; }
.legal-section h2 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.legal-section p { font-size: 15px; line-height: 1.75; color: var(--on-surface-variant); margin: 0; }

.legal-nav {
  display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 13px;
  margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(139,115,85,.2);
  color: var(--on-surface-variant);
}
.legal-nav a { color: var(--primary); text-decoration: underline; }

.legal-not-found { text-align: center; padding: 100px 20px; }
.legal-not-found .btn { display: inline-block; margin-top: 16px; padding: 10px 24px; border-radius: 8px; background: var(--primary); color: #fff; text-decoration: none; }
</style>
