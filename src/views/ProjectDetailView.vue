<template>
  <div class="project-detail" v-if="project" :style="{ '--hh': headerH + 'px' }">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/">Trang chủ</router-link> ›
      <router-link to="/du-an">Dự án</router-link> ›
      <span>{{ project.name }}</span>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="pj-hero">
      <span class="pj-pill">{{ pillText }}</span>
      <h1 class="pj-title">{{ project.title }}</h1>
      <div class="pj-hero-btns">
        <button type="button" class="pj-btn pj-btn-line" v-if="totalImages" @click="scrollToSpace(spaces[0] && spaces[0].key)">
          <i class="fa-solid fa-images"></i> Xem {{ totalImages }} ảnh dự án
        </button>
        <button type="button" class="pj-btn pj-btn-fill" @click="scrollToId('bao-gia-du-an')">Nhận báo giá</button>
      </div>
      <figure class="pj-hero-fig">
        <div class="pj-hero-img">
          <safe-image :sources="[project.cover]" :alt="project.coverAlt || project.name">
            <i class="fa-solid fa-house-chimney"></i>
          </safe-image>
        </div>
        <figcaption v-if="project.coverCaption">{{ project.coverCaption }}</figcaption>
      </figure>
    </section>

    <!-- ===== THÔNG SỐ NHANH ===== -->
    <dl class="pj-specs" v-if="facts.length">
      <div v-for="f in facts" :key="f.label">
        <dt>{{ f.label }}</dt>
        <dd>{{ f.value }}</dd>
      </div>
    </dl>

    <!-- ===== CÂU CHUYỆN DỰ ÁN ===== -->
    <section class="pj-story" v-if="project.story && project.story.length">
      <div class="pj-story-head">
        <p class="pj-label">Câu chuyện dự án</p>
        <h2 class="pj-story-title" v-if="project.storyTitle">{{ project.storyTitle }}</h2>
      </div>
      <div class="pj-story-body">
        <p v-for="(para, i) in project.story" :key="'st' + i">{{ para }}</p>
      </div>
      <div class="pj-story-img" v-if="project.storyImage">
        <safe-image :sources="[project.storyImage]" :alt="'Không gian ' + project.name"></safe-image>
      </div>
    </section>

    <!-- ===== THANH LỌC KHÔNG GIAN (dính khi cuộn) ===== -->
    <div class="pj-sticky" v-if="spaces.length" :style="{ top: headerH + 'px' }" role="navigation" aria-label="Không gian trong dự án">
      <div class="pj-chips">
        <button type="button" class="pj-chip" :class="{ on: !activeKey }" @click="scrollToSpace(spaces[0].key)">
          Tất cả <b>{{ totalImages }}</b>
        </button>
        <button
          v-for="s in spaces"
          :key="'chip-' + s.key"
          type="button"
          class="pj-chip"
          :class="{ on: activeKey === s.key }"
          :aria-current="activeKey === s.key ? 'true' : null"
          @click="scrollToSpace(s.key)"
        >{{ s.label }} <b>{{ s.count }}</b></button>
      </div>
    </div>

    <!-- ===== CÁC PHẦN ẢNH THEO KHÔNG GIAN ===== -->
    <div class="pj-spaces" v-if="spaces.length">
      <template v-for="(s, i) in spaces">
        <section :key="'sec-' + s.key" :id="s.key" class="pj-space">
          <header class="pj-space-head">
            <div>
              <p class="pj-space-index">{{ pad(s.index) }} / {{ pad(s.total) }}</p>
              <h2 class="pj-space-title">{{ s.label }}</h2>
            </div>
            <p class="pj-space-sub">{{ spaceSub(s) }}</p>
          </header>
          <!-- Bấm 1 ảnh -> ảnh đó lên vị trí đầu tiên (như trang chi tiết sản phẩm) -->
          <project-space-gallery :images="s.images" :layout="s.layout" :offset="headerH + 70"></project-space-gallery>
        </section>
        <project-cta
          v-if="i === 1 && spaces.length >= 3"
          :key="'cta-mid'"
          variant="strip"
          :title="'Thích phong cách thiết kế của ' + project.name + '?'"
          text="Nhắn cho HTM diện tích và nhu cầu của gia đình để được tư vấn giải pháp nội thất phù hợp."
        ></project-cta>
      </template>
    </div>

    <!-- ===== THÔNG TIN DỰ ÁN ===== -->
    <section class="pj-info" v-if="infoRows.length">
      <div class="pj-info-main">
        <span class="pj-pill">Bảng dữ liệu công trình</span>
        <h2 class="pj-h2">Thông tin dự án trong một trang</h2>
        <dl class="pj-table">
          <div v-for="r in infoRows" :key="r.label">
            <dt>{{ r.label }}</dt>
            <dd>{{ r.value }}</dd>
          </div>
          <div class="pj-table-quote">
            <dt>Ngân sách dự kiến</dt>
            <dd>
              <button type="button" class="pj-btn pj-btn-line pj-btn-sm" @click="scrollToId('bao-gia-du-an')">
                Nhận báo giá theo diện tích nhà bạn
              </button>
            </dd>
          </div>
        </dl>
      </div>
      <figure class="pj-plan" v-if="project.planImage">
        <div class="pj-plan-img">
          <safe-image :sources="[project.planImage]" :alt="project.planCaption || project.name">
            <i class="fa-solid fa-drafting-compass"></i>
          </safe-image>
        </div>
        <figcaption v-if="project.planCaption">{{ project.planCaption }}</figcaption>
      </figure>
    </section>

    <!-- ===== SẢN PHẨM ĐÃ DÙNG TRONG DỰ ÁN ===== -->
    <section class="pj-products" v-if="usedProducts.length">
      <div class="pj-products-head">
        <div>
          <span class="pj-pill">Bộ sưu tập nội thất</span>
          <h2 class="pj-h2">Sản phẩm trong dự án {{ project.name }}</h2>
        </div>
        <p class="pj-products-note">Sản xuất tại xưởng HTM bằng máy móc tự động hóa, chuẩn xác từng milimet.</p>
      </div>
      <div class="pj-products-grid">
        <article v-for="p in usedProducts" :key="p.id" class="pj-prod">
          <router-link :to="{ name: 'product-detail', params: { id: p.id } }" class="pj-prod-img" :aria-label="p.name">
            <safe-image :sources="p.images" :alt="p.name"><i class="fa-solid fa-couch"></i></safe-image>
          </router-link>
          <p class="pj-prod-cat">{{ productCategory(p) }}</p>
          <h3 class="pj-prod-name">{{ p.name }}</h3>
          <p class="pj-prod-price">{{ formatVND(p.effectivePrice) }}</p>
          <router-link :to="{ name: 'product-detail', params: { id: p.id } }" class="pj-btn pj-btn-line pj-btn-block">Xem chi tiết</router-link>
        </article>
      </div>
    </section>

    <!-- ===== CTA LỚN ===== -->
    <div id="bao-gia-du-an" class="pj-anchor">
      <project-cta
        variant="block"
        label="Đồng hành cùng HTM"
        :title="'Bạn muốn một không gian tiện nghi như ' + project.name + '?'"
      ></project-cta>
    </div>

    <!-- ===== DỰ ÁN TƯƠNG TỰ ===== -->
    <section class="pj-related" v-if="related.length">
      <div class="pj-related-head">
        <h2 class="pj-h2">Dự án tương tự của HTM</h2>
        <router-link class="pj-related-all" to="/du-an">Tất cả dự án <i class="fa-solid fa-arrow-right"></i></router-link>
      </div>
      <div class="pj-related-grid">
        <project-card v-for="p in related" :key="p.slug" :project="p" variant="related"></project-card>
      </div>
    </section>

    <!-- ===== LIÊN KẾT NHANH ===== -->
    <nav class="pj-quick" aria-label="Liên kết nhanh">
      <router-link to="/danh-muc"><span><small>Sản phẩm</small><b>Nội thất ván công nghiệp</b></span><i class="fa-solid fa-arrow-right"></i></router-link>
      <router-link to="/cam-hung-sang-tao"><span><small>Cảm hứng</small><b>Cảm hứng sáng tạo</b></span><i class="fa-solid fa-arrow-right"></i></router-link>
      <router-link to="/gioi-thieu"><span><small>Về chúng tôi</small><b>HTM Design &amp; Build</b></span><i class="fa-solid fa-arrow-right"></i></router-link>
      <router-link to="/lien-he"><span><small>Liên hệ</small><b>Nhận báo giá</b></span><i class="fa-solid fa-arrow-right"></i></router-link>
    </nav>
  </div>

  <div v-else>
    <empty-state icon="fa-solid fa-house-chimney" text="Không tìm thấy dự án này.">
      <router-link to="/du-an" class="btn btn-outline">Xem tất cả dự án</router-link>
    </empty-state>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SafeImage from '@/components/common/SafeImage.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import ProjectCta from '@/components/project/ProjectCta.vue';
import ProjectSpaceGallery from '@/components/project/ProjectSpaceGallery.vue';
import config from '@/config';
import { setPageMeta } from '@/utils/seo';
import { formatVND } from '@/utils/format';
import {
  getProjectBySlug, getSpaceList, getRelatedProjects, countImages,
} from '@/utils/projects';

/**
 * Trang chi tiết dự án (/du-an/:slug) — bố cục theo mẫu screen2:
 * hero -> thanh thông số -> câu chuyện -> thanh lọc không gian (dính) ->
 * các phần ảnh (feature / grid / split) -> dải CTA -> bảng thông tin ->
 * sản phẩm trong dự án -> CTA lớn -> dự án tương tự -> liên kết nhanh.
 * Dữ liệu: src/content/projects.js.
 */
export default {
  name: 'ProjectDetailView',
  components: {
    SafeImage, EmptyState, ProjectCard, ProjectCta, ProjectSpaceGallery,
  },
  props: {
    slug: { type: String, required: true },
  },
  data() {
    return {
      headerH: 100, // chiều cao header dính, đo thật khi chạy
      activeKey: '',
      ticking: false,
    };
  },
  computed: {
    ...mapGetters('products', ['all']),
    project() { return getProjectBySlug(this.slug); },
    spaces() { return this.project ? getSpaceList(this.project) : []; },
    totalImages() { return this.project ? countImages(this.project) : 0; },
    related() { return this.project ? getRelatedProjects(this.project, 3) : []; },
    pillText() {
      const p = this.project;
      return [p.name, [p.type, p.location].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
    },
    facts() {
      const p = this.project;
      if (!p) return [];
      return [
        { label: 'Diện tích', value: p.area ? `${p.area} m²` : '' },
        { label: 'Loại hình', value: p.type },
        { label: 'Hoàn thành', value: p.year ? String(p.year) : '' },
        { label: 'Phong cách', value: p.style },
        { label: 'Địa điểm', value: p.location },
      ].filter((f) => f.value);
    },
    infoRows() {
      const p = this.project;
      if (!p) return [];
      return [
        { label: 'Tên dự án', value: p.name },
        { label: 'Địa điểm', value: p.location },
        { label: 'Loại hình', value: p.type },
        { label: 'Hạng mục', value: p.scope },
        { label: 'Đơn vị thực hiện', value: 'HTM Design & Build' },
        { label: 'Năm thực hiện', value: p.year ? String(p.year) : '' },
        { label: 'Phong cách', value: p.style },
        { label: 'Diện tích', value: p.area ? `${p.area} m²` : '' },
        { label: 'Vật liệu', value: p.materials },
      ].filter((r) => r.value);
    },
    usedProducts() {
      if (!this.project || !this.project.skus || !this.project.skus.length) return [];
      return this.project.skus
        .map((sku) => this.all.find((p) => p.sku === sku))
        .filter(Boolean);
    },
  },
  watch: {
    slug: {
      immediate: true,
      handler() {
        this.applyMeta();
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
        this.activeKey = '';
      },
    },
  },
  mounted() {
    this.measureHeader();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.measureHeader);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.measureHeader);
  },
  methods: {
    formatVND,
    pad(n) { return String(n).padStart(2, '0'); },
    spaceSub(s) {
      return [`${s.count} ảnh`, s.mood, s.tone].filter(Boolean).join(' · ');
    },
    productCategory(p) {
      const path = p.categoryPaths && p.categoryPaths[0];
      return path && path.length ? path[path.length - 1] : '';
    },
    applyMeta() {
      if (!this.project) return;
      setPageMeta({
        title: this.project.title,
        description: this.project.seoDescription,
        image: this.project.cover ? `${config.siteUrl}${this.project.cover}` : undefined,
        path: `/du-an/${this.project.slug}`,
      });
    },
    measureHeader() {
      const h = document.querySelector('header.site-header');
      if (h) this.headerH = Math.round(h.getBoundingClientRect().height);
    },
    smooth() {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return reduce ? 'auto' : 'smooth';
    },
    scrollToId(id) {
      const el = document.getElementById(id);
      if (!el) return;
      // trừ chiều cao header dính + thanh chip
      const top = el.getBoundingClientRect().top + window.scrollY - this.headerH - 70;
      window.scrollTo({ top, behavior: this.smooth() });
    },
    scrollToSpace(key) {
      if (key) this.scrollToId(key);
    },
    onScroll() {
      if (this.ticking) return;
      this.ticking = true;
      window.requestAnimationFrame(() => {
        this.ticking = false;
        const line = this.headerH + 100;
        let current = '';
        this.spaces.forEach((s) => {
          const el = document.getElementById(s.key);
          if (el && el.getBoundingClientRect().top <= line) current = s.key;
        });
        if (current !== this.activeKey) this.activeKey = current;
      });
    },
  },
};
</script>

<style scoped>
.project-detail { padding-bottom: 24px; }

/* chung */
.pj-pill {
  display: inline-block; padding: 6px 14px; border-radius: 999px; background: #ece8e1; color: var(--primary);
  font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
}
.pj-label { margin: 0 0 12px; font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--primary); }
.pj-h2 { margin: 14px 0 0; font-size: 30px; font-weight: 400; letter-spacing: -.01em; color: var(--ink); line-height: 1.25; }
.pj-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 24px;
  border-radius: 6px; font-size: 14px; font-weight: 500; border: 1.5px solid transparent; cursor: pointer;
  transition: background .2s, color .2s, border-color .2s;
}
.pj-btn-fill { background: var(--primary); color: #fff; }
.pj-btn-fill:hover { background: var(--primary-dark); }
.pj-btn-line { background: #fff; color: var(--ink); border-color: var(--line); }
.pj-btn-line:hover { border-color: var(--primary); color: var(--primary); }
.pj-btn-sm { padding: 9px 16px; font-size: 13px; }
.pj-btn-block { width: 100%; padding: 11px 16px; font-size: 13px; }
.pj-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* hero */
.pj-hero { padding: 10px 0 0; }
.pj-title { margin: 18px 0 22px; max-width: 880px; font-size: 32px; line-height: 1.2; font-weight: 400; letter-spacing: -.01em; color: var(--ink); }
.pj-hero-btns { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.pj-hero-fig { margin: 0; }
.pj-hero-img {
  aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; background: var(--primary-light);
  border: 1px solid var(--line); display: flex; align-items: center; justify-content: center;
}
.pj-hero-img img { width: 100%; height: 100%; object-fit: cover; }
.pj-hero-img i { font-size: 56px; color: #d8d1c5; }
.pj-hero-fig figcaption { margin-top: 10px; font-size: 13px; font-style: italic; color: var(--ink-soft); }

/* thông số */
.pj-specs {
  display: grid; grid-template-columns: repeat(2, 1fr); margin: 40px 0 0; padding: 0;
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: #fff;
}
.pj-specs > div { padding: 22px 16px; border-bottom: 1px solid var(--line); }
.pj-specs > div:nth-child(2n) { border-left: 1px solid var(--line); }
.pj-specs dt { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); }
.pj-specs dd { margin: 8px 0 0; font-size: 20px; font-weight: 400; color: var(--ink); }

/* câu chuyện */
.pj-story { display: grid; grid-template-columns: 1fr; gap: 20px 40px; padding: 56px 0 0; }
.pj-story-title { margin: 0; font-size: 28px; font-weight: 400; line-height: 1.3; color: var(--ink); }
.pj-story-body p { margin: 0 0 16px; font-size: 17px; line-height: 1.8; font-weight: 300; color: #4d463d; }
.pj-story-img { grid-column: 1 / -1; margin-top: 20px; border-radius: 6px; overflow: hidden; aspect-ratio: 21 / 9; background: var(--primary-light); }
.pj-story-img img { width: 100%; height: 100%; object-fit: cover; }

/* thanh chip dính */
.pj-sticky {
  position: sticky; z-index: 40; margin-top: 56px; padding: 12px 0;
  background: rgba(250, 247, 242, .96); backdrop-filter: blur(8px);
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
}
.pj-chips { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.pj-chips::-webkit-scrollbar { display: none; }
.pj-chip {
  flex: 0 0 auto; border: none; background: #ece8e1; color: var(--ink); padding: 9px 18px; border-radius: 999px;
  font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background .2s, color .2s;
}
.pj-chip b { margin-left: 4px; font-weight: 500; opacity: .6; }
.pj-chip:hover { background: #e2dccf; }
.pj-chip.on { background: var(--primary); color: #fff; }
.pj-chip.on b { opacity: .85; }

/* phần không gian */
.pj-spaces { padding-top: 24px; }
.pj-space { padding: 48px 0 0; }
.pj-space + .pj-space { padding-top: 72px; }
.pj-space-head {
  display: flex; flex-direction: column; gap: 10px; padding-bottom: 18px; margin-bottom: 26px; border-bottom: 1px solid var(--line);
}
.pj-space-index { margin: 0 0 6px; font-size: 12px; letter-spacing: .14em; color: var(--primary); font-weight: 600; }
.pj-space-title { margin: 0; font-size: 26px; font-weight: 400; letter-spacing: .02em; text-transform: uppercase; color: var(--ink); }
.pj-space-sub { margin: 0; font-size: 13.5px; color: var(--ink-soft); }

/* thông tin dự án */
.pj-info { display: grid; grid-template-columns: 1fr; gap: 36px; padding: 40px 0 0; align-items: start; }
.pj-table { margin: 28px 0 0; border-top: 1px solid var(--line); }
.pj-table > div { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); align-items: center; }
.pj-table dt { font-size: 13.5px; color: var(--ink-soft); }
.pj-table dd { margin: 0; font-size: 14.5px; font-weight: 500; color: var(--ink); }
.pj-table-quote { background: #f3efe8; padding-left: 14px; padding-right: 14px; border-radius: 4px; }
.pj-plan { margin: 0; position: relative; }
.pj-plan-img {
  aspect-ratio: 1 / 1; border-radius: 6px; overflow: hidden; background: var(--primary-light);
  border: 1px solid var(--line); display: flex; align-items: center; justify-content: center;
}
.pj-plan-img img { width: 100%; height: 100%; object-fit: cover; }
.pj-plan-img i { font-size: 56px; color: #d8d1c5; }
.pj-plan figcaption {
  position: absolute; left: 14px; right: 14px; bottom: 14px; padding: 10px 14px; border-radius: 4px;
  background: rgba(255, 255, 255, .92); font-size: 12.5px; line-height: 1.5; color: var(--ink);
}

/* sản phẩm */
.pj-products { padding: 72px 0 0; }
.pj-products-head { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
.pj-products-note { margin: 0; max-width: 380px; font-size: 14px; line-height: 1.65; color: var(--ink-soft); }
.pj-products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.pj-prod { display: flex; flex-direction: column; }
.pj-prod-img {
  aspect-ratio: 1 / 1; border-radius: 6px; overflow: hidden; background: var(--primary-light); border: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
}
.pj-prod-img img { width: 100%; height: 100%; object-fit: cover; }
.pj-prod-img i { font-size: 34px; color: #d8d1c5; }
.pj-prod-cat { margin: 0 0 4px; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
.pj-prod-name { margin: 0 0 6px; font-size: 15.5px; font-weight: 500; line-height: 1.4; color: var(--ink); }
.pj-prod-price { margin: 0 0 14px; font-size: 15px; font-weight: 600; color: var(--primary); }
.pj-prod .pj-btn-block { margin-top: auto; }

.pj-anchor { scroll-margin-top: calc(var(--hh) + 70px); }

/* dự án tương tự */
.pj-related { padding-top: 8px; }
.pj-related-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-bottom: 26px; }
.pj-related-head .pj-h2 { margin-top: 0; font-size: 26px; }
.pj-related-all { font-size: 13px; font-weight: 600; color: var(--primary); white-space: nowrap; }
.pj-related-all i { font-size: 11px; margin-left: 4px; }
.pj-related-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }

/* liên kết nhanh */
.pj-quick { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 56px 0 16px; }
.pj-quick a {
  display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 20px 22px; background: #fff;
  border: 1px solid var(--line); border-radius: 6px; transition: border-color .2s, box-shadow .2s;
}
.pj-quick a:hover { border-color: var(--primary); box-shadow: var(--shadow); }
.pj-quick span { display: flex; flex-direction: column; gap: 4px; }
.pj-quick small { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); }
.pj-quick b { font-size: 15px; font-weight: 500; color: var(--ink); }
.pj-quick i { color: var(--primary); font-size: 13px; }

@media (min-width: 640px) {
  .pj-products-grid { grid-template-columns: repeat(3, 1fr); }
  .pj-related-grid { grid-template-columns: repeat(2, 1fr); }
  .pj-quick { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 900px) {
  .pj-title { font-size: 44px; }
  .pj-h2 { font-size: 36px; }
  .pj-specs { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
  .pj-specs > div { border-bottom: none; padding: 26px 24px; }
  .pj-specs > div:nth-child(2n) { border-left: none; }
  .pj-specs > div + div { border-left: 1px solid var(--line); }
  .pj-specs dd { font-size: 24px; }
  .pj-story { grid-template-columns: 4fr 8fr; }
  .pj-story-title { font-size: 34px; }
  .pj-space-head { flex-direction: row; justify-content: space-between; align-items: flex-end; }
  .pj-space-title { font-size: 30px; }
  .pj-info { grid-template-columns: 1.15fr .85fr; gap: 56px; }
  .pj-products-head { flex-direction: row; justify-content: space-between; align-items: flex-end; }
  .pj-products-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .pj-related-grid { grid-template-columns: repeat(3, 1fr); }
  .pj-related-head .pj-h2 { font-size: 30px; }
  .pj-quick { grid-template-columns: repeat(4, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .pj-btn, .pj-chip, .pj-quick a { transition: none; }
}
</style>
