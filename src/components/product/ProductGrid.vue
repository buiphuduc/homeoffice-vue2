<template>
  <div>
    <loading-spinner v-if="loading" :text="loadingText"></loading-spinner>

    <div class="grid" v-else-if="products.length">
      <product-card
        v-for="p in products"
        :key="p.id"
        :product="p"
        :is-wished="isWished(p.id)"
        @add-to-cart="$emit('add-to-cart', $event)"
        @wish="$emit('wish', $event)"
        @quick-view="$emit('quick-view', $event)"
      ></product-card>
    </div>

    <empty-state v-else :text="emptyText">
      <slot name="empty-action"></slot>
    </empty-state>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from './ProductCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';

/**
 * Khối lưới sản phẩm dùng chung — gộp sẵn 3 trạng thái (đang tải / có
 * sản phẩm / rỗng) để các view (HomeView, ListingView, WishlistView...)
 * không phải lặp lại đoạn v-if/v-else-if/v-else giống nhau ở mỗi nơi.
 */
export default {
  name: 'ProductGrid',
  components: { ProductCard, LoadingSpinner, EmptyState },
  props: {
    products: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: 'Đang tải sản phẩm...',
    },
    emptyText: {
      type: String,
      default: 'Không có sản phẩm nào.',
    },
  },
  computed: {
    ...mapGetters('wishlist', ['isWished']),
  },
};
</script>
