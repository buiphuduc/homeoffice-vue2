<template>
  <div>
    <h1 style="font-size:20px;">Sản phẩm yêu thích ({{ products.length }})</h1>

    <product-grid
      :products="products"
      :loading="false"
      empty-text="Bạn chưa có sản phẩm yêu thích nào."
      @add-to-cart="handleAddToCart"
      @wish="handleToggleWishlist"
      @quick-view="handleOpenQuickView"
    >
      <template #empty-action>
        <router-link class="btn btn-primary" to="/">Khám phá ngay</router-link>
      </template>
    </product-grid>

    <quick-view-modal :product="quickViewProduct" @close="handleCloseQuickView" @add-to-cart="handleAddToCart"></quick-view-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductGrid from '@/components/product/ProductGrid.vue';
import QuickViewModal from '@/components/product/QuickViewModal.vue';
import productActionsMixin from '@/mixins/productActions';

export default {
  name: 'WishlistView',
  components: { ProductGrid, QuickViewModal },
  mixins: [productActionsMixin],
  computed: {
    ...mapGetters('wishlist', ['products']),
  },
};
</script>
