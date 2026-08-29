<template>
  <div>
    <h1 style="font-size:20px;">Thông tin đặt hàng</h1>

    <div class="checkout-grid">
      <div class="form-box">
        <h3>Thông tin nhận hàng</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Họ tên *</label>
            <input v-model="form.name" :class="{ err: errors.name }">
            <span class="err-msg" v-if="errors.name">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label>Số điện thoại *</label>
            <input v-model="form.phone" :class="{ err: errors.phone }">
            <span class="err-msg" v-if="errors.phone">{{ errors.phone }}</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:12px;">
          <label>Địa chỉ nhận hàng *</label>
          <input v-model="form.address" :class="{ err: errors.address }">
          <span class="err-msg" v-if="errors.address">{{ errors.address }}</span>
        </div>
        <div class="form-group" style="margin-bottom:12px;">
          <label>Ghi chú</label>
          <textarea v-model="form.note" rows="3"></textarea>
        </div>
      </div>

      <div class="form-box" style="align-self:start;">
        <h3>Đơn hàng ({{ cartCount }} sản phẩm)</h3>
        <div
          v-for="line in cartItems"
          :key="line.lineKey"
          style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #f1f1ea;"
        >
          <span>{{ line.product.name }}<span v-if="line.color" style="color:var(--ink-soft);"> ({{ line.color.name }})</span> x{{ line.qty }}</span>
          <span class="price">{{ formatVND(line.product.effectivePrice * line.qty) }}</span>
        </div>
        <div class="row total" style="display:flex;justify-content:space-between;padding-top:12px;font-size:16px;font-weight:800;">
          <span>Tổng cộng</span><span class="price">{{ formatVND(cartTotal) }}</span>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:14px;" @click="submitOrder">
          Tạo đơn &amp; gửi qua Zalo/Messenger
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import orderService from '@/services/orderService';
import { formatVND } from '@/utils/format';

export default {
  name: 'CheckoutView',
  data() {
    return {
      form: { name: '', phone: '', address: '', note: '' },
      errors: {},
    };
  },
  computed: {
    ...mapState('cart', { cartItems: (state) => state.items }),
    ...mapGetters('cart', { cartTotal: 'total', cartCount: 'count' }),
  },
  created() {
    // Giỏ hàng trống mà vào thẳng /thanh-toan (vd gõ URL tay) -> đưa về giỏ hàng
    if (!this.cartItems.length) {
      this.$router.replace('/gio-hang');
    }
  },
  methods: {
    formatVND,
    validate() {
      const e = {};
      if (!this.form.name.trim()) e.name = 'Bắt buộc';
      if (!/^0\d{9}$/.test(this.form.phone.trim())) e.phone = 'Số điện thoại không hợp lệ';
      if (!this.form.address.trim()) e.address = 'Bắt buộc';
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    submitOrder() {
      if (!this.cartItems.length) {
        this.$store.dispatch('toast/push', { title: 'Giỏ hàng đang trống', type: 'err' });
        return;
      }
      if (!this.validate()) {
        this.$store.dispatch('toast/push', { title: 'Vui lòng kiểm tra lại thông tin', type: 'err' });
        return;
      }

      const orderText = orderService.buildOrderText({
        customer: this.form,
        cartItems: this.cartItems,
        total: this.cartTotal,
      });

      // Truyền nội dung đơn qua route params -> trang OrderSuccessView hiển thị lại
      this.$router.push({ name: 'order-success', params: { orderText } });
    },
  },
};
</script>
