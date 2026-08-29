/**
 * src/store/modules/toast.js
 * ------------------------------------------------------------------
 * Module nhỏ quản lý thông báo (toast) hiển thị góc màn hình. Đặt
 * trong Vuex (thay vì state cục bộ của component) để BẤT KỲ component
 * nào ở bất kỳ đâu trong app cũng có thể gọi `dispatch('toast/push', ...)`
 * mà không cần truyền qua nhiều lớp props/event.
 * ------------------------------------------------------------------
 */
let toastSeq = 1;

export default {
  namespaced: true,

  state: () => ({
    items: [], // [{ id, title, desc, type }]
  }),

  mutations: {
    ADD(state, toast) {
      state.items.push(toast);
    },
    REMOVE(state, id) {
      state.items = state.items.filter((t) => t.id !== id);
    },
  },

  actions: {
    /**
     * @param {string} title
     * @param {string} [desc]
     * @param {'ok'|'err'} [type]
     */
    push({ commit }, { title, desc = '', type = 'ok' } = {}) {
      const id = toastSeq++;
      commit('ADD', { id, title, desc, type });
      setTimeout(() => commit('REMOVE', id), 3500);
    },
  },
};
