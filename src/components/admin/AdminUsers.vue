<template>
  <div class="adm-tools">
    <section class="adm-card">
      <h3>Tài khoản quản trị</h3>
      <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
      <div class="adm-table-wrap" v-if="admins.length">
        <table class="adm-table" style="min-width: 0">
          <thead><tr><th>Email</th><th>Tạo lúc (UTC)</th><th></th></tr></thead>
          <tbody>
            <tr v-for="a in admins" :key="a.id">
              <td><b>{{ a.email }}</b> <span class="adm-muted" v-if="a.me">(bạn)</span></td>
              <td class="adm-muted">{{ a.created_at }}</td>
              <td class="adm-td-actions">
                <button type="button" class="adm-btn adm-btn-sm adm-btn-danger" :disabled="a.me" @click="removeAdmin(a)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="adm-card">
      <h3>Thêm tài khoản</h3>
      <form class="adm-grid-2" @submit.prevent="add">
        <label class="adm-field"><span>Email</span><input class="adm-input" type="email" v-model.trim="newEmail" required></label>
        <label class="adm-field"><span>Mật khẩu (ít nhất 8 ký tự)</span><input class="adm-input" type="text" v-model="newPassword" minlength="8" autocomplete="off" required></label>
        <div><button class="adm-btn adm-btn-primary" :disabled="busy">+ Thêm tài khoản</button></div>
      </form>
    </section>

    <section class="adm-card">
      <h3>Đổi mật khẩu của tôi</h3>
      <form class="adm-grid-2" @submit.prevent="changePw">
        <label class="adm-field"><span>Mật khẩu hiện tại</span><input class="adm-input" type="password" v-model="oldPw" autocomplete="current-password" required></label>
        <label class="adm-field"><span>Mật khẩu mới (ít nhất 8 ký tự)</span><input class="adm-input" type="password" v-model="newPw" autocomplete="new-password" minlength="8" required></label>
        <div><button class="adm-btn" :disabled="busy">Đổi mật khẩu</button></div>
      </form>
    </section>

    <p class="adm-alert" :class="msgType === 'err' ? 'adm-alert-err' : 'adm-alert-ok'" v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import * as sb from '@/services/api';

export default {
  name: 'AdminUsers',
  data() {
    return {
      admins: [], error: '', busy: false, msg: '', msgType: 'ok',
      newEmail: '', newPassword: '', oldPw: '', newPw: '',
    };
  },
  created() { this.load(); },
  methods: {
    say(t, type = 'ok') { this.msg = t; this.msgType = type; },
    async load() {
      this.error = '';
      try { this.admins = (await sb.listAdmins()) || []; } catch (e) { this.error = e.message; }
    },
    async add() {
      this.busy = true; this.msg = '';
      try {
        await sb.addAdmin(this.newEmail, this.newPassword);
        this.say(`Đã thêm tài khoản ${this.newEmail}.`);
        this.newEmail = ''; this.newPassword = '';
        await this.load();
      } catch (e) { this.say(e.message, 'err'); } finally { this.busy = false; }
    },
    async removeAdmin(a) {
      if (!window.confirm(`Xóa tài khoản ${a.email}? Người này sẽ không đăng nhập được nữa.`)) return;
      this.msg = '';
      try { await sb.removeAdmin(a.id); this.say('Đã xóa tài khoản.'); await this.load(); } catch (e) { this.say(e.message, 'err'); }
    },
    async changePw() {
      this.busy = true; this.msg = '';
      try {
        await sb.changePassword(this.oldPw, this.newPw);
        this.oldPw = ''; this.newPw = '';
        this.say('Đã đổi mật khẩu. Các thiết bị khác đang đăng nhập bằng tài khoản này sẽ bị đăng xuất.');
      } catch (e) { this.say(e.message, 'err'); } finally { this.busy = false; }
    },
  },
};
</script>
