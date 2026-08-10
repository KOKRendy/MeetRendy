<script lang="ts">
  import { personalInfo, skills, projects } from "$lib/portfolioData.js";
  import type { Project } from "$lib/portfolioData.js";

  let activeTab = $state("All");
  let mouseX = $state(0);
  let mouseY = $state(0);
  let contactForm = $state({ name: "", email: "", message: "" });
  let formSubmitted = $state(false);

  // --- Preview modal / slider state ---
  let previewProject: Project | null = $state(null);
  let currentSlide = $state(0);
  let isModalOpen = $derived(previewProject !== null);

  let categories = $derived([
    "All",
    ...new Set(projects.map((p) => p.category)),
  ]);
  let filteredProjects = $derived(
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab),
  );

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      formSubmitted = true;
      setTimeout(() => {
        contactForm.name = "";
        contactForm.email = "";
        contactForm.message = "";
        formSubmitted = false;
      }, 4000);
    }
  }

  function openPreview(project: Project) {
    previewProject = project;
    currentSlide = 0;
  }

  function closePreview() {
    previewProject = null;
    currentSlide = 0;
  }

  function nextSlide() {
    if (!previewProject) return;
    const total = previewProject.previewAssets.length;
    currentSlide = (currentSlide + 1) % total;
  }

  function prevSlide() {
    if (!previewProject) return;
    const total = previewProject.previewAssets.length;
    currentSlide = (currentSlide - 1 + total) % total;
  }

  function goToSlide(index: number) {
    currentSlide = index;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isModalOpen) return;
    if (event.key === "Escape") closePreview();
    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
  }
</script>

<svelte:window onmousemove={handleMouseMove} onkeydown={handleKeydown} />

<div class="portfolio-container">
  <div class="cursor-glow" style="left: {mouseX}px; top: {mouseY}px;"></div>

  <nav class="navbar">
    <div class="logo">&lt;{personalInfo.name.split(" ")[1]} /&gt;</div>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#projects">Projects</a>
      <a href="#contact" class="btn-nav">Contact</a>
    </div>
  </nav>

  <section id="about" class="hero">
    <div class="badge">Ready for a New Project</div>
    <h1>Hello, I'm <span class="highlight">{personalInfo.name}</span></h1>
    <p class="subtitle">{personalInfo.role}</p>
    <p class="bio">{personalInfo.bio}</p>

    <div class="cta-group">
      <a href="#projects" class="btn-primary">View Portfolio</a>
      <a href="#contact" class="btn-secondary">Contact Me</a>
    </div>

    <div class="social-links">
      {#each personalInfo.socials as social}
        <a href={social.url} target="_blank" rel="noreferrer"
          >{social.name} ↗</a
        >
      {/each}
    </div>
  </section>

  <section id="skills" class="section">
    <h2>Skills & Technologies</h2>
    <div class="skills-grid">
      {#each skills as skill}
        <div class="skill-card">
          <div class="skill-info">
            <span class="skill-name">{skill.name}</span>
            <span class="skill-category">{skill.category}</span>
          </div>
          <div class="progress-bar">
            <div class="progress" style="width: {skill.level}%;"></div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="projects" class="section">
    <h2>Featured Projects</h2>

    <div class="tabs">
      {#each categories as category}
        <button
          class="tab-btn {activeTab === category ? 'active' : ''}"
          onclick={() => (activeTab = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="projects-grid">
      {#each filteredProjects as project (project.id)}
        <div class="project-card">
          <div class="card-header">
            <span class="project-cat">{project.category}</span>
            <h3>{project.title}</h3>
          </div>
          <p>{project.description}</p>
          <div class="tech-stack">
            {#each project.tech as tech}
              <span class="tech-tag">{tech}</span>
            {/each}
          </div>
          <div class="card-links">
            {#if project.previewAssets && project.previewAssets.length > 0}
              <button class="link-btn" onclick={() => openPreview(project)}>
                Preview ↗
              </button>
            {:else if project.link !== "#"}
              <a href={project.link} target="_blank" rel="noreferrer"
                >Preview ↗</a
              >
            {/if}
            {#if project.github !== "#"}
              <a href={project.github} target="_blank" rel="noreferrer"
                >GitHub ↗</a
              >
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="contact" class="section">
    <h2>Let's Work Together</h2>
    <div class="contact-box">
      {#if formSubmitted}
        <div class="success-message">
          ✅ Pesan Anda berhasil terkirim! Saya akan segera menghubungi Anda.
        </div>
      {:else}
        <form onsubmit={handleSubmit}>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              bind:value={contactForm.name}
              required
              placeholder="Your Name"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              bind:value={contactForm.email}
              required
              placeholder="email@example.com"
            />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              bind:value={contactForm.message}
              rows="4"
              required
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <button type="submit" class="btn-primary full-width"
            >Send Message</button
          >
        </form>
      {/if}
    </div>
  </section>

  <footer>
    <p>© {new Date().getFullYear()} {personalInfo.name}</p>
  </footer>
</div>

{#if isModalOpen && previewProject}
  <div
    class="modal-backdrop"
    role="button"
    tabindex="0"
    onclick={closePreview}
    onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") closePreview(); }}
    aria-label="Close preview"
  >
    <div
      class="modal-box"
      role="dialog"
      aria-modal="true"
      aria-label={previewProject.title}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <button class="modal-close" onclick={closePreview} aria-label="Close preview">✕</button>

      <div class="modal-header">
        <span class="project-cat">{previewProject.category}</span>
        <h3>{previewProject.title}</h3>
      </div>

      <div class="slider">
        <div
          class="slider-track"
          style="transform: translateX(-{currentSlide * 100}%);"
        >
          {#each previewProject.previewAssets as asset, i}
            <div class="slide">
              <img src={asset} alt="{previewProject.title} preview {i + 1}" />
            </div>
          {/each}
        </div>

        {#if previewProject.previewAssets.length > 1}
          <button class="slider-nav prev" onclick={prevSlide} aria-label="Previous image">‹</button>
          <button class="slider-nav next" onclick={nextSlide} aria-label="Next image">›</button>
        {/if}
      </div>

      {#if previewProject.previewAssets.length > 1}
        <div class="slider-dots">
          {#each previewProject.previewAssets as _, i}
            <button
              class="dot {currentSlide === i ? 'active' : ''}"
              onclick={() => goToSlide(i)}
              aria-label="Go to image {i + 1}"
            ></button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(html) {
    scroll-behavior: smooth;
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    background-color: #0a0a0c;
    color: #f3f4f6;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .portfolio-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
  }

  .cursor-glow {
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      rgba(99, 102, 241, 0.15) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition:
      width 0.2s,
      height 0.2s;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
    position: sticky;
    top: 0;
    background: rgba(10, 10, 12, 0.8);
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .logo {
    font-weight: 700;
    font-size: 1.25rem;
    color: #818cf8;
    font-family: monospace;
  }

  .nav-links a {
    color: #9ca3af;
    text-decoration: none;
    margin-left: 1.5rem;
    transition: color 0.2s;
  }

  .nav-links a:hover {
    color: #f3f4f6;
  }

  .btn-nav {
    border: 1px solid #374151;
    padding: 0.5rem 1rem;
    border-radius: 20px;
  }

  .hero {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 0;
  }

  .badge {
    background: rgba(129, 140, 248, 0.1);
    color: #818cf8;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    border: 1px solid rgba(129, 140, 248, 0.2);
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 3.5rem;
    line-height: 1.1;
    margin: 0 0 1rem 0;
  }

  .highlight {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.5rem;
    color: #9ca3af;
    margin: 0 0 1rem 0;
  }

  .bio {
    max-width: 600px;
    color: #6b7280;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .cta-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .btn-primary {
    background: #4f46e5;
    color: white;
    padding: 0.8rem 1.8rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition:
      transform 0.2s,
      background 0.2s;
  }

  .btn-primary:hover {
    background: #4338ca;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: transparent;
    color: #f3f4f6;
    padding: 0.8rem 1.8rem;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid #374151;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: #1f2937;
  }

  .social-links a {
    color: #9ca3af;
    text-decoration: none;
    margin-right: 1.5rem;
    font-size: 0.9rem;
  }

  .section {
    padding: 5rem 0;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .skill-card {
    background: #111827;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid #1f2937;
  }

  .skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .skill-category {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .progress-bar {
    height: 6px;
    background: #1f2937;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5, #c084fc);
    transition: width 1s ease-out;
  }

  /* Projects & Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .tab-btn {
    background: #111827;
    border: 1px solid #1f2937;
    color: #9ca3af;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active,
  .tab-btn:hover {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .project-card {
    background: #111827;
    border: 1px solid #1f2937;
    padding: 1.8rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition:
      transform 0.3s,
      border-color 0.3s;
  }

  .project-card:hover {
    transform: translateY(-5px);
    border-color: #4f46e5;
  }

  .project-cat {
    font-size: 0.75rem;
    color: #818cf8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.5rem 0;
  }

  .tech-tag {
    background: #1f2937;
    color: #d1d5db;
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
  }

  .card-links {
    display: flex;
    gap: 1rem;
  }

  .card-links a,
  .link-btn {
    color: #f3f4f6;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
  }

  .link-btn:hover,
  .card-links a:hover {
    color: #818cf8;
  }

  /* Contact Form */
  .contact-box {
    background: #111827;
    border: 1px solid #1f2937;
    padding: 2.5rem;
    border-radius: 16px;
    max-width: 600px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.25rem;
  }

  label {
    margin-bottom: 0.5rem;
    color: #9ca3af;
    font-size: 0.9rem;
  }

  input,
  textarea {
    background: #0a0a0c;
    border: 1px solid #374151;
    color: white;
    padding: 0.75rem;
    border-radius: 6px;
    font-family: inherit;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #818cf8;
  }

  .full-width {
    width: 100%;
  }

  .success-message {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    text-align: center;
  }

  footer {
    text-align: center;
    padding: 3rem 0;
    color: #4b5563;
    border-top: 1px solid #1f2937;
    margin-top: 4rem;
  }

  /* --- Preview Modal / Slider --- */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1.5rem;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    max-width: 700px;
    width: 100%;
    padding: 1.5rem;
    position: relative;
    animation: scaleIn 0.25s ease-out;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #1f2937;
    color: #f3f4f6;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 2;
  }

  .modal-close:hover {
    background: #374151;
  }

  .modal-header {
    margin-bottom: 1rem;
    padding-right: 2.5rem;
  }

  .modal-header h3 {
    margin: 0.25rem 0 0 0;
    font-size: 1.4rem;
  }

  .slider {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: #0a0a0c;
    aspect-ratio: 16 / 10;
  }

  .slider-track {
    display: flex;
    height: 100%;
    transition: transform 0.35s ease;
  }

  .slide {
    flex: 0 0 100%;
    height: 100%;
  }

  .slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .slider-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(10, 10, 12, 0.6);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.15);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }

  .slider-nav:hover {
    background: #4f46e5;
  }

  .slider-nav.prev {
    left: 0.75rem;
  }

  .slider-nav.next {
    right: 0.75rem;
  }

  .slider-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #374151;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s, transform 0.2s;
  }

  .dot.active {
    background: #818cf8;
    transform: scale(1.3);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    .portfolio-container {
      padding: 0 1rem;
    }
  }
</style>