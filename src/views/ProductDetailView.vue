<template>
  <div>
    <loading-spinner v-if="loading" text="Đang tải sản phẩm..."></loading-spinner>

    <template v-else-if="product">
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link> / <span>{{ product.name }}</span>
      </div>

      <div class="pd-wrap">
        <product-gallery :images="product.images" :alt-text="product.name"></product-gallery>

        <div class="pd-info">
          <h1>{{ product.name }}</h1>
          <div style="font-size:12.5px;color:var(--ink-soft);">
            SKU: {{ product.sku || '—' }} · {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
          </div>

          <div class="pd-price-box">
            <span class="price">{{ formatVND(product.effectivePrice) }}</span>
            <span class="price-old" v-if="product.salePrice" style="margin-left:8px;">
              {{ formatVND(product.price) }}
            </span>
          </div>

          <p style="font-size:13.5px;line-height:1.7;color:#444;">{{ product.shortDesc }}</p>

          <!-- Chọn màu / kiểu gỗ — chỉ hiện nếu sản phẩm có khai báo cột "Colors" trong Sheet -->
          <div v-if="product.colors.length" class="color-picker">
            <label class="color-picker-label">Màu: <b>{{ selectedColor ? selectedColor.name : '' }}</b></label>
            <div class="color-swatch-row">
              <button
                v-for="c in product.colors"
                :key="c.name"
                class="color-swatch"
                :class="{ active: selectedColor && selectedColor.name === c.name }"
                :title="c.name"
                @click="selectedColor = c"
              >
                <img v-if="c.image" :src="c.image" :alt="c.name">
                <span v-else class="color-swatch-fallback">{{ c.name.charAt(0) }}</span>
              </button>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:14px;margin-top:16px;">
            <div class="qty-box">
              <button @click="qty = Math.max(1, qty - 1)">−</button>
              <input type="number" v-model.number="qty" min="1">
              <button @click="qty++">+</button>
            </div>
          </div>

          <div class="pd-actions">
            <button class="btn btn-primary" :disabled="!product.inStock" @click="handleAddToCart(product, qty, selectedColor)">
              <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
            </button>
            <button class="btn btn-outline" @click="buyNow">Đặt ngay</button>
            <button class="qa-btn" :class="{ active: isWished(product.id) }" @click="handleToggleWishlist(product)">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>

          <!-- Chia sẻ mạng xã hội -->
          <div class="share-row">
            <span>Chia sẻ:</span>
            <a :href="shareLinks.facebook" target="_blank" rel="noopener" title="Chia sẻ Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a :href="shareLinks.twitter" target="_blank" rel="noopener" title="Chia sẻ Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
            <a :href="shareLinks.pinterest" target="_blank" rel="noopener" title="Ghim lên Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
          </div>
        </div>
      </div>

      <!-- Mô tả sản phẩm (thu gọn được) + Sản phẩm tương tự bên cạnh -->
      <div class="pd-desc-grid">
        <collapsible-section title="Mô tả sản phẩm" v-if="product.desc">
          <p style="white-space:pre-line;">{{ product.desc }}</p>
        </collapsible-section>

        <div class="similar-products-box" v-if="similarProducts.length">
          <h4>Sản phẩm tương tự</h4>
          <router-link
            v-for="sp in similarProducts"
            :key="sp.id"
            :to="{ name: 'product-detail', params: { id: sp.id } }"
            class="similar-item"
          >
            <div class="similar-thumb">
              <img v-if="sp.images[0]" :src="sp.images[0]" :alt="sp.name">
              <i v-else class="fa-solid fa-couch"></i>
            </div>
            <div>
              <div class="similar-name">{{ sp.name }}</div>
              <div class="price" style="font-size:13px;">{{ formatVND(sp.effectivePrice) }}</div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Chính sách vận chuyển + bảo hành — nội dung dùng chung mọi sản phẩm -->
      <shipping-warranty-policy></shipping-warranty-policy>
    </template>

    <empty-state v-else icon="fa-solid fa-triangle-exclamation" text="Không tìm thấy sản phẩm.">
      <router-link class="btn btn-primary" to="/">Về trang chủ</router-link>
    </empty-state>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import CollapsibleSection from '@/components/common/CollapsibleSection.vue';
import ProductGallery from '@/components/product/ProductGallery.vue';
import ShippingWarrantyPolicy from '@/components/product/ShippingWarrantyPolicy.vue';
import productActionsMixin from '@/mixins/productActions';
import { formatVND } from '@/utils/format';
import { productMatchesCategoryPath } from '@/utils/category';

export default {
  name: 'ProductDetailView',
  components: {
    LoadingSpinner, EmptyState, CollapsibleSection, ProductGallery, ShippingWarrantyPolicy,
  },
  mixins: [productActionsMixin],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      qty: 1,
      selectedColor: null,
    };
  },
  computed: {
    ...mapState('products', { loading: (state) => state.loading }),
    ...mapGetters('products', ['all', 'findById']),
    ...mapGetters('wishlist', ['isWished']),
    product() {
      return this.findById(this.id);
    },
    /** Sản phẩm tương tự: cùng danh mục cấp 1 với sản phẩm đang xem, loại trừ chính nó */
    similarProducts() {
      if (!this.product || !this.product.categoryPaths.length) return [];
      const topCat = this.product.categoryPaths[0][0];
      return this.all
        .filter((p) => p.id !== this.product.id && productMatchesCategoryPath(p, [topCat]))
        .slice(0, 4);
    },
    shareLinks() {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(this.product ? this.product.name : '');
      return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
      };
    },
  },
  watch: {
    product(p) {
      this.qty = 1; // đổi sang sản phẩm khác -> reset số lượng
      this.selectedColor = p && p.colors.length ? p.colors[0] : null;
    },
  },
  created() {
    if (this.product && this.product.colors.length) {
      this.selectedColor = this.product.colors[0]; // mặc định chọn màu đầu tiên
    }
  },
  methods: {
    formatVND,
    buyNow() {
      this.handleAddToCart(this.product, this.qty, this.selectedColor);
      this.$router.push({ name: 'checkout' });
    },
  },
};
</script>
