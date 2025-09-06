function initializeAnimation() {
  gsap.to(".link a", {
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
    delay: 2,
  });

  if (document.querySelector(".hero h1")) {
    const heroText = new SplitType(".hero h1", { types: "chars" });
    gsap.set(heroText.chars, { y: 400 });
    gsap.to(heroText.chars, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 2,
    });
  }

  if (document.querySelector(".link a")) {
    const linksText = new SplitType(".link a", { types: "words" });
    gsap.set(linksText.words, { y: 400 });
    gsap.to(linksText.words, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 2,
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeAnimation();
});

if (navigation.addEventListener) {
  navigation.addEventListener("navigate", (event) => {
    if (!event.destination.url.includes(document.location.origin)) {
      return;
    }

    event.intercept({
      handler: async () => {
        const response = await fetch(event.destination.url);
        const text = await response.text();

        const transition = document.startViewTransition(() => {
          const body = text.match(/body[^>]*>([\s\S]*)<\/body>/i)[1];
          document.body.innerHTML = body;

          const title = text.match(/<title[^>]*>(.*?)<\/title>/i)[1];
          document.title = title;
        });

        transition.ready.then(() => {
          window.scrollTo(0, 0);
          initializeAnimation();
        });
      },
      scroll: "manual",
    });
  });
}
