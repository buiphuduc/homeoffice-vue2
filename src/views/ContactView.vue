<template>
  <div class="container contact-view">
    <div class="contact-hero" v-reveal>
      <h1>Liên hệ</h1>
      <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong việc kiến tạo không gian sống hoàn hảo mang đậm phong cách của bạn.</p>
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

          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-paper-plane"></i> Gửi tin nhắn
          </button>
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
import orderService from '@/services/orderService';

/**
 * src/views/ContactView.vue
 * ------------------------------------------------------------------
 * Trang Liên hệ — bố cục 2 cột: form gửi tin nhắn bên trái, bản đồ +
 * thông tin công ty thật bên phải. Thông tin công ty lấy từ
 * `siteContent.companyInfo` (KHÔNG khai báo cứng ở đây) — muốn đổi địa
 * chỉ/email/hotline thì sửa ở src/content/siteContent.js (hotline lấy
 * chung từ .env qua config.js), trang này tự cập nhật theo.
 *
 * Dự án không có backend nhận tin nhắn thật, nên "Gửi tin nhắn" sẽ mở
 * sẵn email tới địa chỉ công ty kèm nội dung khách vừa nhập (giống cách
 * trang Thanh toán "gửi đơn" qua Zalo/Messenger) và copy nội dung vào
 * clipboard để phòng khi trình duyệt chặn mailto tự mở.
 * ------------------------------------------------------------------
 */
export default {
  name: 'ContactView',
  data() {
    return {
      company: siteContent.companyInfo,
      form: { name: '', email: '', message: '' },
      errors: {},
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
      if (!this.validate()) {
        this.$store.dispatch('toast/push', { title: 'Vui lòng kiểm tra lại thông tin', type: 'err' });
        return;
      }

      const text = [
        `TIN NHẮN LIÊN HỆ - ${this.company.legalName}`,
        '------------------------------',
        `Tên: ${this.form.name}`,
        `Email: ${this.form.email}`,
        '',
        this.form.message,
      ].join('\n');

      await orderService.copyToClipboard(text);

      const subject = encodeURIComponent(`Liên hệ từ website - ${this.form.name}`);
      const body = encodeURIComponent(text);
      window.location.href = `mailto:${this.company.email}?subject=${subject}&body=${body}`;

      this.$store.dispatch('toast/push', {
        title: 'Đã mở ứng dụng email của bạn',
        desc: 'Nội dung tin nhắn đã được điền sẵn, chỉ cần bấm gửi. (Đã sao chép sẵn vào clipboard phòng khi cần dán tay.)',
      });

      this.form = { name: '', email: '', message: '' };
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
