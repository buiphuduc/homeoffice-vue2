import sheetService from '@/services/sheetService';

/**
 * src/store/modules/products.js
 * ------------------------------------------------------------------
 * Module Vuex quản lý DANH SÁCH SẢN PHẨM lấy từ Google Sheet.
 * Đây là "nguồn sự thật duy nhất" (single source of truth) cho sản
 * phẩm — mọi component đều đọc từ đây thay vì tự gọi API riêng lẻ,
 * tránh tình trạng mỗi nơi 1 phiên bản dữ liệu khác nhau.
 * ------------------------------------------------------------------
 */
export default {
  namespaced: true,

  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    all: (state) => state.items.filter((p) => p.published),

    /** Tìm 1 sản phẩm theo id (SKU) */
    findById: (state) => (id) => state.items.find((p) => p.id === id),

    /** Danh mục cấp 1 (top-level), suy ra tự động từ dữ liệu sản phẩm */
    topCategories: (state) => {
      const set = new Set();
      state.items.forEach((p) => {
        p.categoryPaths.forEach((path) => {
          if (path[0]) set.add(path[0]);
        });
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
    },
  },

  mutations: {
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    /**
     * Tải sản phẩm từ Google Sheet. Component gọi action này (thường ở
     * App.vue khi app khởi động) — action tự xử lý trạng thái loading/error,
     * component chỉ cần đọc state.products.loading / state.products.error.
     */
    async fetchProducts({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const items = await sheetService.fetchProducts();
        commit('SET_ITEMS', items);
      } catch (err) {
        commit('SET_ERROR', err.message || 'Không tải được dữ liệu sản phẩm');
        commit('SET_ITEMS', []);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
};
