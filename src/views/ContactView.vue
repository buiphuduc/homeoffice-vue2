<template>
  <div class="container contact-view">
    <div class="contact-hero" v-reveal>
      <h1>Liên hệ</h1>
      <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong việc kiến tạo không gian sống hoàn hảo mang đậm phong cách Bắc Âu.</p>
    </div>

    <div class="contact-grid">
      <!-- ===== Form gửi tin nhắn ===== -->
      <div class="contact-form-card" v-reveal>
        <h3>Gửi tin nhắn</h3>
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="cf-field">
            <label for="cf-name">Tên của bạn</label>
            <input
              id="cf-name"
              v-model.trim="form.name"
              type="text"
              placeholder="Nguyễn Văn A"
              :class="{ 'cf-err': errors.name }"
            >
            <span class="cf-err-msg" v-if="errors.name">{{ errors.name }}</span>
          </div>

          <div class="cf-field">
            <label for="cf-phone">Số điện thoại</label>
            <input
              id="cf-phone"
              v-model.trim="form.phone"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="0912 345 678"
              :class="{ 'cf-err': errors.phone }"
            >
            <span class="cf-err-msg" v-if="errors.phone">{{ errors.phone }}</span>
          </div>

          <div class="cf-field">
            <label for="cf-email">Email</label>
            <input
              id="cf-email"
              v-model.trim="form.email"
              type="email"
              placeholder="email@example.com"
              :class="{ 'cf-err': errors.email }"
            >
            <span class="cf-err-msg" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="cf-field">
            <label for="cf-message">Tin nhắn</label>
            <textarea
              id="cf-message"
              v-model.trim="form.message"
              rows="4"
              placeholder="Bạn cần hỗ trợ điều gì?"
              :class="{ 'cf-err': errors.message }"
            ></textarea>
            <span class="cf-err-msg" v-if="errors.message">{{ errors.message }}</span>
          </div>

          <!-- Ô "bẫy" chống bot spam: người thật không thấy nên không điền; bot điền -> bị bỏ qua -->
          <input v-model="form.website" type="text" name="website" class="cf-honey" tabindex="-1" autocomplete="off" aria-hidden="true">

          <button type="submit" class="btn btn-primary" :disabled="sending">
            <i class="fa-solid" :class="sending ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
            {{ sending ? 'Đang gửi...' : 'Gửi tin nhắn' }}
          </button>
          <p class="cf-hint">Tin nhắn sẽ được gửi trực tiếp tới email của {{ company.legalName }}. Chúng tôi sẽ liên hệ lại qua số điện thoại hoặc email bạn cung cấp.</p>
        </form>
      </div>

      <!-- ===== Bản đồ + thông tin liên hệ ===== -->
      <div class="contact-side" v-reveal="80">
        <div class="contact-map">
          <iframe
            :src="mapEmbedUrl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Bản đồ vị trí công ty"
          ></iframe>
        </div>

        <div class="contact-info-card">
          <div class="ci-row">
            <span class="ci-icon"><i class="fa-solid fa-location-dot"></i></span>
            <div>
              <div class="ci-label">Showroom</div>
              <div class="ci-value">
                <strong>{{ company.legalName }}</strong><br>
                {{ company.address }}
              </div>
            </div>
          </div>

          <div class="ci-row">
            <span class="ci-icon"><i class="fa-solid fa-phone"></i></span>
            <div>
              <div class="ci-label">Điện thoại</div>
              <div class="ci-value"><a :href="'tel:' + company.phoneTel">{{ company.phoneDisplay }}</a></div>
            </div>
          </div>

          <div class="ci-row">
            <span class="ci-icon"><i class="fa-solid fa-envelope"></i></span>
            <div>
              <div class="ci-label">Email</div>
              <div class="ci-value"><a :href="'mailto:' + company.email">{{ company.email }}</a></div>
            </div>
          </div>

          <div class="ci-row">
            <span class="ci-icon"><i class="fa-solid fa-file-invoice"></i></span>
            <div>
              <div class="ci-label">Mã số thuế</div>
              <div class="ci-value">{{ company.taxCode }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import siteContent from '@/content/siteContent';
import config from '@/config';

/**
 * src/views/ContactView.vue
 * ------------------------------------------------------------------
 * Trang Liên hệ — bố cục 2 cột: form gửi tin nhắn bên trái, bản đồ +
 * thông tin công ty thật bên phải. Thông tin công ty lấy từ
 * `siteContent.companyInfo` (KHÔNG khai báo cứng ở đây).
 *
 * GỬI FORM: tự dựng backend bằng Google Apps Script (miễn phí, do
 * chính bạn quản lý, không phụ thuộc dịch vụ ngoài) — xem hướng dẫn
 * triển khai đầy đủ trong file google-apps-script/Code.gs ở gốc repo.
 * Sau khi deploy, dán URL Web App vào .env:
 *   VUE_APP_CONTACT_SCRIPT_URL=https://script.google.com/macros/s/xxx/exec
 * Trình duyệt POST JSON tới URL đó, Apps Script gửi email vào Gmail
 * công ty (kèm Reply-To = email khách) và tuỳ chọn ghi log vào Google
 * Sheet. Email nhận được cấu hình NGAY TRONG Code.gs (biến TO_EMAIL,
 * đang để email test) — sửa ở đó khi test xong, không phải sửa web.
 *
 * LƯU Ý QUAN TRỌNG VỀ CORS: Google Apps Script Web App không tự thêm
 * header CORS cho request có Content-Type: application/json — vì vậy
 * request gửi đi với Content-Type: text/plain (giữ nguyên body JSON)
 * để trở thành "simple request", trình duyệt không gửi preflight
 * OPTIONS (Apps Script không xử lý OPTIONS) và Google vẫn cho đọc
 * response bình thường. Đừng đổi lại thành application/json.
 * ------------------------------------------------------------------
 */
const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

export default {
  name: 'ContactView',
  data() {
    return {
      company: siteContent.companyInfo,
      form: { name: '', phone: '', email: '', message: '', website: '' },
      errors: {},
      sending: false,
    };
  },
  computed: {
    mapEmbedUrl() {
      return `https://www.google.com/maps?q=${encodeURIComponent(this.company.mapQuery)}&output=embed`;
    },
  },
  methods: {
    validate() {
      const e = {};
      if (!this.form.name) e.name = 'Vui lòng nhập tên của bạn';
      const phone = this.form.phone.replace(/[\s.-]/g, '');
      if (!phone) {
        e.phone = 'Vui lòng nhập số điện thoại';
      } else if (!PHONE_REGEX.test(phone)) {
        e.phone = 'Số điện thoại không hợp lệ (vd 0912345678)';
      }
      if (!this.form.email) {
        e.email = 'Vui lòng nhập email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        e.email = 'Email không hợp lệ';
      }
      if (!this.form.message) e.message = 'Vui lòng nhập nội dung cần hỗ trợ';
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    async handleSubmit() {
      if (this.sending) return;
      if (!this.validate()) {
        this.$store.dispatch('toast/push', { title: 'Vui lòng kiểm tra lại thông tin', type: 'err' });
        return;
      }
      // Bot điền ô bẫy -> giả vờ thành công, không gửi gì cả
      if (this.form.website) {
        this.resetForm();
        return;
      }

      if (!config.contactScriptUrl) {
        this.$store.dispatch('toast/push', {
          title: 'Form Liên hệ chưa được cấu hình',
          desc: 'Thiếu VUE_APP_CONTACT_SCRIPT_URL trong .env — xem hướng dẫn trong google-apps-script/Code.gs.',
          type: 'err',
        });
        return;
      }

      this.sending = true;
      try {
        // Content-Type text/plain (không phải application/json) là CỐ Ý —
        // xem ghi chú CORS ở đầu file. Apps Script vẫn tự parse được JSON
        // từ e.postData.contents phía server.
        const res = await fetch(config.contactScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            message: this.form.message,
            website: this.form.website, // ô bẫy chống bot, kiểm tra lại ở server
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
          throw new Error(data.message || `HTTP ${res.status}`);
        }

        this.$store.dispatch('toast/push', {
          title: 'Đã gửi tin nhắn thành công',
          desc: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
        });
        this.resetForm();
      } catch (err) {
        this.$store.dispatch('toast/push', {
          title: 'Gửi tin nhắn chưa thành công',
          desc: `Vui lòng thử lại hoặc gọi hotline ${this.company.phoneDisplay}.`,
          type: 'err',
        });
      } finally {
        this.sending = false;
      }
    },
    resetForm() {
      this.form = { name: '', phone: '', email: '', message: '', website: '' };
      this.errors = {};
    },
  },
};
</script>

<style scoped>
.contact-view{ padding:32px 0 64px; }

.contact-hero{ max-width:640px; margin-bottom:32px; }
.contact-hero h1{ font-size:32px; font-weight:400; margin:0 0 10px; letter-spacing:-.01em; color:var(--ink); }
.contact-hero p{ margin:0; font-size:14px; line-height:1.7; color:var(--ink-soft); }

.contact-grid{
  display:grid; grid-template-columns:1fr; gap:24px;
}
@media (min-width:900px){
  .contact-grid{ grid-template-columns:1fr 1fr;}
}

/* ---------- Form gửi tin nhắn ---------- */
.contact-form-card{
  background:var(--primary-light); border-radius:var(--radius); padding:28px;
}
.contact-form-card h3{ margin:0 0 22px; font-size:17px; font-weight:600; color:var(--ink); }
.cf-field{ margin-bottom:20px; }
.cf-field label{ display:block; font-size:16px; font-weight:700; color:var(--ink); margin-bottom:8px; }
.cf-field input,
.cf-field textarea{
  width:100%; border:none; border-bottom:1.5px solid var(--line); background:transparent;
  padding:6px 2px 10px; font-size:16px; color:var(--ink); font-family:inherit; outline:none;
  transition:border-color .2s; resize:vertical;
}
.cf-field input::placeholder,
.cf-field textarea::placeholder{ color:#a79b8c; }
.cf-field input:focus,
.cf-field textarea:focus{ border-color:var(--primary); }
.cf-field input.cf-err,
.cf-field textarea.cf-err{ border-color:#c0392b; }
.cf-err-msg{ display:block; margin-top:6px; font-size:11.5px; color:#c0392b; }
.contact-form-card .btn{ margin-top:4px; }
.cf-honey{ position:absolute; left:-9999px; width:1px; height:1px; opacity:0; pointer-events:none; }
.cf-hint{ margin:10px 0 0; font-size:11.5px; line-height:1.6; color:var(--ink-soft); }

/* ---------- Bản đồ + thông tin ---------- */
.contact-side{ display:flex; flex-direction:column; gap:16px; }
.contact-map{
  border-radius:var(--radius); overflow:hidden; border:1px solid var(--line);
  aspect-ratio:16/10; background:var(--primary-light);
}
.contact-map iframe{ width:100%; height:100%; border:0; display:block; }

.contact-info-card{
  background:var(--primary-light); border-radius:var(--radius); padding:6px 22px;
}
.ci-row{
  display:flex; gap:14px; align-items:flex-start; padding:18px 0;
  border-bottom:1px solid rgba(139,115,85,.18);
}
.ci-row:last-child{ border-bottom:none; }
.ci-icon{
  flex:none; width:34px; height:34px; border-radius:50%; background:var(--primary); color:#fff;
  display:flex; align-items:center; justify-content:center; font-size:13px; margin-top:2px;
}
.ci-label{ font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.03em; color:var(--ink-soft); margin-bottom:4px; }
.ci-value{ font-size:13.5px; line-height:1.6; color:var(--ink); }
.ci-value a{ color:var(--ink); }
.ci-value a:hover{ color:var(--primary); }
</style>