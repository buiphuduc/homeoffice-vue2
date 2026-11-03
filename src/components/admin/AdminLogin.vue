<template>
  <div class="adm-login">
    <form class="adm-card adm-login-card" @submit.prevent="submit">
      <h1>Quản trị HTM</h1>
      <p class="adm-hint">Đăng nhập để thêm, sửa, xóa sản phẩm và dự án.</p>
      <label class="adm-field">
        <span>Email</span>
        <input class="adm-input" type="email" v-model.trim="email" autocomplete="username" required>
      </label>
      <label class="adm-field">
        <span>Mật khẩu</span>
        <input class="adm-input" type="password" v-model="password" autocomplete="current-password" required>
      </label>
      <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
      <button class="adm-btn adm-btn-primary adm-btn-block" :disabled="busy">
        {{ busy ? 'Đang đăng nhập...' : 'Đăng nhập' }}
      </button>
    </form>
  </div>
</template>

<script>
import * as sb from '@/services/api';

export default {
  name: 'AdminLogin',
  data() {
    return { email: '', password: '', busy: false, error: '' };
  },
  methods: {
    async submit() {
      this.busy = true;
      this.error = '';
      try {
        await sb.signIn(this.email, this.password);
        this.$emit('logged-in');
      } catch (e) {
        this.error = e.message || 'Đăng nhập không thành công.';
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
