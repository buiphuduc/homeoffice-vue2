import wishlistService from '@/services/wishlistService';

/**
 * src/store/modules/wishlist.js
 * ------------------------------------------------------------------
 * Quản lý danh sách yêu thích — chỉ lưu mảng ID sản phẩm, đơn giản
 * hơn giỏ hàng vì không cần theo dõi số lượng.
 * ------------------------------------------------------------------
 */
export default {
  namespaced: true,

  state: () => ({
    ids: [],
  }),

  getters: {
    count: (state) => state.ids.length,
    isWished: (state) => (productId) => state.ids.includes(productId),
    products: (state, getters, rootState, rootGetters) => {
      const all = rootGetters['products/all'];
      return all.filter((p) => state.ids.includes(p.id));
    },
  },

  mutations: {
    SET_IDS(state, ids) {
      state.ids = ids;
    },
    TOGGLE(state, productId) {
      const idx = state.ids.indexOf(productId);
      if (idx > -1) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(productId);
      }
    },
  },

  actions: {
    restoreFromStorage({ commit }) {
      commit('SET_IDS', wishlistService.load());
    },
    toggle({ commit, state }, productId) {
      commit('TOGGLE', productId);
      wishlistService.save(state.ids);
    },
  },
};
