class NavigationController {
  constructor() {
    this.menuBtn = document.getElementById("menuBtn");
    this.navLinks = document.getElementById("navLinks");
    this.navItems = document.querySelectorAll(".nav-links a");
    this.sections = document.querySelectorAll("main section");
  }

  init() {
    this.setMenuEvents();
    this.setActiveSectionObserver();
  }

  setMenuEvents() {
    if (!this.menuBtn || !this.navLinks) return;

    this.menuBtn.addEventListener("click", () => {
      this.navLinks.classList.toggle("show");
      this.menuBtn.textContent = this.navLinks.classList.contains("show") ? "×" : "☰";
    });

    this.navItems.forEach((item) => {
      item.addEventListener("click", () => this.closeMenu());
    });
  }

  closeMenu() {
    this.navLinks.classList.remove("show");
    this.menuBtn.textContent = "☰";
  }

  setActiveSectionObserver() {
    if (!this.sections.length || !this.navItems.length) return;

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        this.navItems.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    this.sections.forEach((section) => activeObserver.observe(section));
  }
}

class ThemeController {
  constructor() {
    this.storageKey = "portfolio-theme";
    this.toggle = document.getElementById("themeToggle");
    this.icon = document.getElementById("themeToggleIcon");
    this.themeMeta = document.querySelector('meta[name="theme-color"]');
    this.prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  init() {
    this.applyTheme(this.getInitialTheme());

    if (!this.toggle) return;

    this.toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      this.applyTheme(nextTheme);
      localStorage.setItem(this.storageKey, nextTheme);
    });
  }

  getInitialTheme() {
    return localStorage.getItem(this.storageKey) || (this.prefersLight ? "light" : "dark");
  }

  applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (this.themeMeta) {
      this.themeMeta.setAttribute("content", theme === "light" ? "#eef3f8" : "#05070d");
    }

    if (!this.toggle) return;

    const isLight = theme === "light";
    this.toggle.setAttribute("aria-pressed", String(isLight));
    this.toggle.setAttribute("aria-label", isLight ? "Light mode active. Switch to dark mode" : "Dark mode active. Switch to light mode");

    if (this.icon) {
      this.icon.src = isLight ? "images/lightmode.jpeg" : "images/darkmode.jpeg";
    }
  }
}
class RevealAnimator {
  constructor() {
    this.elements = document.querySelectorAll(".reveal");
  }

  init() {
    if (!this.elements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    this.elements.forEach((element) => revealObserver.observe(element));
  }
}

class ProjectFilter {
  constructor() {
    this.buttons = document.querySelectorAll(".filter-btn");
    this.cards = document.querySelectorAll(".project-card");
  }

  init() {
    if (!this.buttons.length || !this.cards.length) return;

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => this.filterProjects(button));
    });
  }

  filterProjects(activeButton) {
    const filter = activeButton.dataset.filter;

    this.buttons.forEach((button) => button.classList.remove("active"));
    activeButton.classList.add("active");

    this.cards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.style.display = shouldShow ? "flex" : "none";
    });
  }
}

class ClipboardController {
  constructor(ownerEmail) {
    this.ownerEmail = ownerEmail;
    this.copyEmailBtn = document.getElementById("copyEmailBtn");
  }

  init() {
    if (!this.copyEmailBtn) return;

    this.copyEmailBtn.addEventListener("click", () => this.copyEmail());
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.ownerEmail);
      this.setTemporaryText("Email Copied!", "Copy Email Address");
    } catch (error) {
      this.copyEmailBtn.textContent = this.ownerEmail;
    }
  }

  setTemporaryText(message, originalText) {
    this.copyEmailBtn.textContent = message;
    setTimeout(() => {
      this.copyEmailBtn.textContent = originalText;
    }, 1800);
  }
}

class ContactForm {
  constructor(ownerEmail) {
    this.ownerEmail = ownerEmail;
    this.form = document.getElementById("contactForm");
    this.formStatus = document.getElementById("formStatus");
  }

  init() {
    if (!this.form || !this.formStatus) return;

    this.form.addEventListener("submit", (event) => this.handleSubmit(event));
  }

  handleSubmit(event) {
    event.preventDefault();

    const formData = this.getFormData();
    const validationMessage = this.validate(formData);

    if (validationMessage) {
      this.showStatus(validationMessage, "error");
      return;
    }

    this.openMailApp(formData);
    this.showStatus("Your email app is opening with the prepared message.", "success");
    this.form.reset();
  }

  getFormData() {
    return {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim()
    };
  }

  validate({ name, email, message }) {
    if (!name || !email || !message) {
      return "Please complete all fields before sending your message.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  openMailApp({ name, email, message }) {
    const subject = encodeURIComponent("Profile Website Message from " + name);
    const bodyLines = [
      "Name: " + name,
      "Email: " + email,
      "",
      "Message:",
      message
    ];
    const bodyText = encodeURIComponent(bodyLines.join(String.fromCharCode(10)));

    window.location.href = "mailto:" + this.ownerEmail + "?subject=" + subject + "&body=" + bodyText;
  }

  showStatus(message, type) {
    this.formStatus.textContent = message;
    this.formStatus.className = "form-status " + type;
  }
}

class ProfileApp {
  constructor() {
    this.ownerEmail = "docilalfrancis@gmail.com";
    this.year = document.getElementById("year");
  }

  init() {
    this.setCurrentYear();

    new ThemeController().init();
    new NavigationController().init();
    new RevealAnimator().init();
    new ProjectFilter().init();
    new ClipboardController(this.ownerEmail).init();
    new ContactForm(this.ownerEmail).init();
  }

  setCurrentYear() {
    if (this.year) {
      this.year.textContent = new Date().getFullYear();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProfileApp().init();
});


