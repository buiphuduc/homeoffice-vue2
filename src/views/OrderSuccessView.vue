<template>
  <div class="form-box" style="max-width:640px;margin:0 auto;">
    <h3 style="text-align:center;border:none;padding:0;">
      <i class="fa-solid fa-circle-check" style="color:var(--primary);"></i>
      Đơn hàng đã sẵn sàng gửi đi
    </h3>
    <p style="font-size:13.5px;color:var(--ink-soft);text-align:center;">
      Bấm "Sao chép" rồi dán nội dung vào cửa sổ Zalo/Messenger vừa mở, hoặc gọi trực tiếp cho shop.
    </p>

    <textarea class="order-text-box" readonly v-model="orderText" ref="orderTextArea"></textarea>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
      <button class="btn btn-outline" @click="copyText">
        <i class="fa-solid fa-copy"></i> Sao chép nội dung
      </button>
      <a class="btn btn-zalo" :href="zaloLink" target="_blank" rel="noopener" @click="onChannelClick">
        <i class="fa-solid fa-comment-dots"></i> Mở Zalo
      </a>
      <a class="btn btn-messenger" :href="messengerLink" target="_blank" rel="noopener" @click="onChannelClick">
        <i class="fa-brands fa-facebook-messenger"></i> Mở Messenger
      </a>
      <a class="btn btn-outline" :href="'tel:' + hotlineTel">
        <i class="fa-solid fa-phone"></i> Gọi {{ hotlineDisplay }}
      </a>
    </div>

    <router-link class="btn btn-block" style="margin-top:16px;background:#f1f0e8;" to="/">
      Về trang chủ
    </router-link>
  </div>
</template>

<script>
import orderService from '@/services/orderService';
import config from '@/config';

export default {
  name: 'OrderSuccessView',
  data() {
    return {
      hotlineDisplay: config.hotlineDisplay,
      hotlineTel: config.hotlineTel,
    };
  },
  computed: {
    orderText() {
      // Nội dung đơn được CheckoutView truyền qua khi điều hướng tới đây.
      // Nếu người dùng refresh trang này trực tiếp, params sẽ mất -> quay
      // lại trang chủ thay vì hiện trang trống gây hiểu lầm.
      return this.$route.params.orderText || '';
    },
    zaloLink() {
      return orderService.zaloLink;
    },
    messengerLink() {
      return orderService.messengerLink;
    },
  },
  created() {
    if (!this.orderText) {
      this.$router.replace('/');
      return;
    }
    // Tự động copy sẵn để khách chỉ cần dán ngay khi cửa sổ Zalo/Messenger mở ra
    this.copyText(true);
  },
  methods: {
    async copyText(silent) {
      const ok = await orderService.copyToClipboard(this.orderText, this.$refs.orderTextArea);
      if (ok && !silent) {
        this.$store.dispatch('toast/push', { title: 'Đã sao chép nội dung đơn hàng' });
      }
    },
    onChannelClick() {
      // Sau khi khách đã mở kênh liên hệ để gửi đơn, coi như giỏ hàng đã "chốt" -> xoá
      this.$store.dispatch('cart/clearCart');
    },
  },
};
</script>
