<template>
  <div class="product-detail-page">
    <loading-spinner v-if="loading" text="Đang tải sản phẩm..."></loading-spinner>

    <template v-else-if="product">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link> / <span>{{ product.name }}</span>
      </div>

      <div class="pd-wrap">
        <!-- CỘT TRÁI: Gallery hình ảnh -->
        <product-gallery class="product-gallery-section" :images="product.images" :alt-text="product.name"></product-gallery>

        <!-- CỘT PHẢI: Thông tin sản phẩm -->
        <div class="pd-info">
          
          <h1 class="product-title">{{ product.name }}</h1>
          
          <!-- RATING -->
          <div class="product-rating">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :style="{ opacity: i <= Math.round(product.rating || 5) ? 1 : 0.3 }">★</span>
            </div>
            <span class="rating-text">
              {{ product.rating || '4.8' }} ({{ product.reviewCount || product['Review count'] || '124' }} đánh giá)
            </span>
          </div>

          <!-- GIÁ BÁN -->
          <div class="product-price-box">
            <span class="price">{{ formatVND(product.effectivePrice || product['Sale price'] || product['Regular price']) }}</span>
            <span class="price-old" v-if="product.salePrice || product['Sale price']">
              {{ formatVND(product.price || product['Regular price']) }}
            </span>
          </div>
          
          <div class="tax-shipping-note">
            Giá đã bao gồm thuế. Phí vận chuyển tính theo khu vực giao hàng —
            <router-link :to="{ name: 'legal-page', params: { slug: 'van-chuyen' } }" class="policy-link">xem chính sách vận chuyển</router-link>.
          </div>

          <hr class="divider" />

          <!-- CHỌN MÀU -->
          <div v-if="productColors.length" class="option-group">
            <label class="option-label">MÀU</label>
            <div class="color-options">
              <button
                v-for="c in productColors"
                :key="c.name"
                class="color-swatch"
                :class="{ active: selectedColor && selectedColor.name === c.name }"
                :style="{ backgroundColor: getColorCode(c.name) }"
                :title="c.name"
                @click="selectedColor = c"
              ></button>
            </div>
          </div>

          <!-- CHỌN CHẤT LIỆU -->
          <div v-if="productMaterials.length" class="option-group">
            <label class="option-label">CHẤT LIỆU</label>
            <div class="material-options">
              <button 
                v-for="(mat, index) in productMaterials" 
                :key="index"
                :class="['material-btn', { active: selectedMaterial === mat }]"
                @click="selectedMaterial = mat"
              >
                {{ mat }}
              </button>
            </div>
          </div>

          <!-- KÍCH THƯỚC (Quy đổi mm -> cm) -->
          <div class="option-group" v-if="formatDimensions">
            <label class="option-label">KÍCH THƯỚC ( DÀI X RỘNG X CAO )</label>
            <div class="dimension-box">
              {{ formatDimensions }}
            </div>
          </div>

          <!-- SỐ LƯỢNG & NÚT THÊM VÀO GIỎ / YÊU THÍCH -->
          <div class="action-group">
            <div class="qty-box">
              <button @click="qty = Math.max(1, qty - 1)">−</button>
              <input type="text" :value="qty" readonly>
              <button @click="qty++">+</button>
            </div>
            
            <button class="btn-add-to-cart" :disabled="!product.inStock && product['In stock'] !== 'Yes'" @click="handleAddToCart(product, qty, selectedColor)">
              <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Thêm vào giỏ hàng
            </button>

            <!-- Yêu thích -->
            <button class="qa-btn" :class="{ active: isWished(product.id) }" @click="handleToggleWishlist(product)" title="Yêu thích">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>

          <!-- THÔNG TIN META (Giao hàng, Bảo hành) -->
          <div class="meta-info">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
              Giao hàng {{ product.deliveryTime || product['Delivery time'] || '3-5 ngày' }}
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Bảo hành {{ product.warranty || product['Warranty (months)'] ? (product.warranty || product['Warranty (months)']) + ' tháng' : '10 năm' }}
            </div>
          </div>
          
          <div style="margin-top: 10px;">
             <button class="btn-buy-now" @click="buyNow">Đặt ngay</button>
          </div>

          <!-- CHIA SẺ -->
          <div class="share-row">
            <span>Chia sẻ:</span>
            <a :href="shareLinks.facebook" target="_blank" rel="noopener" title="Chia sẻ Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a :href="shareLinks.twitter" target="_blank" rel="noopener" title="Chia sẻ Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
            <a :href="shareLinks.pinterest" target="_blank" rel="noopener" title="Ghim lên Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
          </div>
          
        </div>
      </div>

      <!-- MÔ TẢ VÀ SẢN PHẨM TƯƠNG TỰ -->
      <div class="pd-desc-grid">
        <collapsible-section title="Mô tả sản phẩm" v-if="product.desc || product['Description']">
          <p style="white-space:pre-line; margin-bottom: 15px; font-weight: 500;">{{ product.shortDesc || product['Short description'] }}</p>
          <div v-html="product.desc || product['Description']" class="html-desc-content"></div>
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
              <img v-if="sp.images && sp.images[0]" :src="sp.images[0]" :alt="sp.name">
              <i v-else class="fa-solid fa-couch"></i>
            </div>
            <div>
              <div class="similar-name">{{ sp.name }}</div>
              <div class="price" style="font-size:13px;">{{ formatVND(sp.effectivePrice) }}</div>
            </div>
          </router-link>
        </div>
      </div>

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
import { setPageMeta } from '@/utils/seo';

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
      selectedMaterial: null
    };
  },
  computed: {
    ...mapState('products', { loading: (state) => state.loading }),
    ...mapGetters('products', ['all', 'findById']),
    ...mapGetters('wishlist', ['isWished']),
    product() {
      return this.findById(this.id);
    },
    productColors() {
      if (!this.product) return [];
      const colorsField = this.product.colors || this.product['Colors'];
      if (!colorsField) return [];

      if (Array.isArray(colorsField)) {
        if (colorsField.length === 1 && colorsField[0].name && colorsField[0].name.includes(',')) {
          return colorsField[0].name.split(',').map(c => ({ name: c.trim() }));
        }
        return colorsField;
      }

      if (typeof colorsField === 'string') {
        return colorsField.split(',').map(c => ({ name: c.trim() }));
      }

      return [];
    },
    productMaterials() {
       if (!this.product) return [];
       const matField = this.product.material || this.product['Material'];
       if (!matField) return [];

       if (Array.isArray(matField)) return matField;
       
       // Tách dấu phẩy nếu store lưu dạng chuỗi phân cách
       return matField.split(',').map(m => m.trim());
    },
    formatDimensions() {
      if (!this.product) return null;
      
      // Hỗ trợ cả tên property camelCase hoặc tên cột gốc trong CSV
      const l = this.product.length || this.product['Length (mm)'];
      const w = this.product.width || this.product['Width (mm)'];
      const h = this.product.height || this.product['Height (mm)'];
      
      if (!l || !w || !h) return null;
      
      // Quy đổi từ mm sang cm (chia 10)
      return `${l / 10} x ${w / 10} x ${h / 10} cm`;
    },
    similarProducts() {
      if (!this.product || !this.product.categoryPaths || !this.product.categoryPaths.length) return [];
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
      this.qty = 1;
      this.selectedColor = this.productColors.length ? this.productColors[0] : null;
      this.selectedMaterial = this.productMaterials.length ? this.productMaterials[0] : null;
      this.updateSeo(p);
    },
  },
  created() {
    if (this.product) {
      if (this.productColors.length) {
        this.selectedColor = this.productColors[0]; 
      }
      if (this.productMaterials.length) {
        this.selectedMaterial = this.productMaterials[0];
      }
      this.updateSeo(this.product);
    }
  },
  methods: {
    formatVND,
    // Tiêu đề/mô tả/ảnh SEO đổi theo đúng sản phẩm đang xem — gọi lại mỗi
    // khi `product` có dữ liệu hoặc đổi sang sản phẩm khác (params.id đổi).
    // Xem ghi chú giới hạn SPA (Facebook/Zalo preview) trong src/utils/seo.js.
    updateSeo(p) {
      if (!p) return;
      const rawDesc = p.shortDesc || (p.desc ? p.desc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '');
      setPageMeta({
        title: p.name,
        description: rawDesc ? rawDesc.slice(0, 160) : undefined,
        image: p.images && p.images[0] ? p.images[0] : undefined,
        path: this.$route.fullPath,
      });
    },
    buyNow() {
      this.handleAddToCart(this.product, this.qty, this.selectedColor);
      this.$router.push({ name: 'checkout' });
    },
    getColorCode(colorName) {
      if (!colorName) return '#DDDDDD';
      const name = colorName.toLowerCase();
      const colorMap = {
        'trắng': '#F8F8F8', 'màu trắng': '#F8F8F8',
        'be': '#E5DDD5', 'màu be': '#E5DDD5',
        'xám nhạt': '#C3C1BD', 'màu xám nhạt': '#C3C1BD',
        'xám đậm': '#353331', 'màu xám đậm': '#353331',
        'vân gỗ sồi': '#D2B48C', 'màu vân gỗ sồi': '#D2B48C',
        'xám ghi': '#808080', 'màu xám ghi': '#808080',
        'đen': '#1a1a1a', 'màu đen': '#1a1a1a'
      };
      return colorMap[name] || '#DDDDDD';
    }
  },
};
</script>

<style scoped>
.product-detail-page {
  background-color: #FAF8F5; 
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  color: #2D2D2D;
}

.breadcrumb {
  max-width: 1100px;
  margin: 0 auto 20px auto;
  font-size: 14px;
  color: #666;
}
.breadcrumb a {
  color: #6C5D4B;
  text-decoration: none;
}

.pd-wrap {
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
  background: transparent;
}

@media (max-width: 768px) {
  .pd-wrap {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.product-gallery-section :deep(img) {
  border-radius: 8px;
}

.pd-info {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: #1A1A1A;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.stars {
  color: #555;
  font-size: 14px;
  letter-spacing: 2px;
}

.rating-text {
  font-size: 14px;
  color: #666;
}

.product-price-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 8px;
}
.product-price-box .price,
.product-price-box .price-old {
  white-space: nowrap;
}
/* Mobile: giá bán và giá gốc mỗi giá 1 dòng riêng */
@media (max-width: 640px) {
  .product-price-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}

.product-price-box .price {
  font-size: 24px;
  font-weight: 500;
  color: #1A1A1A;
}

.product-price-box .price-old {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.tax-shipping-note {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.divider {
  border: 0;
  height: 1px;
  background: #E5E0D8;
  margin-bottom: 30px;
  width: 100%;
}

.option-group {
  margin-bottom: 24px;
}

.option-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1A1A1A;
}

.color-options {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #CCC;
  cursor: pointer;
  padding: 0;
  outline-offset: 3px;
  transition: outline 0.2s;
}
.color-swatch.active {
  outline: 2px solid #333;
  border-color: #FFF;
}

.material-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.material-btn {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #D6D6D6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}
.material-btn.active {
  border-color: #333;
  background: white;
}

.dimension-box {
  padding: 12px 16px;
  border: 1px solid #D6D6D6;
  border-radius: 4px;
  font-size: 14px;
  background: transparent;
  width: fit-content;
  min-width: 200px;
}

.action-group {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  margin-bottom: 25px;
  align-items: center;
}

.qty-box {
  display: flex;
  align-items: center;
  border: 1px solid #D6D6D6;
  border-radius: 4px;
  height: 52px;
  background: white;
}

.qty-box button {
  background: transparent;
  border: none;
  width: 44px;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.qty-box input {
  width: 30px;
  text-align: center;
  border: none;
  background: transparent;
  font-size: 15px;
  pointer-events: none;
  color: #333;
}

.btn-add-to-cart {
  flex: 1;
  white-space: nowrap; /* chữ "Thêm vào giỏ hàng" không bao giờ tự xuống dòng */
  height: 52px;
  background-color: #6C5D4B; 
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s;
}

.btn-add-to-cart:hover:not(:disabled) {
  background-color: #55493a;
}
.btn-add-to-cart:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-buy-now {
  width: 100%;
  height: 48px;
  background-color: transparent;
  color: #6C5D4B;
  border: 1px solid #6C5D4B;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-buy-now:hover {
  background-color: rgba(108, 93, 75, 0.05);
}

/* Mobile: hàng 1 = [số lượng] .......... [♡], hàng 2 = nút "Thêm vào giỏ hàng" full chiều rộng
   (trước đây cả 3 nằm chung 1 hàng nên nút bị bóp hẹp, chữ tràn thành 3 dòng) */
@media (max-width: 640px) {
  .action-group {
    flex-wrap: wrap;
    gap: 12px;
  }
  .action-group .qty-box { order: 1; }
  .action-group .qa-btn { order: 2; margin-left: auto; }
  .action-group .btn-add-to-cart { order: 3; flex: 1 1 100%; }
}

.qa-btn {
  height: 52px;
  width: 52px;
  border-radius: 4px;
  border: 1px solid #D6D6D6;
  background: white;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}
.qa-btn.active {
  color: #E53935; 
  border-color: #E53935;
}

.cart-icon {
  width: 20px;
  height: 20px;
}

.meta-info {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #555;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-icon {
  width: 18px;
  height: 18px;
  color: #666;
}

.share-row {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  color: #666;
}
.share-row a {
  color: #999;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}
.share-row a:hover {
  color: #6C5D4B;
}

.pd-desc-grid {
  max-width: 1100px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
@media (max-width: 768px) {
  .pd-desc-grid {
    grid-template-columns: 1fr;
  }
}

.html-desc-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.similar-products-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #EBEBEB;
}
.similar-products-box h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #1A1A1A;
}
.similar-item {
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: #333;
  margin-bottom: 15px;
  align-items: center;
}
.similar-item:last-child {
  margin-bottom: 0;
}
.similar-thumb {
  width: 60px;
  height: 60px;
  background: #F5F5F5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.similar-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.similar-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}
.tax-shipping-note .policy-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.tax-shipping-note .policy-link:hover { opacity: .75; }
</style>