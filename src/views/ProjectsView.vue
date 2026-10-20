<template>
  <div class="projects-view">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <router-link to="/">Trang chủ</router-link> › <span>Dự án</span>
    </nav>

    <header class="pv-head">
      <div class="pv-head-text">
        <h1 class="pv-title">Dự án hoàn thiện</h1>
        <p class="pv-sub">
          Những không gian HTM đã hiện thực hóa cùng gia chủ — tiện nghi, bền vững và đậm dấu ấn cá nhân
          với giải pháp ván công nghiệp MDF Melamine E0/E1 cao cấp.
        </p>
      </div>
      <label class="pv-search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input
          v-model.trim="query"
          type="search"
          placeholder="Tìm dự án theo tên hoặc địa điểm..."
          aria-label="Tìm dự án theo tên hoặc địa điểm"
        >
      </label>
    </header>

    <div class="pv-chips" v-if="types.length > 1" role="group" aria-label="Lọc theo loại hình">
      <button type="button" class="pv-chip" :class="{ on: !type }" @click="type = ''">Tất cả</button>
      <button
        v-for="t in types"
        :key="t"
        type="button"
        class="pv-chip"
        :class="{ on: type === t }"
        @click="type = t"
      >{{ t }}</button>
    </div>

    <div ref="grid" class="pv-grid" v-if="pageItems.length">
      <project-card v-for="p in pageItems" :key="p.slug" :project="p"></project-card>
    </div>

    <empty-state
      v-else-if="allProjects.length"
      icon="fa-solid fa-magnifying-glass"
      text="Không có dự án phù hợp."
    >
      <button type="button" class="btn btn-outline" @click="clearFilters">Xóa bộ lọc</button>
    </empty-state>

    <empty-state v-else icon="fa-solid fa-house-chimney" text="Các dự án sẽ sớm được cập nhật.">
      <router-link to="/" class="btn btn-outline">Về trang chủ</router-link>
    </empty-state>

    <div class="pv-pager" v-if="pageCount > 1">
      <nav class="pv-pages" aria-label="Phân trang">
        <button type="button" class="pv-page" :disabled="page === 1" @click="goPage(page - 1)" aria-label="Trang trước">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          v-for="n in pageCount"
          :key="n"
          type="button"
          class="pv-page"
          :class="{ on: n === page }"
          :aria-current="n === page ? 'page' : null"
          @click="goPage(n)"
        >{{ n }}</button>
        <button type="button" class="pv-page" :disabled="page === pageCount" @click="goPage(page + 1)" aria-label="Trang sau">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </nav>
      <button type="button" class="pv-more" v-if="page < pageCount" @click="goPage(page + 1)">Xem thêm dự án</button>
    </div>

    <project-cta
      variant="center"
      title="Bạn muốn kiến tạo không gian sống mơ ước?"
      text="Liên hệ với đội ngũ HTM để nhận tư vấn giải pháp nội thất ván công nghiệp chuẩn E0/E1 và dự toán chi tiết."
    ></project-cta>
  </div>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue';
import ProjectCta from '@/components/project/ProjectCta.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { getAllProjects, projectTypes, filterProjects } from '@/utils/projects';

const PAGE_SIZE = 9;

/**
 * Trang danh sách dự án (/du-an) — bố cục theo mẫu screen1:
 * tiêu đề + ô tìm kiếm, chip loại hình, lưới 3 cột, phân trang + "Xem thêm dự án",
 * khối CTA căn giữa. Số trang lưu trên URL (?page=2).
 */
export default {
  name: 'ProjectsView',
  components: { ProjectCard, ProjectCta, EmptyState },
  data() {
    return { query: '', type: '' };
  },
  computed: {
    allProjects() { return getAllProjects(); },
    types() { return projectTypes(); },
    filtered() { return filterProjects({ type: this.type, query: this.query }); },
    pageCount() { return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE)); },
    page() {
      const n = parseInt(this.$route.query.page, 10);
      if (!Number.isFinite(n) || n < 1) return 1;
      return Math.min(n, this.pageCount);
    },
    pageItems() {
      const start = (this.page - 1) * PAGE_SIZE;
      return this.filtered.slice(start, start + PAGE_SIZE);
    },
  },
  watch: {
    query() { this.resetPage(); },
    type() { this.resetPage(); },
  },
  methods: {
    resetPage() {
      if (this.$route.query.page) {
        this.$router.replace({ query: { ...this.$route.query, page: undefined } }).catch(() => {});
      }
    },
    goPage(n) {
      this.$router.push({ query: { ...this.$route.query, page: n > 1 ? n : undefined } }).catch(() => {});
      this.$nextTick(() => {
        const el = this.$refs.grid;
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' });
      });
    },
    clearFilters() {
      this.query = '';
      this.type = '';
    },
  },
};
</script>

<style scoped>
.projects-view { padding-bottom: 24px; }
.pv-head {
  display: flex; flex-direction: column; gap: 22px; margin: 8px 0 0; padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}
.pv-title { margin: 0 0 12px; font-size: 30px; font-weight: 400; letter-spacing: .01em; text-transform: uppercase; color: var(--ink); }
.pv-sub { margin: 0; max-width: 560px; font-size: 14.5px; line-height: 1.7; color: var(--ink-soft); }
.pv-search {
  display: flex; align-items: center; gap: 10px; width: 100%; max-width: 360px; background: #fff;
  border: 1px solid var(--line); border-radius: 6px; padding: 0 14px; transition: border-color .2s;
}
.pv-search:focus-within { border-color: var(--primary); }
.pv-search i { color: var(--ink-soft); font-size: 13px; }
.pv-search input { flex: 1; min-width: 0; border: none; background: transparent; padding: 12px 0; font-size: 13.5px; color: var(--ink); outline: none; }
.pv-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 28px; }
.pv-chip {
  border: none; background: #ece8e1; color: var(--ink); padding: 7px 16px; border-radius: 999px;
  font-size: 12px; font-weight: 500; cursor: pointer; transition: background .2s, color .2s;
}
.pv-chip:hover { background: #e2dccf; }
.pv-chip.on { background: var(--primary); color: #fff; }
.pv-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 28px; }
.pv-chips + .pv-grid { margin-top: 0; }
.pv-pager { display: flex; justify-content: center; align-items: center; gap: 14px; margin: 44px 0 8px; flex-wrap: wrap; }
.pv-pages { display: flex; gap: 8px; }
.pv-page {
  min-width: 34px; height: 34px; padding: 0 8px; border-radius: 6px; border: 1px solid var(--line);
  background: #fff; color: var(--ink); cursor: pointer; font-weight: 500; font-size: 13px;
}
.pv-page.on { background: var(--primary); border-color: var(--primary); color: #fff; }
.pv-page:disabled { opacity: .4; cursor: not-allowed; }
.pv-more {
  height: 34px; padding: 0 20px; border-radius: 6px; border: 1px solid var(--line); background: #fff;
  color: var(--ink); font-size: 13px; cursor: pointer; transition: border-color .2s;
}
.pv-more:hover { border-color: var(--primary); }
@media (min-width: 640px) { .pv-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) {
  .pv-head { flex-direction: row; justify-content: space-between; align-items: flex-end; }
  .pv-title { font-size: 34px; }
  .pv-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
