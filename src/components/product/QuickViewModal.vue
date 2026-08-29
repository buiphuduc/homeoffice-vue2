<template>
  <div class="overlay" v-if="product" @click.self="$emit('close')">
    <div class="modal">
      <button class="modal-close" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="qv-body">
        <product-gallery :images="product.images" :alt-text="product.name"></product-gallery>
        <div>
          <h2>{{ product.name }}</h2>
          <div class="pd-price-box">
            <span class="price">{{ formatVND(product.effectivePrice) }}</span>
            <span class="price-old" v-if="product.salePrice">{{ formatVND(product.price) }}</span>
          </div>
          <p>{{ product.shortDesc }}</p>
          <div class="pd-actions">
            <button class="btn btn-outline" @click="$emit('add-to-cart', product)">
              Thêm giỏ hàng
            </button>
            <router-link
              :to="{ name: 'product-detail', params: { id: product.id } }"
              class="btn btn-primary"
              @click.native="$emit('close')"
            >
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatVND } from '@/utils/format';
import ProductGallery from './ProductGallery.vue';

/**
 * Modal "Xem nhanh" — nhận product qua prop, product = null thì tự ẩn
 * (v-if ở thẻ ngoài cùng). Việc mở/đóng modal do component cha điều
 * khiển bằng cách set/xóa state, component này không tự giữ state riêng.
 */
export default {
  name: 'QuickViewModal',
  components: { ProductGallery },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  methods: {
    formatVND,
  },
};
</script>
