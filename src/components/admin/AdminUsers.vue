<template>
  <div class="adm-tools">
    <!-- ===== Chỉ tài khoản IT: quản lý tài khoản ===== -->
    <template v-if="isIT">
      <section class="adm-card">
        <h3>Tài khoản quản trị</h3>
        <p class="adm-hint">
          <b>Chỉ tài khoản IT</b> (duy nhất) mới thêm, xóa, đặt lại mật khẩu được cho tài khoản nhân viên.
          Nhân viên quản lý được sản phẩm và dự án nhưng không quản lý được tài khoản.
        </p>
        <p class="adm-alert adm-alert-err" v-if="error">{{ error }}</p>
        <div class="adm-table-wrap" v-if="admins.length">
          <table class="adm-table" style="min-width: 0">
            <thead><tr><th>Tên đăng nhập</th><th>Vai trò</th><th>Tạo lúc (UTC)</th><th></th></tr></thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id">
                <td><b>{{ a.username }}</b> <span class="adm-muted" v-if="a.me">(bạn)</span></td>
                <td>{{ a.role === 'it' ? 'IT (quản trị)' : 'Nhân viên' }}</td>
                <td class="adm-muted">{{ a.created_at }}</td>
                <td class="adm-td-actions">
                  <button type="button" class="adm-btn adm-btn-sm" v-if="a.role !== 'it'" @click="resetPw(a)">Đặt lại mật khẩu</button>
                  <button type="button" class="adm-btn adm-btn-sm adm-btn-danger" v-if="a.role !== 'it'" @click="removeAdmin(a)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="adm-card">
        <h3>Thêm tài khoản nhân viên</h3>
        <form class="adm-grid-2" @submit.prevent="add">
          <label class="adm-field">
            <span>Tên đăng nhập (chữ thường không dấu, số, . _ -)</span>
            <input class="adm-input" type="text" v-model.trim="newUsername" autocapitalize="none" spellcheck="false" placeholder="vd: mkt01" required>
          </label>
          <label class="adm-field">
            <span>Mật khẩu (ít nhất 8 ký tự)</span>
            <input class="adm-input" type="text" v-model="newPassword" minlength="8" autocomplete="off" required>
          </label>
          <div><button class="adm-btn adm-btn-primary" :disabled="busy">+ Thêm tài khoản</button></div>
        </form>
        <p class="adm-hint">Gửi mật khẩu cho người đó qua kênh riêng tư và nhắc họ đổi mật khẩu sau khi đăng nhập.</p>
      </section>
    </template>

    <section class="adm-card" v-else>
      <h3>Tài khoản của bạn</h3>
      <p class="adm-hint">Bạn là tài khoản nhân viên. Nếu cần thêm tài khoản hoặc quên mật khẩu, hãy liên hệ bộ phận IT.</p>
    </section>

    <!-- ===== Mọi tài khoản: đổi mật khẩu của mình ===== -->
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
  props: {
    role: { type: String, default: 'editor' }, // 'it' | 'editor' (từ máy chủ)
  },
  data() {
    return {
      admins: [], error: '', busy: false, msg: '', msgType: 'ok',
      newUsername: '', newPassword: '', oldPw: '', newPw: '',
    };
  },
  computed: {
    isIT() { return this.role === 'it'; },
  },
  created() { if (this.isIT) this.load(); },
  methods: {
    say(t, type = 'ok') { this.msg = t; this.msgType = type; },
    async load() {
      this.error = '';
      try { this.admins = (await sb.listAdmins()) || []; } catch (e) { this.error = e.message; }
    },
    async add() {
      this.busy = true; this.msg = '';
      try {
        await sb.addAdmin(this.newUsername, this.newPassword);
        this.say(`Đã thêm tài khoản ${this.newUsername.toLowerCase()}.`);
        this.newUsername = ''; this.newPassword = '';
        await this.load();
      } catch (e) { this.say(e.message, 'err'); } finally { this.busy = false; }
    },
    async removeAdmin(a) {
      if (!window.confirm(`Xóa tài khoản ${a.username}? Người này sẽ không đăng nhập được nữa.`)) return;
      this.msg = '';
      try { await sb.removeAdmin(a.id); this.say('Đã xóa tài khoản.'); await this.load(); } catch (e) { this.say(e.message, 'err'); }
    },
    async resetPw(a) {
      const pw = window.prompt(`Nhập mật khẩu mới cho "${a.username}" (ít nhất 8 ký tự):`);
      if (pw === null) return;
      this.msg = '';
      try {
        await sb.resetAdminPassword(a.id, pw);
        this.say(`Đã đặt lại mật khẩu cho ${a.username}. Người này sẽ bị đăng xuất và cần đăng nhập lại bằng mật khẩu mới.`);
      } catch (e) { this.say(e.message, 'err'); }
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
