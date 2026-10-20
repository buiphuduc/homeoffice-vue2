<template>
  <router-link
    :to="{ name: 'project-detail', params: { slug: project.slug } }"
    class="project-card"
    :class="'is-' + variant"
    :aria-label="'Xem dự án ' + project.name"
  >
    <div class="pc-thumb">
      <safe-image :sources="[project.cover]" :alt="project.coverAlt || project.name">
        <i class="fa-solid fa-house-chimney"></i>
      </safe-image>
      <span class="pc-badge" v-if="project.featured && variant === 'list'">Tiêu biểu</span>
    </div>

    <!-- Kiểu danh sách: kicker, tên đầy đủ, dòng meta + "Xem dự án" -->
    <div class="pc-body" v-if="variant === 'list'">
      <p class="pc-kicker" v-if="kicker">{{ kicker }}</p>
      <h3 class="pc-name">{{ title }}</h3>
      <div class="pc-foot">
        <span class="pc-meta">{{ meta }}</span>
        <span class="pc-more">Xem dự án <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </div>

    <!-- Kiểu "Dự án tương tự": kicker loại hình · diện tích, tên, mô tả 2 dòng -->
    <div class="pc-body" v-else>
      <p class="pc-kicker" v-if="relatedKicker">{{ relatedKicker }}</p>
      <h3 class="pc-name pc-name-lg">{{ project.name }}</h3>
      <p class="pc-sum" v-if="project.summary">{{ project.summary }}</p>
    </div>
  </router-link>
</template>

<script>
import SafeImage from '@/components/common/SafeImage.vue';
import { projectMeta, projectKicker, cardTitle } from '@/utils/projects';

/**
 * Thẻ dự án. variant="list" dùng ở trang /du-an và trang chủ;
 * variant="related" dùng ở "Dự án tương tự" trong trang chi tiết.
 * Toàn bộ thẻ là 1 liên kết tới trang chi tiết dự án.
 */
export default {
  name: 'ProjectCard',
  components: { SafeImage },
  props: {
    project: { type: Object, required: true },
    variant: { type: String, default: 'list' },
  },
  computed: {
    kicker() { return projectKicker(this.project); },
    title() { return cardTitle(this.project); },
    meta() { return projectMeta(this.project); },
    relatedKicker() {
      const p = this.project;
      return [p.type, p.area ? `${p.area}m²` : ''].filter(Boolean).join(' · ');
    },
  },
};
</script>

<style scoped>
.project-card {
  display: flex; flex-direction: column; background: #fff;
  border: 1px solid var(--line); border-radius: 6px; overflow: hidden;
  transition: box-shadow .25s, transform .25s, border-color .2s;
}
.project-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: transparent; }
.project-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.pc-thumb {
  position: relative; aspect-ratio: 4 / 3; background: var(--primary-light); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.is-related .pc-thumb { aspect-ratio: 16 / 10; }
.pc-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.project-card:hover .pc-thumb img { transform: scale(1.04); }
.pc-thumb i { font-size: 44px; color: #d8d1c5; }
.pc-badge {
  position: absolute; top: 12px; left: 12px; background: #fff; color: var(--ink);
  font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
  padding: 4px 9px; border-radius: 3px; border: 1px solid var(--line);
}
.pc-body { padding: 16px 16px 14px; display: flex; flex-direction: column; flex: 1; }
.is-related .pc-body { padding: 22px 22px 26px; }
.pc-kicker { margin: 0 0 8px; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
.pc-name {
  margin: 0; font-size: 17px; font-weight: 400; line-height: 1.4; color: var(--ink);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pc-name-lg { font-size: 24px; margin-bottom: 8px; }
.pc-sum {
  margin: 0; font-size: 14px; line-height: 1.6; color: var(--ink-soft);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pc-foot {
  margin-top: auto; padding-top: 14px; border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center; gap: 10px;
}
.pc-name + .pc-foot { margin-top: 14px; }
.pc-meta { font-size: 11.5px; color: var(--ink-soft); }
.pc-more { font-size: 11.5px; font-weight: 600; color: var(--ink); white-space: nowrap; }
.pc-more i { font-size: 10px; transition: transform .2s; }
.project-card:hover .pc-more i { transform: translateX(3px); }
@media (prefers-reduced-motion: reduce) {
  .project-card, .pc-thumb img, .pc-more i { transition: none; }
  .project-card:hover { transform: none; }
  .project-card:hover .pc-thumb img { transform: none; }
}
</style>
