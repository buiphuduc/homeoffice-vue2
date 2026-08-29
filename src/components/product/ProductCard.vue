<template>
  <div class="card">
    <div class="badges">
      <span class="badge badge-sale" v-if="product.salePrice">-{{ discountPercent }}%</span>
    </div>

    <div class="quick-actions">
      <button
        class="qa-btn"
        :class="{ active: isWished }"
        title="Yêu thích"
        @click="$emit('wish', product)"
      >
        <i class="fa-solid fa-heart"></i>
      </button>
      <button class="qa-btn" title="Xem nhanh" @click="$emit('quick-view', product)">
        <i class="fa-solid fa-eye"></i>
      </button>
    </div>

    <router-link :to="detailLink" class="thumb">
      <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name">
      <i v-else class="fa-solid fa-couch"></i>
    </router-link>

    <div class="info">
      <router-link :to="detailLink" class="name">{{ product.name }}</router-link>
      <div>
        <span class="price">{{ formatVND(product.effectivePrice) }}</span>
        <span class="price-old" v-if="product.salePrice">{{ formatVND(product.price) }}</span>
      </div>
    </div>

    <div class="addbar">
      <button
        class="btn btn-primary"
        :disabled="!product.inStock"
        @click="handleQuickAdd"
      >
        {{ product.inStock ? 'Thêm vào giỏ' : 'Hết hàng' }}
      </button>
    </div>
  </div>
</template>

<script>
import { formatVND, calcDiscountPercent } from '@/utils/format';

/**
 * Thẻ sản phẩm — dùng lại ở TẤT CẢ các trang có hiển thị danh sách sản
 * phẩm (trang chủ, danh mục, yêu thích, sản phẩm liên quan...). Component
 * này KHÔNG tự xử lý logic thêm giỏ hàng/yêu thích — chỉ phát ra sự kiện
 * (emit) để component cha (view) quyết định làm gì, giữ component này
 * "ngu" và dễ tái sử dụng ở bất kỳ đâu.
 */
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
    isWished: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    discountPercent() {
      return calcDiscountPercent(this.product.price, this.product.salePrice);
    },
    detailLink() {
      return { name: 'product-detail', params: { id: this.product.id } };
    },
  },
  methods: {
    formatVND,
    handleQuickAdd() {
      // Thêm nhanh từ lưới sản phẩm (không qua trang chi tiết) -> nếu sản
      // phẩm có nhiều màu, tự lấy màu đầu tiên làm mặc định, tránh thêm
      // vào giỏ mà không rõ khách muốn màu nào.
      const defaultColor = this.product.colors.length ? this.product.colors[0] : null;
      this.$emit('add-to-cart', this.product, 1, defaultColor);
    },
  },
};
</script>
