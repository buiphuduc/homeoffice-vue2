<template>
  <div class="adm">
    <!-- Chưa có API (vd đang chạy npm run serve trên máy cá nhân) -->
    <div class="adm-setup adm-card" v-if="!configured">
      <h1>Trang quản trị chưa kết nối API</h1>
      <p>Trang quản trị cần phần API (thư mục <code>api</code>) chạy trên hosting có PHP + MySQL. Bản build production dùng sẵn địa chỉ <code>/api</code>.
        Nếu bạn đang chạy <code>npm run serve</code> trên máy cá nhân thì không có PHP; hãy mở trang này trên website đã upload lên hosting.</p>
      <p>Hướng dẫn cài đặt từng bước: <code>docs/ADMIN-HUONG-DAN.md</code>.</p>
      <router-link class="adm-btn" to="/">&larr; Về website</router-link>
    </div>

    <div class="adm-login" v-else-if="!status && !apiError"><p class="adm-hint">Đang kiểm tra...</p></div>

    <!-- API có nhưng chưa cài đúng (thiếu config.php, sai MySQL...) -->
    <div class="adm-setup adm-card" v-else-if="apiError">
      <h1>Chưa dùng được API quản trị</h1>
      <p class="adm-alert adm-alert-err">{{ apiError }}</p>
      <p>Kiểm tra theo <code>docs/ADMIN-HUONG-DAN.md</code>: đã upload thư mục <code>api</code>, tạo <code>api/config.php</code> và điền đúng thông tin MySQL chưa.</p>
      <button type="button" class="adm-btn" @click="loadStatus">Thử lại</button>
    </div>

    <admin-setup v-else-if="status.needs_setup && !session" @done="onLoggedIn"></admin-setup>

    <admin-login v-else-if="!session" @logged-in="onLoggedIn"></admin-login>

    <template v-else>
      <header class="adm-top">
        <div class="adm-top-in">
          <strong class="adm-brand">HTM · Quản trị</strong>
          <span class="adm-grow"></span>
          <span class="adm-muted adm-email">{{ session.username }}<span class="adm-role" v-if="session.role === 'it'">IT</span></span>
          <router-link class="adm-btn adm-btn-sm" to="/" target="_blank">Xem website</router-link>
          <button type="button" class="adm-btn adm-btn-sm" @click="logout">Đăng xuất</button>
        </div>
        <nav class="adm-tabs" aria-label="Mục quản trị">
          <router-link
            v-for="t in tabs"
            :key="t.key"
            :to="{ name: 'admin', params: { tab: t.key } }"
            class="adm-tab"
            :class="{ on: tab === t.key }"
          >{{ t.label }}</router-link>
        </nav>
      </header>

      <main class="adm-main">
        <admin-products v-if="tab === 'san-pham'" key="p"></admin-products>
        <admin-projects v-else-if="tab === 'du-an'" key="j"></admin-projects>
        <admin-users v-else-if="tab === 'tai-khoan'" key="u" :role="session.role"></admin-users>
        <admin-tools v-else key="t"></admin-tools>
      </main>
    </template>
  </div>
</template>

<script>
import * as sb from '@/services/api';
import AdminLogin from '@/components/admin/AdminLogin.vue';
import AdminProducts from '@/components/admin/AdminProducts.vue';
import AdminProjects from '@/components/admin/AdminProjects.vue';
import AdminTools from '@/components/admin/AdminTools.vue';
import AdminSetup from '@/components/admin/AdminSetup.vue';
import AdminUsers from '@/components/admin/AdminUsers.vue';

/**
 * src/views/AdminView.vue — trang quản trị (/admin): đăng nhập, rồi quản lý
 * sản phẩm, dự án, tài khoản và công cụ (nhập/sao lưu). Có khung riêng, không dùng
 * header/footer của website, và đặt thẻ noindex để Google không lập chỉ mục.
 */
export default {
  name: 'AdminView',
  components: {
    AdminLogin, AdminProducts, AdminProjects, AdminTools, AdminSetup, AdminUsers,
  },
  data() {
    return {
      configured: sb.isConfigured(),
      session: sb.getSession(),
      status: null,
      apiError: '',
      tabs: [
        { key: 'san-pham', label: 'Sản phẩm' },
        { key: 'du-an', label: 'Dự án' },
        { key: 'tai-khoan', label: 'Tài khoản' },
        { key: 'cong-cu', label: 'Công cụ' },
      ],
    };
  },
  computed: {
    tab() { return this.$route.params.tab || 'san-pham'; },
  },
  created() {
    sb.onAuthLost(() => { this.session = null; });
    this.robots = document.createElement('meta');
    this.robots.setAttribute('name', 'robots');
    this.robots.setAttribute('content', 'noindex,nofollow');
    document.head.appendChild(this.robots);
    document.title = 'Quản trị · HTM';
    if (this.configured) this.loadStatus();
  },
  beforeDestroy() {
    sb.onAuthLost(null);
    if (this.robots && this.robots.parentNode) this.robots.parentNode.removeChild(this.robots);
  },
  methods: {
    // Hỏi máy chủ: đã có tài khoản admin chưa, và phiên đăng nhập hiện tại còn hiệu lực không
    async loadStatus() {
      this.apiError = '';
      try {
        const s = await sb.authStatus();
        this.status = s;
        this.session = s.user ? { username: s.user.username, role: s.user.role } : null;
      } catch (e) {
        this.status = null;
        this.apiError = e.message;
      }
    },
    onLoggedIn() {
      this.loadStatus();
    },
    async logout() {
      await sb.signOut();
      this.session = null;
    },
  },
};
</script>

<style>
/* Kiểu riêng cho trang quản trị (tiền tố .adm — không ảnh hưởng phần còn lại của website) */
.adm { min-height: 100vh; background: #f6f3ee; color: var(--ink); font-size: 14px; }
.adm * { box-sizing: border-box; }
.adm h1, .adm h2, .adm h3 { margin: 0; font-weight: 500; }
.adm code { background: #ece8e1; padding: 1px 6px; border-radius: 4px; font-size: 12.5px; }
.adm-grow { flex: 1; }
.adm-muted { color: var(--ink-soft); font-size: 13px; }
.adm-hint { margin: 6px 0 10px; font-size: 13px; color: var(--ink-soft); }
.adm-warn { color: #9a5b00; }

/* khung & thanh trên */
.adm-top { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid var(--line); }
.adm-top-in { max-width: 1280px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; gap: 10px; }
.adm-brand { font-size: 16px; letter-spacing: .02em; }
.adm-role { display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 4px; background: var(--primary); color: #fff; font-size: 11px; font-weight: 600; }
.adm-email { display: none; }
.adm-tabs { max-width: 1280px; margin: 0 auto; padding: 0 20px; display: flex; gap: 6px; }
.adm-tab { padding: 10px 16px; font-weight: 500; color: var(--ink-soft); border-bottom: 2px solid transparent; }
.adm-tab.on { color: var(--primary); border-color: var(--primary); }
.adm-main { max-width: 1280px; margin: 0 auto; padding: 22px 20px 80px; }
@media (min-width: 700px) { .adm-email { display: inline; } }

/* thẻ, form */
.adm-card { background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
.adm-card h3 { margin-bottom: 8px; font-size: 15.5px; }
.adm-setup { max-width: 640px; margin: 60px auto; line-height: 1.7; }
.adm-setup h1 { font-size: 22px; margin-bottom: 12px; }
.adm-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.adm-login-card { width: 100%; max-width: 380px; padding: 28px; }
.adm-login-card h1 { font-size: 22px; margin-bottom: 4px; }
.adm-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.adm-field > span { font-size: 12.5px; font-weight: 600; color: #4d463d; }
.adm-field small { font-size: 12px; color: var(--ink-soft); }
.adm-input {
  width: 100%; padding: 10px 12px; border: 1px solid #d9d2c6; border-radius: 7px; background: #fff;
  font: inherit; color: var(--ink); outline: none; transition: border-color .15s, box-shadow .15s;
}
.adm-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(139, 115, 85, .15); }
.adm-input:disabled { background: #f1eee8; color: var(--ink-soft); }
.adm-input-sm { padding: 7px 10px; font-size: 13px; }
textarea.adm-input { resize: vertical; line-height: 1.5; }
.adm-check { flex-direction: row; align-items: center; gap: 8px; }
.adm-check > span { font-weight: 400; }
.adm-grid-2, .adm-grid-3 { display: grid; grid-template-columns: 1fr; gap: 0 16px; }
@media (min-width: 700px) {
  .adm-grid-2 { grid-template-columns: 1fr 1fr; }
  .adm-grid-3 { grid-template-columns: repeat(3, 1fr); }
}
.adm-sec { margin: 26px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--primary); }
.adm-sec:first-child { margin-top: 0; }
.adm-more { margin: 4px 0 14px; }
.adm-more summary { cursor: pointer; font-weight: 600; color: var(--primary); padding: 6px 0; }

/* nút */
.adm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 16px;
  border: 1px solid #d9d2c6; border-radius: 7px; background: #fff; color: var(--ink); font: inherit; font-weight: 500;
  cursor: pointer; transition: background .15s, border-color .15s; white-space: nowrap; text-decoration: none;
}
.adm-btn:hover { border-color: var(--primary); }
.adm-btn:disabled, .adm-btn.is-disabled { opacity: .55; cursor: not-allowed; }
.adm-btn-primary { background: var(--primary); border-color: var(--primary); color: #fff; }
.adm-btn-primary:hover { background: var(--primary-dark); border-color: var(--primary-dark); }
.adm-btn-danger { color: #b3261e; }
.adm-btn-danger:hover { background: #fbe9e7; border-color: #b3261e; }
.adm-btn-sm { padding: 6px 11px; font-size: 12.5px; }
.adm-btn-block { width: 100%; margin-top: 6px; }
.adm-icon {
  width: 28px; height: 28px; border: 1px solid #d9d2c6; border-radius: 6px; background: #fff; cursor: pointer;
  font-size: 15px; line-height: 1; color: var(--ink);
}
.adm-icon:disabled { opacity: .35; cursor: not-allowed; }
.adm-icon-danger { color: #b3261e; }

/* thông báo */
.adm-alert { margin: 10px 0; padding: 10px 14px; border-radius: 8px; font-size: 13.5px; line-height: 1.5; }
.adm-alert-err { background: #fbe9e7; color: #8c1d18; border: 1px solid #f3b7a6; }
.adm-alert-ok { background: #e8f3ea; color: #1e5a2b; border: 1px solid #b9dcc1; }
.adm-empty { padding: 36px 20px; text-align: center; color: var(--ink-soft); background: #fff; border: 1px dashed #d9d2c6; border-radius: 10px; line-height: 1.7; }

/* thanh công cụ + bảng */
.adm-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 4px; }
.adm-search { flex: 1; min-width: 200px; }
.adm-bar select.adm-input { width: auto; min-width: 180px; }
.adm-table-wrap { overflow-x: auto; background: #fff; border: 1px solid var(--line); border-radius: 10px; }
.adm-table { width: 100%; border-collapse: collapse; min-width: 760px; }
.adm-table th { text-align: left; padding: 11px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-soft); background: #faf7f2; border-bottom: 1px solid var(--line); }
.adm-table td { padding: 9px 12px; border-bottom: 1px solid #efebe4; vertical-align: middle; }
.adm-table tr:last-child td { border-bottom: none; }
.adm-td-thumb { width: 54px; }
.adm-td-thumb img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; background: #efe9df; display: block; }
.adm-td-actions { text-align: right; white-space: nowrap; }
.adm-td-actions .adm-btn + .adm-btn { margin-left: 6px; }
.adm-pager { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 16px; }
.adm-switch { width: 38px; height: 22px; border-radius: 999px; border: none; background: #cfc8bb; position: relative; cursor: pointer; padding: 0; transition: background .2s; }
.adm-switch span { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .2s; }
.adm-switch.on { background: #3f8a52; }
.adm-switch.on span { transform: translateX(16px); }

/* cửa sổ nổi */
.adm-modal-back { position: fixed; inset: 0; z-index: 100; background: rgba(30, 25, 20, .55); display: flex; align-items: flex-start; justify-content: center; padding: 24px 12px; overflow-y: auto; }
.adm-modal { background: #fff; border-radius: 12px; width: 100%; max-width: 640px; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0, 0, 0, .3); }
.adm-modal.wide { max-width: 980px; }
.adm-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: #fff; border-radius: 12px 12px 0 0; z-index: 2; }
.adm-modal-head h2 { font-size: 17px; }
.adm-x { border: none; background: none; font-size: 26px; line-height: 1; cursor: pointer; color: var(--ink-soft); padding: 0 4px; }
.adm-modal-body { padding: 20px 22px; }
.adm-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid var(--line); position: sticky; bottom: 0; background: #fff; border-radius: 0 0 12px 12px; }

/* tải ảnh */
.adm-imgs { margin-bottom: 8px; }
.adm-imgs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
.adm-img { display: flex; flex-direction: column; gap: 6px; }
.adm-img-thumb { position: relative; aspect-ratio: 4 / 3; border-radius: 8px; overflow: hidden; background: #efe9df; border: 1px solid var(--line); }
.adm-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.adm-img-badge { position: absolute; left: 6px; top: 6px; background: var(--primary); color: #fff; font-size: 10.5px; padding: 2px 7px; border-radius: 4px; }
.adm-img-actions { display: flex; gap: 6px; }
.adm-img-add {
  aspect-ratio: 4 / 3; border: 2px dashed #cfc8bb; border-radius: 8px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px; cursor: pointer; color: var(--ink-soft); font-size: 12.5px;
  text-align: center; padding: 6px; background: #faf7f2; transition: border-color .15s, background .15s;
}
.adm-img-add:hover, .adm-img-add.is-over { border-color: var(--primary); background: #f3ede3; }
.adm-img-add.is-disabled { opacity: .5; cursor: not-allowed; }
.adm-img-add input { display: none; }
.adm-img-plus { font-size: 26px; line-height: 1; color: var(--primary); }
.adm-imgs-url { display: flex; gap: 8px; margin-top: 10px; }

/* dự án */
.adm-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 12px; }
.adm-pcard { background: #fff; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.adm-pcard-img { position: relative; aspect-ratio: 16 / 10; background: #efe9df; }
.adm-pcard-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.adm-badge { position: absolute; top: 10px; left: 10px; background: #fff; border: 1px solid var(--line); font-size: 11px; padding: 3px 8px; border-radius: 4px; }
.adm-pcard-body { padding: 14px 16px 16px; }
.adm-pcard-body h3 { font-size: 16px; margin-bottom: 4px; }
.adm-pcard-body p { margin: 2px 0; }
.adm-pcard-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.adm-space { border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px 6px; margin-bottom: 14px; background: #fcfaf7; }
.adm-space-head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.adm-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: -4px 0 12px; }
.adm-chip { background: #e8f3ea; color: #1e5a2b; padding: 3px 10px; border-radius: 999px; font-size: 12px; }
.adm-chip.bad { background: #fbe9e7; color: #8c1d18; }

/* công cụ */
.adm-stats { margin: 6px 0 0; padding-left: 18px; line-height: 1.8; }
.adm-tool-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 10px 0; }
.adm-notes { margin: 6px 0 0; padding-left: 18px; line-height: 1.8; }
</style>
