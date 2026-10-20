<template>
  <!-- ========== center: khối lớn căn giữa (trang danh sách) ========== -->
  <section v-if="variant === 'center'" class="cta cta-center">
    <span class="cta-icon"><i class="fa-solid fa-compass-drafting"></i></span>
    <h2 class="cta-title">{{ title }}</h2>
    <p class="cta-text" v-if="text">{{ text }}</p>
    <div class="cta-actions">
      <a v-if="zaloUrl" class="cb cb-primary" :href="zaloUrl" target="_blank" rel="noopener">
        <i class="fa-solid fa-comment-dots"></i> Chat Zalo
      </a>
      <a v-if="messengerUrl" class="cb cb-light" :href="messengerUrl" target="_blank" rel="noopener">
        <i class="fa-brands fa-facebook-messenger"></i> Nhắn tin Messenger
      </a>
      <a v-if="config.hotlineTel" class="cb cb-dark" :href="'tel:' + config.hotlineTel">
        <i class="fa-solid fa-phone-volume"></i>
        <span class="cb-two"><small>Gọi Hotline</small><strong>{{ config.hotlineDisplay }}</strong></span>
      </a>
      <router-link v-if="!zaloUrl && !messengerUrl && !config.hotlineTel" class="cb cb-primary" to="/lien-he">Liên hệ</router-link>
    </div>
    <ul class="cta-trust" v-if="trust.length">
      <li v-for="t in trust" :key="t.text"><i class="fa-solid" :class="t.icon"></i> {{ t.text }}</li>
    </ul>
  </section>

  <!-- ========== strip: dải ngang chèn giữa trang chi tiết ========== -->
  <section v-else-if="variant === 'strip'" class="cta cta-strip">
    <div class="cta-strip-text">
      <h2 class="cta-strip-title">{{ title }}</h2>
      <p class="cta-text" v-if="text">{{ text }}</p>
    </div>
    <div class="cta-actions">
      <a v-if="zaloUrl" class="cb cb-primary" :href="zaloUrl" target="_blank" rel="noopener">
        <i class="fa-solid fa-comment-dots"></i> Chat Zalo
      </a>
      <a v-if="messengerUrl" class="cb cb-light" :href="messengerUrl" target="_blank" rel="noopener">Nhắn tin</a>
      <router-link v-else class="cb cb-light" to="/lien-he">Liên hệ</router-link>
      <a v-if="config.hotlineTel" class="cb cb-outline" :href="'tel:' + config.hotlineTel">
        <i class="fa-solid fa-phone"></i> {{ config.hotlineDisplay }}
      </a>
    </div>
  </section>

  <!-- ========== block: khối CTA lớn cuối trang chi tiết ========== -->
  <section v-else class="cta cta-block">
    <div class="cta-block-text">
      <p class="cta-label" v-if="label">{{ label }}</p>
      <h2 class="cta-block-title">{{ title }}</h2>
      <ul class="cta-points">
        <li v-if="config.hotlineDisplay">
          <i class="fa-solid fa-circle-check"></i>
          <span>Hotline hỗ trợ: <strong>{{ config.hotlineDisplay }}</strong></span>
        </li>
        <li v-for="p in points" :key="p">
          <i class="fa-solid fa-circle-check"></i><span>{{ p }}</span>
        </li>
      </ul>
    </div>
    <div class="cta-block-actions">
      <a v-if="zaloUrl" class="cb cb-primary cb-wide" :href="zaloUrl" target="_blank" rel="noopener">
        <i class="fa-solid fa-comment-dots"></i> Tư vấn Zalo ngay
      </a>
      <a v-if="config.hotlineTel" class="cb cb-outline-dark cb-wide" :href="'tel:' + config.hotlineTel">
        <i class="fa-solid fa-phone"></i> Gọi Hotline: {{ config.hotlineDisplay }}
      </a>
      <router-link class="cb cb-soft cb-wide" to="/lien-he">Gửi yêu cầu báo giá</router-link>
    </div>
  </section>
</template>

<script>
import config from '@/config';
import { projectUi } from '@/content/projects';

/**
 * Khối kêu gọi liên hệ cho mục Dự án. 3 kiểu:
 *  - center: khối lớn căn giữa + 3 nút + dòng cam kết (trang /du-an)
 *  - strip : dải ngang chèn giữa trang chi tiết
 *  - block : khối lớn cuối trang chi tiết (có gạch đầu dòng)
 * Nội dung cam kết/gạch đầu dòng chỉnh trong projectUi (src/content/projects.js).
 */
export default {
  name: 'ProjectCta',
  props: {
    variant: { type: String, default: 'center' },
    title: { type: String, required: true },
    text: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  data() {
    return { config, trust: projectUi.trust, points: projectUi.ctaPoints };
  },
  computed: {
    zaloUrl() { return config.zaloPhone ? `https://zalo.me/${config.zaloPhone}` : ''; },
    messengerUrl() { return config.messengerUsername ? `https://m.me/${config.messengerUsername}` : ''; },
  },
};
</script>

<style scoped>
/* nút dùng chung */
.cb {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 13px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; line-height: 1.2;
  border: 1.5px solid transparent; cursor: pointer; transition: background .2s, border-color .2s, color .2s;
}
.cb-primary { background: var(--primary); color: #fff; }
.cb-primary:hover { background: var(--primary-dark); }
.cb-light { background: #fff; color: var(--ink); border-color: var(--line); }
.cb-light:hover { border-color: var(--primary); }
.cb-dark { background: #1c1b1a; color: #fff; text-align: left; padding: 11px 24px; }
.cb-dark:hover { background: #000; }
.cb-two { display: flex; flex-direction: column; gap: 2px; }
.cb-two small { font-size: 11.5px; opacity: .85; }
.cb-two strong { font-size: 14.5px; font-weight: 600; letter-spacing: .02em; }
.cb-outline { background: transparent; color: var(--primary); border-color: var(--primary); }
.cb-outline:hover { background: var(--primary); color: #fff; }
.cb-outline-dark { background: #fff; color: var(--ink); border-color: var(--ink); }
.cb-outline-dark:hover { background: var(--ink); color: #fff; }
.cb-soft { background: #ebe1d7; color: var(--ink); }
.cb-soft:hover { background: #e0d3c5; }
.cb-wide { width: 100%; padding: 16px 24px; }
.cb:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.cta-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* center */
.cta-center {
  margin: 64px 0 40px; padding: 56px 24px 40px; border: 1px solid var(--line); border-radius: 6px;
  background: #ece8e1; text-align: center; display: flex; flex-direction: column; align-items: center;
}
.cta-icon {
  width: 46px; height: 46px; border-radius: 50%; background: #fbe3bd; color: var(--primary);
  display: inline-flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 18px;
}
.cta-title { margin: 0 0 12px; font-size: 28px; font-weight: 400; letter-spacing: -.01em; color: var(--ink); }
.cta-text { margin: 0; max-width: 560px; font-size: 14.5px; line-height: 1.7; color: var(--ink-soft); }
.cta-center .cta-actions { justify-content: center; margin-top: 28px; }
.cta-trust {
  list-style: none; margin: 32px 0 0; padding: 22px 0 0; width: 100%; max-width: 640px;
  border-top: 1px solid #d9d2c6; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px;
}
.cta-trust li { font-size: 12px; color: var(--ink-soft); display: inline-flex; align-items: center; gap: 8px; }
.cta-trust i { color: var(--primary); font-size: 13px; }

/* strip */
.cta-strip {
  margin: 72px 0; padding: 32px 28px; background: #ece8e1; border: 1px solid var(--line); border-radius: 6px;
  display: flex; flex-direction: column; gap: 20px;
}
.cta-strip-title { margin: 0 0 8px; font-size: 24px; font-weight: 500; color: var(--ink); }
.cta-strip .cb { padding: 11px 22px; }

/* block */
.cta-block {
  margin: 72px 0; padding: 40px 28px; background: #fff; border: 1px solid var(--line); border-radius: 6px;
  display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center;
}
.cta-label { margin: 0 0 12px; font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--primary); }
.cta-block-title { margin: 0 0 22px; font-size: 32px; line-height: 1.25; font-weight: 400; letter-spacing: -.01em; color: var(--ink); }
.cta-points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.cta-points li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; line-height: 1.55; color: var(--ink-soft); }
.cta-points i { color: var(--primary); margin-top: 3px; }
.cta-points strong { color: var(--ink); }
.cta-block-actions { display: flex; flex-direction: column; gap: 12px; }

@media (min-width: 900px) {
  .cta-center { padding: 64px 48px 44px; }
  .cta-title { font-size: 34px; }
  .cta-strip { flex-direction: row; align-items: center; justify-content: space-between; padding: 36px 44px; }
  .cta-block { grid-template-columns: 1.2fr .8fr; gap: 56px; padding: 56px 56px; }
  .cta-block-title { font-size: 38px; }
}
@media (prefers-reduced-motion: reduce) { .cb { transition: none; } }
</style>
