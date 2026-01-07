import { gsap } from "gsap";

type Instance = {
  interval: number;
  tl?: gsap.core.Timeline;
  el: HTMLElement;
};

const instances = new Map<HTMLElement, Instance>();

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function parseHeadlines(root: HTMLElement): string[] {
  const raw = root.dataset.headlines;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function initOne(root: HTMLElement) {
  if (instances.has(root)) return;

  const el = root.querySelector<HTMLElement>("[data-rotating-headline-text]");
  if (!el) return;

  const headlines = parseHeadlines(root);
  if (headlines.length < 2) return;

  let idx = 0;
  let tl: gsap.core.Timeline | undefined;

  const setText = (nextIdx: number) => {
    el.textContent = headlines[nextIdx] ?? "";
  };

  const rotateOnce = () => {
    const nextIdx = (idx + 1) % headlines.length;

    if (prefersReducedMotion()) {
      idx = nextIdx;
      setText(idx);
      return;
    }

    tl?.kill();
    gsap.killTweensOf(el);

    tl = gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .to(el, {
        duration: 0.3,
        ease: "power4.in",
        opacity: 0,
        yPercent: -33,
      })
      .add(() => {
        setText(nextIdx);
        idx = nextIdx;
        gsap.set(el, { opacity: 0, yPercent: 33 });
      })
      .to(el, {
        duration: 1.0,
        ease: "power4.out",
        opacity: 1,
        yPercent: 0,
      });

    instances.get(root)!.tl = tl;
  };

  // Stable initial state.
  gsap.set(el, { opacity: 1, yPercent: 0 });

  const interval = window.setInterval(rotateOnce, 3000);
  instances.set(root, { interval, el, tl });
}

function initAll() {
  document
    .querySelectorAll<HTMLElement>("[data-rotating-headline-root]")
    .forEach(initOne);
}

function cleanupAll() {
  for (const [root, inst] of instances.entries()) {
    window.clearInterval(inst.interval);
    inst.tl?.kill();
    gsap.killTweensOf(inst.el);
    instances.delete(root);
  }
}

initAll();
window.addEventListener?.("astro:page-load", initAll);
window.addEventListener?.("astro:before-swap", cleanupAll, { once: true });


