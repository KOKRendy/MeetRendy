<script lang="ts">
  import { onMount } from "svelte";
  import { personalInfo, skills, projects } from "$lib/portfolioData.js";
  import type { Project } from "$lib/portfolioData.js";

  let activeTab = $state("All");
  let mouseX = $state(0);
  let mouseY = $state(0);
  let contactForm = $state({ name: "", email: "", message: "" });
  let formSubmitted = $state(false);
  let isMobile = $state(false);

  onMount(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateDevice = () => {
      isMobile = mediaQuery.matches;
    };

    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);

    return () => {
      mediaQuery.removeEventListener("change", updateDevice);
    };
  });

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

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      formSubmitted = true;

      contactForm.name = "";
      contactForm.email = "";
      contactForm.message = "";

      setTimeout(() => {
        formSubmitted = false;
      }, 4000);
    } catch (error) {
      console.error("Failed to send message:", error);
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

<div class="max-w-275 mx-auto px-4 md:px-8 relative">
  {#if mouseX !== 0 && mouseY !== 0 && !isMobile}
    <div
      class="fixed w-100 h-100 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 transition-[width,height] duration-200"
      style="left: {mouseX}px; top: {mouseY}px; background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%);"
    ></div>
  {/if}

  <nav
    class="md:flex hidden justify-between items-center py-8 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-[10px] z-10"
  >
    <div class="font-bold text-xl text-indigo-400 font-mono">
      &lt;{personalInfo.name.split(" ")[1]} /&gt;
    </div>
    <div>
      <a
        href="#about"
        class="text-gray-400 no-underline ml-6 transition-colors duration-200 hover:text-gray-100"
        >About</a
      >
      <a
        href="#skills"
        class="text-gray-400 no-underline ml-6 transition-colors duration-200 hover:text-gray-100"
        >Skills</a
      >
      <a
        href="#projects"
        class="text-gray-400 no-underline ml-6 transition-colors duration-200 hover:text-gray-100"
        >Projects</a
      >
      <a
        href="#contact"
        class="text-gray-400 no-underline ml-6 transition-colors duration-200 hover:text-gray-100 border border-gray-700 px-4 py-2 rounded-[20px]"
        >Contact</a
      >
    </div>
  </nav>

  <section
    id="about"
    class="md:min-h-[80vh] min-h-dvh flex flex-col justify-center items-start py-16"
  >
    <div
      class="bg-indigo-400/10 text-indigo-400 py-[0.4rem] px-4 rounded-[20px] text-sm border border-indigo-400/20 mb-6"
    >
      Ready for a New Project
    </div>
    <h1 class="text-[2.5rem] md:text-[3.5rem] leading-[1.1] m-0 mb-4">
      Hello, I'm <span
        class="bg-linear-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >{personalInfo.name}</span
      >
    </h1>
    <p class="text-2xl text-gray-400 m-0 mb-4">{personalInfo.role}</p>
    <p class="max-w-150 text-gray-500 text-[1.1rem] leading-relaxed mb-8">
      {personalInfo.bio}
    </p>

    <div class="flex gap-4 mb-10">
      <a
        href="#projects"
        class="bg-indigo-600 text-white py-[0.8rem] px-[1.8rem] rounded-lg no-underline font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-0.5"
        >View Portfolio</a
      >
      <a
        href="#contact"
        class="bg-transparent text-gray-100 py-[0.8rem] px-[1.8rem] rounded-lg no-underline border border-gray-700 transition-colors duration-200 hover:bg-gray-800"
        >Contact Me</a
      >
    </div>

    <div>
      {#each personalInfo.socials as social}
        <a
          href={social.url}
          target="_blank"
          rel="noreferrer"
          class="text-gray-400 no-underline mr-6 text-[0.9rem]"
          >{social.name} ↗</a
        >
      {/each}
    </div>
  </section>

  <section id="skills" class="py-20">
    <h2 class="text-[2rem] mb-8 relative">Skills &amp; Technologies</h2>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      {#each skills as skill}
        <div class="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <div class="flex justify-between mb-3">
            <span>{skill.name}</span>
            <span class="text-[0.8rem] text-gray-500">{skill.category}</span>
          </div>
          <div class="h-1.5 bg-gray-800 rounded-[3px] overflow-hidden">
            <div
              class="h-full bg-linear-to-r from-indigo-600 to-purple-400 transition-[width] duration-1000 ease-out"
              style="width: {skill.level}%;"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="projects" class="py-20">
    <h2 class="text-[2rem] mb-8 relative">Featured Projects</h2>

    <div class="flex gap-2 mb-8">
      {#each categories as category}
        <button
          class="py-2 px-4 rounded-md cursor-pointer transition-all duration-200 {activeTab ===
          category
            ? 'bg-indigo-600 text-white border border-indigo-600'
            : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}"
          onclick={() => (activeTab = category)}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
      {#each filteredProjects as project (project.id)}
        <div
          class="bg-gray-900 border border-gray-800 p-[1.8rem] rounded-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.25 hover:border-indigo-600"
        >
          <div>
            <span class="text-xs text-indigo-400 uppercase tracking-[1px]"
              >{project.category}</span
            >
            <h3>{project.title}</h3>
          </div>
          <p>{project.description}</p>
          <div class="flex flex-wrap gap-2 my-6">
            {#each project.tech as tech}
              <span
                class="bg-gray-800 text-gray-300 text-xs py-1 px-[0.6rem] rounded"
                >{tech}</span
              >
            {/each}
          </div>
          <div class="flex gap-4">
            {#if project.previewAssets && project.previewAssets.length > 0}
              <button
                class="text-gray-100 no-underline text-[0.9rem] font-medium bg-transparent border-none p-0 cursor-pointer font-[inherit] hover:text-indigo-400"
                onclick={() => openPreview(project)}
              >
                Preview ↗
              </button>
            {:else if project.link !== "#"}
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                class="text-gray-100 no-underline text-[0.9rem] font-medium hover:text-indigo-400"
                >Preview ↗</a
              >
            {/if}
            {#if project.github !== "#"}
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                class="text-gray-100 no-underline text-[0.9rem] font-medium hover:text-indigo-400"
                >GitHub ↗</a
              >
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="contact" class="py-20">
    <h2 class="text-[2rem] mb-8 relative">Let's Work Together</h2>
    <div class="bg-gray-900 border border-gray-800 p-10 rounded-2xl max-w-150">
      {#if formSubmitted}
        <div
          class="bg-emerald-500/10 text-emerald-500 p-4 rounded-lg border border-emerald-500/20 text-center"
        >
          ✅ Pesan Anda berhasil terkirim! Saya akan segera menghubungi Anda.
        </div>
      {:else}
        <form onsubmit={handleSubmit}>
          <div class="flex flex-col mb-5">
            <label for="name" class="mb-2 text-gray-400 text-[0.9rem]"
              >Name</label
            >
            <input
              type="text"
              id="name"
              bind:value={contactForm.name}
              required
              placeholder="Your Name"
              class="bg-[#0a0a0c] border border-gray-700 text-white p-3 rounded-md font-[inherit] focus:outline-none focus:border-indigo-400"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col mb-5">
            <label for="email" class="mb-2 text-gray-400 text-[0.9rem]"
              >Email</label
            >
            <input
              type="email"
              id="email"
              bind:value={contactForm.email}
              required
              placeholder="email@example.com"
              class="bg-[#0a0a0c] border border-gray-700 text-white p-3 rounded-md font-[inherit] focus:outline-none focus:border-indigo-400"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-col mb-5">
            <label for="message" class="mb-2 text-gray-400 text-[0.9rem]"
              >Message</label
            >
            <textarea
              id="message"
              bind:value={contactForm.message}
              rows="4"
              required
              placeholder="Write your message here..."
              class="bg-[#0a0a0c] border border-gray-700 text-white p-3 rounded-md font-[inherit] focus:outline-none focus:border-indigo-400"
              autocomplete="off"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-[0.8rem] px-[1.8rem] rounded-lg font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-0.5"
            >Send Message</button
          >
        </form>
      {/if}
    </div>
  </section>

  <footer
    class="text-center py-12 text-gray-600 border-t border-gray-800 mt-16"
  >
    <p>© {new Date().getFullYear()} {personalInfo.name}</p>
  </footer>
</div>

{#if isModalOpen && previewProject}
  <div
    class="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-100 p-6 animate-[fadeIn_0.2s_ease-out]"
    role="button"
    tabindex="0"
    onclick={closePreview}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") closePreview();
    }}
    aria-label="Close preview"
  >
    <div
      class="bg-gray-900 border border-gray-800 rounded-2xl max-w-175 w-full p-6 relative animate-[scaleIn_0.25s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label={previewProject.title}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <button
        class="absolute top-4 right-4 bg-gray-800 text-gray-100 border-none w-8 h-8 rounded-full cursor-pointer text-base flex items-center justify-center transition-colors duration-200 z-2 hover:bg-gray-700"
        onclick={closePreview}
        aria-label="Close preview">✕</button
      >

      <div class="mb-4 pr-10">
        <span class="text-xs text-indigo-400 uppercase tracking-[1px]"
          >{previewProject.category}</span
        >
        <h3 class="mt-1 mb-0 text-[1.4rem]">{previewProject.title}</h3>
      </div>

      <div
        class="relative overflow-hidden rounded-xl bg-[#0a0a0c] aspect-16/10"
      >
        <div
          class="flex h-full transition-transform duration-350"
          style="transform: translateX(-{currentSlide * 100}%);"
        >
          {#each previewProject.previewAssets as asset, i}
            <div class="shrink-0 basis-full h-full">
              <img
                src={asset}
                alt="{previewProject.title} preview {i + 1}"
                class="w-full h-full object-cover block"
              />
            </div>
          {/each}
        </div>
      </div>

      {#if previewProject.previewAssets.length > 1}
        <div class="flex justify-center gap-2 mt-4">
          {#each previewProject.previewAssets as _, i}
            <button
              class="w-2 h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-200 {currentSlide ===
              i
                ? 'bg-indigo-400 scale-[1.3]'
                : 'bg-gray-700'}"
              onclick={() => goToSlide(i)}
              aria-label="Go to image {i + 1}"
            ></button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
