<template>
  <div class="adm-login">
    <form class="adm-card adm-login-card" @submit.prevent="submit">
      <h1>Tạo tài khoản quản trị đầu tiên</h1>
      <p class="adm-hint">
        Chỉ làm một lần. Nhập “Mã cài đặt” (mục <code>setup_key</code> trong file <code>api/config.php</code> trên hosting),
        rồi chọn email và mật khẩu cho tài khoản quản trị.
      </p>
      <label class="adm-field">
        <span>Mã cài đặt (setup_key)</span>
        <input class="adm-input" type="password" v-model="key" autocomplete="off" required>
      </label>
      <label class="adm-field">
        <span>Email</span>
        <input class="adm-input" type="email" v-model.trim="email" autocomplete="username" required>
      </label>
      <label class="adm-field">
        <span>Mật khẩu (ít nhất 8 ký tự)</span>
        <input class="adm-input" type="password" v-model="password" autocomplete="new-password" minlength="8" required>
      </label>
      <label class="adm-field">
        <span>Nhập lại mật khẩu</span>
        <input class="adm-input" type="password" v-model="again" autocomplete="new-password" minlength="8" required>
      </label>
      <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
      <button class="adm-btn adm-btn-primary adm-btn-block" :disabled="busy">
        {{ busy ? 'Đang tạo...' : 'Tạo tài khoản' }}
      </button>
    </form>
  </div>
</template>

<script>
import * as sb from '@/services/api';

export default {
  name: 'AdminSetup',
  data() {
    return {
      key: '', email: '', password: '', again: '', busy: false, error: '',
    };
  },
  methods: {
    async submit() {
      this.error = '';
      if (this.password !== this.again) { this.error = 'Hai mật khẩu nhập chưa giống nhau.'; return; }
      this.busy = true;
      try {
        await sb.setupFirstAdmin(this.key, this.email, this.password);
        this.$emit('done');
      } catch (e) {
        this.error = e.message;
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
