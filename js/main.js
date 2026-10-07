(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const success = form.querySelector(".form-success");
    function hideFeedback() {
      if (success) success.classList.remove("is-visible");
    }

    form.addEventListener("input", hideFeedback);
    form.addEventListener("change", hideFeedback);
    form.addEventListener("invalid", hideFeedback, true);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideFeedback();
      if (!form.reportValidity()) return;
      if (success) {
        success.classList.add("is-visible");
      }
    });
  }

  // Highlight current nav item based on path
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });
})();
