<template>
  <div class="cart-container container">
    <h1 class="cart-page-title">Giỏ hàng</h1>

    <div v-if="items.length" class="cart-layout">
      <!-- Cột trái: Danh sách sản phẩm -->
      <div class="cart-list">
        <div class="cart-item" v-for="line in items" :key="line.lineKey">
          
          <!-- Ảnh sản phẩm -->
          <div class="cart-item-thumb">
            <img v-if="line.product.images[0]" :src="line.product.images[0]" :alt="line.product.name">
          </div>
          
          <!-- Thông tin & Công cụ -->
          <div class="cart-item-body">
            <div class="cart-item-top">
              <div class="cart-item-title">
                <router-link :to="{ name: 'product-detail', params: { id: line.productId } }">
                  {{ line.product.name }}
                </router-link>
                <!-- Phân loại / Màu sắc -->
                <div v-if="line.color" class="cart-item-variant">
                  <span class="color-dot"></span>
                  {{ line.color.name }}
                </div>
              </div>
              
              <!-- Nút Xóa -->
              <button class="btn-remove" @click="removeItem(line.lineKey)">
                ✕
              </button>
            </div>
            
            <div class="cart-item-bottom">
              <!-- Số lượng -->
              <div class="qty-box cart-qty">
                <button @click="updateQty(line.lineKey, line.qty - 1)">−</button>
                <input type="number" :value="line.qty" @change="updateQty(line.lineKey, $event.target.value)">
                <button @click="updateQty(line.lineKey, line.qty + 1)">+</button>
              </div>
              
              <!-- Thành tiền -->
              <div class="cart-item-price">
                {{ formatVND(line.product.effectivePrice * line.qty) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: Tóm tắt đơn hàng -->
      <div class="cart-summary-box">
        <h3>Tóm tắt đơn hàng</h3>
        
        <div class="summary-row">
          <span>Tạm tính</span>
          <span>{{ formatVND(total) }}</span>
        </div>
        <div class="summary-row">
          <span class="shipping-label">Phí vận chuyển dự kiến</span>
          <span>Miễn phí</span>
        </div>
        
        <hr class="summary-divider" />
        
        <div class="summary-row total">
          <span>Tổng cộng</span>
          <span>{{ formatVND(total) }}</span>
        </div>
        
        <router-link class="btn btn-primary btn-block checkout-btn" to="/thanh-toan">
          Tiến hành thanh toán
        </router-link>
        
        <div class="continue-shopping">
          <router-link to="/">Tiếp tục mua sắm</router-link>
        </div>
      </div>
    </div>

    <!-- Trạng thái trống -->
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

<style scoped>
/* Scoped CSS chỉ ảnh hưởng tới trang giỏ hàng, kết hợp biến từ main.css */
.cart-container {
  padding: 40px 18px 80px;
  max-width: 1200px; /* Giới hạn độ rộng đẹp hơn cho 2 cột */
}

.cart-page-title {
  font-size: 34px;
  font-weight: 300;
  margin: 0 0 40px 0;
  color: var(--ink);
  letter-spacing: -0.01em;
}

/* Layout 2 cột */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}
@media (min-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr 380px;
    gap: 60px;
  }
}

/* ---------------------------------
   1. CỘT TRÁI: DANH SÁCH ITEM
----------------------------------- */
.cart-list {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: flex;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}
.cart-item:first-child {
  padding-top: 0;
}

.cart-item-thumb {
  width: 110px;
  height: 110px;
  border-radius: 8px;
  background: var(--primary-light);
  overflow: hidden;
  flex-shrink: 0;
}
.cart-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply; /* Hòa trộn nền giúp ảnh thật hòa nhập tốt hơn */
}

.cart-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cart-item-title a {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
}

.cart-item-variant {
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-soft);
  text-transform: uppercase;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.05em;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d1cbc1; /* Màu xám tượng trưng */
}

.btn-remove {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--ink-soft);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}
.btn-remove:hover {
  color: var(--ink);
}


.cart-qty {
  height: 34px; /* Thu gọn box số lượng một chút */
  width: 100px;
}
.cart-qty button {
  background: transparent;
  width: 28px;
  height: 100%;
}
.cart-qty input {
  height: 100%;
  flex: 1;
}

.cart-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin-top: 16px;
  gap: 12px;
}

.cart-item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap; 
}

/* ÉP XUỐNG DÒNG TRÊN MOBILE (màn hình dưới 768px) */
@media (max-width: 767px) {
  .cart-item-bottom {
    flex-direction: column; /* Chuyển từ hàng ngang sang cột dọc */
    align-items: flex-start; /* Căn trái toàn bộ (nút số lượng & giá) */
    /* Nếu bạn muốn giá tiền nằm bên phải thì đổi thành: align-items: flex-end; */
  }

  .cart-item-price {
    margin-top: 4px; /* Thêm chút khoảng cách với nút số lượng phía trên */
  }
}

/* ---------------------------------
   2. CỘT PHẢI: SUMMARY BOX
----------------------------------- */
.cart-summary-box {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 40px rgba(139, 115, 85, 0.06); /* Đổ bóng nhẹ sang trọng */
  height: fit-content;
  position: sticky;
  top: 100px; /* Ghim dính khi cuộn */
}

.cart-summary-box h3 {
  font-size: 17px;
  font-weight: 500;
  margin: 0 0 24px 0;
  color: var(--ink);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  color: var(--ink-soft);
  margin-bottom: 16px;
  line-height: 1.5;
}
.shipping-label {
  max-width: 130px;
}

.summary-divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 20px 0;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 500;
  color: var(--ink);
  margin-top: 24px;
  margin-bottom: 24px;
  align-items: center;
}
.summary-row.total span:last-child {
  font-weight: 600;
}

.checkout-btn {
  padding: 16px;
  border-radius: 4px;
  font-size: 13px;
  letter-spacing: 0.05em;
  background-color: #8c7355; /* Đồng nhất mã màu nâu trong ảnh */
}

.continue-shopping {
  text-align: center;
  margin-top: 20px;
}
.continue-shopping a {
  font-size: 12.5px;
  color: var(--ink-soft);
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s;
}
.continue-shopping a:hover {
  color: var(--ink);
}
</style>