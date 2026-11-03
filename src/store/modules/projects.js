import projectService from '@/services/projectService';

/**
 * src/store/modules/projects.js
 * Danh sách dự án (nguồn: CSDL MySQL qua API hoặc dữ liệu mẫu — xem projectService).
 * Các view gọi dispatch('projects/fetch') rồi đọc getters all / loaded.
 */
let inflight = null;

export default {
  namespaced: true,
  state: () => ({
    items: [],
    loaded: false,
    source: '',
  }),
  getters: {
    all: (state) => state.items,
    loaded: (state) => state.loaded,
  },
  mutations: {
    SET(state, { items, source }) {
      state.items = items;
      state.source = source;
      state.loaded = true;
    },
  },
  actions: {
    /** Tải 1 lần (gọi nhiều nơi vẫn chỉ 1 lượt tải). force=true để tải lại. */
    fetch({ state, commit }, { force = false } = {}) {
      if (state.loaded && !force) return Promise.resolve();
      if (inflight && !force) return inflight;
      inflight = projectService.fetchProjects()
        .then((res) => { commit('SET', res); })
        .finally(() => { inflight = null; });
      return inflight;
    },
  },
};
