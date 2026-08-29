import cartService from '@/services/cartService';

/**
 * src/store/modules/cart.js
 * ------------------------------------------------------------------
 * Quản lý giỏ hàng. Mỗi dòng giỏ hàng (cart line) được nhận diện bằng
 * "lineKey" thay vì chỉ productId — vì 1 sản phẩm có thể có NHIỀU màu
 * khác nhau (xem product.colors ở sheetService.js), mỗi màu cần là 1
 * dòng riêng trong giỏ (giống việc mua 2 màu khác nhau của cùng 1 mẫu
 * tủ thì phải tính là 2 dòng, không được gộp chung).
 *
 * lineKey = productId, hoặc "productId::tên màu" nếu có chọn màu.
 *
 * State trong bộ nhớ (RAM) luôn chứa object sản phẩm ĐẦY ĐỦ (để hiển
 * thị tên/ảnh/giá ngay), nhưng khi LƯU xuống localStorage chỉ lưu phần
 * gọn nhẹ {productId, qty, colorName} — tránh lưu dữ liệu sản phẩm cũ
 * có thể lệch với Google Sheet mới nhất.
 * ------------------------------------------------------------------
 */
function buildLineKey(productId, color) {
  return color && color.name ? `${productId}::${color.name}` : productId;
}

export default {
  namespaced: true,

  state: () => ({
    items: [], // [{ lineKey, productId, qty, product, color }]
  }),

  getters: {
    count: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.qty * i.product.effectivePrice, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    ADD_ITEM(state, { product, qty, color }) {
      const lineKey = buildLineKey(product.id, color);
      const existing = state.items.find((i) => i.lineKey === lineKey);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          lineKey, productId: product.id, qty, product, color: color || null,
        });
      }
    },
    UPDATE_QTY(state, { lineKey, qty }) {
      const line = state.items.find((i) => i.lineKey === lineKey);
      if (line) line.qty = qty;
    },
    REMOVE_ITEM(state, lineKey) {
      state.items = state.items.filter((i) => i.lineKey !== lineKey);
    },
    CLEAR(state) {
      state.items = [];
    },
  },

  actions: {
    /** Gọi 1 lần lúc app khởi động, sau khi đã có danh sách sản phẩm */
    restoreFromStorage({ commit, rootGetters }) {
      const saved = cartService.load(); // [{lineKey, productId, qty, colorName}]
      if (!saved.length) return;
      const items = saved
        .map(({
          lineKey, productId, qty, colorName,
        }) => {
          const product = rootGetters['products/findById'](productId);
          if (!product) return null;
          const color = colorName ? product.colors.find((c) => c.name === colorName) || { name: colorName } : null;
          return {
            lineKey: lineKey || buildLineKey(productId, color), productId, qty, product, color,
          };
        })
        .filter(Boolean);
      commit('SET_ITEMS', items);
    },

    addItem({ commit, state }, { product, qty = 1, color = null }) {
      commit('ADD_ITEM', { product, qty, color });
      cartService.save(state.items.map((i) => ({
        lineKey: i.lineKey, productId: i.productId, qty: i.qty, colorName: i.color ? i.color.name : null,
      })));
    },

    updateQty({
      commit, state, dispatch,
    }, { lineKey, qty }) {
      if (!qty || qty < 1) {
        return dispatch('removeItem', lineKey);
      }
      commit('UPDATE_QTY', { lineKey, qty });
      return cartService.save(state.items.map((i) => ({
        lineKey: i.lineKey, productId: i.productId, qty: i.qty, colorName: i.color ? i.color.name : null,
      })));
    },

    removeItem({ commit, state }, lineKey) {
      commit('REMOVE_ITEM', lineKey);
      cartService.save(state.items.map((i) => ({
        lineKey: i.lineKey, productId: i.productId, qty: i.qty, colorName: i.color ? i.color.name : null,
      })));
    },

    clearCart({ commit }) {
      commit('CLEAR');
      cartService.clear();
    },
  },
};
