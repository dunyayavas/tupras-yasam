// Smooth scroll + scroll reveal for Tüpraş Yaşam
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  document
    .querySelectorAll(".featureCard, .socialCard, .pillar, .pillar5, .splitRow, .growthItem, .about, .ctaBox")
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
})();
