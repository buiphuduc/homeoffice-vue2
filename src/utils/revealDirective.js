/**
 * src/utils/revealDirective.js
 * ------------------------------------------------------------------
 * Đăng ký directive `v-reveal` toàn cục: gắn vào bất kỳ thẻ nào (thường
 * là 1 section trên trang chủ) để phần tử đó tự "hiện dần lên" (fade-in
 * + trượt nhẹ từ dưới lên) khi người dùng cuộn tới, thay vì hiện sẵn
 * ngay từ đầu trông "khô".
 *
 * Cách dùng trong template:
 *   <div class="section-title" v-reveal>...</div>
 *
 * Có thể chỉnh độ trễ (để nhiều phần tử liền nhau không hiện cùng lúc,
 * trông "so le" đẹp hơn) bằng giá trị truyền vào:
 *   <div v-reveal="80">...</div>   // trễ thêm 80ms
 *
 * Tự tắt hoàn toàn nếu trình duyệt/OS của người dùng bật
 * "prefers-reduced-motion" — tôn trọng lựa chọn hạn chế chuyển động.
 */

const prefersReducedMotion = () => window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  return observer;
}

export default {
  install(Vue) {
    Vue.directive('reveal', {
      inserted(el, binding) {
        if (prefersReducedMotion()) {
          el.classList.add('is-revealed');
          return;
        }
        el.classList.add('reveal-init');
        const delay = Number(binding.value) || 0;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        getObserver().observe(el);
      },
      unbind(el) {
        if (observer) observer.unobserve(el);
      },
    });
  },
};
