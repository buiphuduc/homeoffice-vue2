<template>
  <div>
    <h1 style="font-size:20px;">Giỏ hàng của bạn</h1>

    <div v-if="items.length" style="display:grid;gap:20px;">
      <table class="cart-table">
        <thead>
          <tr><th>Sản phẩm</th><th>Đơn giá</th><th>SL</th><th>Thành tiền</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="line in items" :key="line.lineKey">
            <td>
              <div class="cart-line">
                <div class="cart-thumb">
                  <img v-if="line.product.images[0]" :src="line.product.images[0]">
                </div>
                <div>
                  <router-link :to="{ name: 'product-detail', params: { id: line.productId } }" style="font-weight:600;">
                    {{ line.product.name }}
                  </router-link>
                  <div v-if="line.color" style="font-size:12px;color:var(--ink-soft);">Màu: {{ line.color.name }}</div>
                </div>
              </div>
            </td>
            <td class="price">{{ formatVND(line.product.effectivePrice) }}</td>
            <td>
              <div class="qty-box">
                <button @click="updateQty(line.lineKey, line.qty - 1)">−</button>
                <input type="number" :value="line.qty" @change="updateQty(line.lineKey, $event.target.value)">
                <button @click="updateQty(line.lineKey, line.qty + 1)">+</button>
              </div>
            </td>
            <td class="price">{{ formatVND(line.product.effectivePrice * line.qty) }}</td>
            <td>
              <button style="background:none;border:none;color:var(--accent);cursor:pointer;" @click="removeItem(line.lineKey)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <h3 style="margin-top:0;">Tóm tắt đơn hàng</h3>
        <div class="row total"><span>Tổng cộng</span><span>{{ formatVND(total) }}</span></div>
        <router-link class="btn btn-primary btn-block" style="margin-top:10px;" to="/thanh-toan">
          Tiến hành đặt hàng
        </router-link>
      </div>
    </div>

    <empty-state v-else icon="fa-solid fa-cart-shopping" text="Giỏ hàng đang trống.">
      <router-link class="btn btn-primary" to="/">Khám phá sản phẩm</router-link>
    </empty-state>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EmptyState from '@/components/common/EmptyState.vue';
import { formatVND } from '@/utils/format';

export default {
  name: 'CartView',
  components: { EmptyState },
  computed: {
    ...mapState('cart', { items: (state) => state.items }),
    ...mapGetters('cart', { total: 'total' }),
  },
  methods: {
    formatVND,
    updateQty(lineKey, val) {
      const qty = parseInt(val, 10);
      this.$store.dispatch('cart/updateQty', { lineKey, qty });
    },
    removeItem(lineKey) {
      this.$store.dispatch('cart/removeItem', lineKey);
    },
  },
};
</script>
