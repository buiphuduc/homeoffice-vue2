<template>
  <div class="article-view" v-if="article">
    <main class="container">
      <!-- Breadcrumb quay lại danh sách -->
      <router-link :to="{ name: 'inspiration' }" class="back-link">
        <span class="material-symbols-outlined back-icon">arrow_back</span> Cảm hứng sáng tạo
      </router-link>

      <header class="article-header">
        <span class="tag text-primary">{{ article.tag }}</span>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span>{{ shopName }}</span>
          <span class="dot">•</span>
          <span>{{ article.readTime }}</span>
        </div>
      </header>

      <div class="article-cover">
        <img
          v-show="!imgBroken.cover"
          :src="article.cover"
          :alt="article.coverAlt"
          @error="imgErr('cover')"
        />
        <div class="img-fallback" v-if="imgBroken.cover">
          <span class="material-symbols-outlined">image</span>
        </div>
      </div>

      <div class="article-body">
        <p class="article-intro">{{ article.intro }}</p>

        <section v-for="(sec, i) in article.sections" :key="i" class="article-section">
          <h2>{{ sec.heading }}</h2>
          <p>{{ sec.body }}</p>
          <div class="section-image" v-if="sec.image">
            <img
              v-show="!imgBroken['sec' + i]"
              :src="sec.image"
              :alt="sec.imageAlt"
              @error="imgErr('sec' + i)"
            />
            <div class="img-fallback" v-if="imgBroken['sec' + i]">
              <span class="material-symbols-outlined">image</span>
            </div>
          </div>
        </section>

        <!-- CTA cuối bài — luôn dẫn tới sản phẩm/danh mục thật -->
        <div class="article-cta">
          <p>Thích phong cách này? Khám phá các sản phẩm liên quan tại {{ shopName }}.</p>
          <router-link :to="ctaTarget" class="btn btn-primary">
            {{ article.cta.label }} <span class="material-symbols-outlined ml-icon">arrow_forward</span>
          </router-link>
        </div>
      </div>

      <!-- Bài viết khác -->
      <section class="related-section" v-if="relatedArticles.length">
        <h3>Bài viết khác</h3>
        <div class="related-grid">
          <router-link
            v-for="rel in relatedArticles"
            :key="rel.slug"
            :to="{ name: 'inspiration-article', params: { slug: rel.slug } }"
            class="related-card"
          >
            <div class="related-thumb">
              <img
                v-show="!imgBroken['rel-' + rel.slug]"
                :src="rel.cover"
                :alt="rel.coverAlt"
                @error="imgErr('rel-' + rel.slug)"
              />
              <div class="img-fallback" v-if="imgBroken['rel-' + rel.slug]">
                <span class="material-symbols-outlined">image</span>
              </div>
            </div>
            <div>
              <span class="tag text-variant">{{ rel.tag }}</span>
              <h4>{{ rel.title }}</h4>
            </div>
          </router-link>
        </div>
      </section>
    </main>
  </div>
  <div class="article-view article-not-found" v-else>
    <main class="container">
      <p>Không tìm thấy bài viết này.</p>
      <router-link :to="{ name: 'inspiration' }" class="btn btn-primary">Quay lại Cảm hứng sáng tạo</router-link>
    </main>
  </div>
</template>

<script>
import config from '@/config';
import articles from '@/content/inspirationArticles';
import { categoryLink } from '@/utils/category';
import { setPageMeta } from '@/utils/seo';

/**
 * src/views/InspirationArticleView.vue
 * ------------------------------------------------------------------
 * Trang chi tiết 1 bài "Cảm hứng sáng tạo" — route /cam-hung-sang-tao/:slug.
 * Nội dung lấy từ src/content/inspirationArticles.js (không hard-code
 * ở đây), CSS tự thiết kế riêng cho trang này (không dùng lại CSS của
 * InspirationView.vue vì đây là component/route mới, không sửa file
 * cũ), nhưng theo đúng tông màu/typography Scandinavian đã dùng xuyên
 * suốt site (Hanken Grotesk + Inter, tông kem/nâu ấm).
 * ------------------------------------------------------------------
 */
export default {
  name: 'InspirationArticleView',
  props: { slug: { type: String, required: true } },
  data() {
    return {
      shopName: config.shopName,
      imgBroken: {},
    };
  },
  computed: {
    article() {
      return articles.find((a) => a.slug === this.slug) || null;
    },
    ctaTarget() {
      const { cta } = this.article;
      if (cta.type === 'category') return categoryLink(cta.path);
      if (cta.type === 'search') return { name: 'listing', query: { q: cta.query } };
      return cta.to;
    },
    relatedArticles() {
      if (!this.article) return [];
      return articles.filter((a) => a.slug !== this.article.slug).slice(0, 3);
    },
  },
  watch: {
    // Người dùng bấm từ bài viết này sang bài viết khác (router-link
    // đổi params.slug) -> Vue tái dùng lại component, cần reset lỗi ảnh
    // + cuộn lên đầu trang thủ công.
    slug() {
      this.imgBroken = {};
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.updateSeo();
    },
  },
  created() {
    this.updateSeo();
  },
  methods: {
    imgErr(key) {
      this.$set(this.imgBroken, key, true);
    },
    // Tiêu đề/mô tả/ảnh SEO theo đúng bài viết đang xem.
    updateSeo() {
      if (!this.article) return;
      setPageMeta({
        title: this.article.title,
        description: this.article.excerpt,
        image: `${config.siteUrl}${this.article.cover}`,
        path: this.$route.fullPath,
      });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600&family=Inter:wght@400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

.article-view {
  --primary: #715b3e;
  --surface: #fdf9f2;
  --on-surface: #1c1c17;
  --on-surface-variant: #4d453c;
  --surface-container: #f2ede6;
  --surface-container-high: #ece8e1;
  --outline-variant: #d1c4b9;
  --font-heading: 'Hanken Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  background-color: var(--surface);
  color: var(--on-surface);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  padding-bottom: 80px;
}

.container { max-width: 900px; margin: 0 auto; padding: 48px 20px; }
@media (min-width: 768px) { .container { padding: 64px 24px; } }

.tag { font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; display: block; }
.text-primary { color: var(--primary); }
.text-variant { color: var(--on-surface-variant); }

.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--on-surface-variant);
  text-decoration: none; margin-bottom: 32px; transition: color .3s;
}
.back-link:hover { color: var(--primary); }
.back-icon { font-size: 18px; }

.article-header { margin-bottom: 32px; }
.article-title {
  font-family: var(--font-heading); font-weight: 400; letter-spacing: -0.01em;
  font-size: 32px; line-height: 1.25; margin: 10px 0 14px;
}
@media (min-width: 768px) { .article-title { font-size: 44px; } }
.article-meta { font-size: 13px; color: var(--on-surface-variant); display: flex; gap: 8px; align-items: center; font-weight: 600; }

.article-cover {
  position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 12px;
  overflow: hidden; background: var(--surface-container-high); margin-bottom: 40px;
}
.article-cover img { width: 100%; height: 100%; object-fit: cover; }

.img-fallback {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--surface-container-high), var(--surface-container));
}
.img-fallback .material-symbols-outlined { font-size: 40px; color: var(--outline-variant); }

.article-body { max-width: 720px; margin: 0 auto; }
.article-intro { font-size: 19px; line-height: 1.7; color: var(--on-surface); margin-bottom: 40px; font-weight: 400; }

.article-section { margin-bottom: 40px; }
.article-section h2 { font-family: var(--font-heading); font-size: 24px; font-weight: 500; margin-bottom: 12px; }
.article-section p { font-size: 16px; line-height: 1.75; color: var(--on-surface-variant); margin-bottom: 20px; }
.section-image {
  position: relative; width: 100%; aspect-ratio: 4/3; border-radius: 10px;
  overflow: hidden; background: var(--surface-container-high);
}
.section-image img { width: 100%; height: 100%; object-fit: cover; }

.article-cta {
  margin-top: 48px; padding: 32px; border-radius: 12px; background: var(--surface-container);
  text-align: center;
}
.article-cta p { margin-bottom: 18px; font-size: 15px; color: var(--on-surface-variant); }
.article-cta .btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 12px 28px; border-radius: 8px;
  background: var(--primary); color: #fff; text-decoration: none; font-size: 14px; font-weight: 600;
  transition: opacity .2s;
}
.article-cta .btn:hover { opacity: .88; }
.ml-icon { font-size: 16px; }

.related-section { max-width: 720px; margin: 64px auto 0; }
.related-section h3 { font-family: var(--font-heading); font-size: 20px; font-weight: 500; margin-bottom: 20px; }
.related-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 640px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
.related-card { display: block; text-decoration: none; color: inherit; }
.related-thumb {
  position: relative; width: 100%; aspect-ratio: 4/3; border-radius: 10px; overflow: hidden;
  background: var(--surface-container-high); margin-bottom: 10px;
}
.related-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.related-card:hover .related-thumb img { transform: scale(1.05); }
.related-card h4 { font-size: 15px; font-weight: 500; margin-top: 4px; line-height: 1.4; }

.article-not-found { text-align: center; padding: 100px 20px; }
.article-not-found .btn { display: inline-block; margin-top: 16px; padding: 10px 24px; border-radius: 8px; background: var(--primary); color: #fff; text-decoration: none; }
</style>
