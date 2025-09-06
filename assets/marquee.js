/* Sonsuz hissiyat için “set genişliği” kadar kaydırma + rakamları sarmalama (.num) */
(function () {
  const ALL = document.querySelectorAll(".marquee");

  /** Rakamları (ve yaygın ekleri) .num ile sar: yalnızca metin düğümlerinde */
  function wrapDigitsInElement(root) {
    // Yakalanacak örnekler: 0,50‰  •  11.622 TL  •  %5  •  02:00  •  3
    const re = /([+-]?\d[\d.,]*\s*(?:‰|%|TL|₺)?)/g;

    // Tüm metin düğümlerini topla (önce toplayıp sonra değiştir – güvenli)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (re.test(node.nodeValue)) textNodes.push(node);
      re.lastIndex = 0; // reset
    }

    textNodes.forEach((txt) => {
      const parts = txt.nodeValue.split(re);
      const frag = document.createDocumentFragment();
      for (let i = 0; i < parts.length; i++) {
        const str = parts[i];
        if (!str) continue;
        if (i % 2 === 1) {
          // eşleşen kısım
          const s = document.createElement("span");
          s.className = "num";
          s.textContent = str;
          frag.appendChild(s);
        } else {
          frag.appendChild(document.createTextNode(str));
        }
      }
      txt.parentNode.replaceChild(frag, txt);
    });
  }

  function buildSet(track, contentHTML, marqueeWidth) {
    // TEMP: tek bir set yarat
    const container = document.createElement("div");
    container.className = "marquee__set";
    container.innerHTML = contentHTML;

    // Rakamlara .num sar (neon yalnızca bunlara uygulanacak)
    wrapDigitsInElement(container);

    track.replaceChildren(container);

    // Set ekranı doldurmuyorsa, içeriği set içinde tekrar et
    const baseChildren = Array.from(container.children).map((n) =>
      n.cloneNode(true)
    );
    while (container.scrollWidth < marqueeWidth) {
      container.append(...baseChildren.map((n) => n.cloneNode(true)));
    }
    return container;
  }

  function setupOne(marquee) {
    const track = marquee.querySelector(".marquee__inner");
    if (!track) return;

    // Orijinal içerik (span’lar vs.) ilk seferde saklanır
    const original =
      track.getAttribute("data-original") || track.innerHTML.trim();
    if (!track.hasAttribute("data-original")) {
      track.setAttribute("data-original", original);
    }

    // 1) Tek seti inşa et, ekranı doldur (ve rakamları sar)
    const set = buildSet(track, original, marquee.clientWidth);

    // 2) Bu seti yan yana iki kez koy (kesintisiz döngü için)
    const set1 = set.cloneNode(true);
    const set2 = set.cloneNode(true);
    track.replaceChildren(set1, set2);

    // 3) Set genişliği = bir turda kaydırılacak mesafe
    const cycle = track.firstElementChild.scrollWidth;

    // 4) Hız: data-speed > CSS var(--speed-pps) > 80
    const dataSpeed = marquee.getAttribute("data-speed");
    const cssSpeed = getComputedStyle(marquee)
      .getPropertyValue("--speed-pps")
      .trim();
    const pps = Number(dataSpeed || cssSpeed || 80);
    const durationSec = cycle / pps;

    track.style.setProperty("--cycle", String(cycle));
    track.style.setProperty("--duration", durationSec + "s");
  }

  function setupAll() {
    ALL.forEach(setupOne);
  }

  setupAll();

  // Resize olduğunda tek frame’de yeniden kur
  let rAF;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(setupAll);
  });
})();
