const ortalamalar = {
  erkek: { kilo: 78, boy: 175 },
  kadın: { kilo: 65, boy: 162 },
};

const alkolOranlari = {
  bira: 0.05,
  sarap: 0.12,
  votka: 0.4,
  viski: 0.43,
  rakı: 0.45,
  cin: 0.4,
  tekila: 0.38,
  jager: 0.35,
  tekila_shot: 0.4,
  cin_tonic: 0.12,
  whisky_sour: 0.43,
  raki_double: 0.45,
};

const varsayilanHacimler = {
  bira: 500,
  sarap: 150,
  rakı: 40,
  raki_double: 80,
  votka: 40,
  viski: 50,
  cin: 40,
  tekila: 40,
  jager: 40,
  tekila_shot: 40,
  cin_tonic: 40,
  whisky_sour: 120,
};

// Cinsiyet seçimi
const genderButtons = document.querySelectorAll(".gender-button");
const genderInput = document.getElementById("cinsiyet");
const kiloInput = document.getElementById("kilo");
const boyInput = document.getElementById("boy");

genderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    genderButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    genderInput.value = btn.dataset.cinsiyet;

    // 👇 Kilo ve boy inputlarını otomatik ayarla
    const cinsiyet = btn.dataset.cinsiyet;
    if (ortalamalar[cinsiyet]) {
      kiloInput.value = ortalamalar[cinsiyet].kilo;
      boyInput.value = ortalamalar[cinsiyet].boy;
    }
  });
});

function promilYorum(promil) {
  if (promil <= 0.5) return "Yasal sınırın altındasınız. Ceza almazsınız.";
  if (promil < 1.0) return "Yasal sınırı aştınız. Ehliyetinize el konulabilir.";
  return "Çok yüksek promil! Ceza ve ehliyete el koyma dışında adli işlem riski var.";
}

function promilSeviyeSinifi(promil) {
  if (promil <= 0.5) return "result-safe";
  if (promil < 1.0) return "result-warning";
  return "result-danger";
}

const form = document.getElementById("promilForm");
const sonucBox = document.getElementById("sonuc");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Animasyonu başlat
  document.getElementById("loadingOverlay").classList.add("show");

  // Animasyon süresi içinde hesaplamayı geciktir
  setTimeout(() => {
    document.getElementById("loadingOverlay").classList.remove("show");

    // Buradan sonrası hesaplama
    if (!genderInput.value) {
      alert("Lütfen cinsiyet seçin.");
      return;
    }

    const kilo = parseFloat(document.getElementById("kilo").value);
    const boyCm = parseFloat(document.getElementById("boy").value);
    const boyM = boyCm / 100;
    const cinsiyet = genderInput.value;
    const saat = parseFloat(document.getElementById("saat").value);

    const ickiGruplari = document.querySelectorAll(".icki-grubu");
    let safAlkolGram = 0;

    ickiGruplari.forEach((grup) => {
      const adet = parseFloat(grup.querySelector(".icki-adet").value) || 0;
      const hacim = parseFloat(grup.querySelector(".icki-hacim").value) || 0;
      const oran =
        parseFloat(grup.querySelector(".icki-alkol").value) / 100 || 0;
      safAlkolGram += adet * hacim * oran * 0.789;
    });

    let kanHacmiLitre = 0;
    if (cinsiyet === "erkek") {
      kanHacmiLitre = 0.3669 * Math.pow(boyM, 3) + 0.03219 * kilo + 0.6041;
    } else {
      kanHacmiLitre = 0.3561 * Math.pow(boyM, 3) + 0.03308 * kilo + 0.1833;
    }

    const baslangicPromil = (safAlkolGram / (kanHacmiLitre * 1000)) * 100;

    let promilRenkSinifi = "";
    if (baslangicPromil <= 0.5) {
      promilRenkSinifi = "promil-beyaz";
    }

    const yakimOrani = cinsiyet === "erkek" ? 0.15 : 0.12;
    const kalanPromil = Math.max(
      baslangicPromil - saat * yakimOrani,
      0
    ).toFixed(2);
    const yorum = promilYorum(kalanPromil);

    const kalanSaat =
      kalanPromil > 0 ? (kalanPromil / yakimOrani).toFixed(1) : 0;
    const ayilmaMesaji =
      kalanPromil > 0
        ? `Tahmini olarak yaklaşık ${kalanSaat} saat sonra ayılmaya başlarsınız.`
        : `Promil seviyeniz sıfıra çok yakın, ayık durumdasınız.`;

    const sinif = promilSeviyeSinifi(kalanPromil);
    sonucBox.className = `result-box ${sinif} show`;

    let durumSinifi = "";
    let promilMesaj = "";
    let durumSembol = "";

    if (baslangicPromil <= 0.5) {
      durumSinifi = "safe";
      promilMesaj = "Testi Geçtiniz";
      durumSembol = "✅";
    } else if (baslangicPromil <= 1.0) {
      durumSinifi = "warning";
      promilMesaj = "Sınırın Üstündesiniz";
      durumSembol = "⚠️";
    } else {
      durumSinifi = "danger";
      promilMesaj = "Yasal Olarak Sürüşe Uygun Değilsiniz";
      durumSembol = "❌";
    }

    sonucBox.innerHTML = `
      
       <div class="promil-info-bar ${durumSinifi}">
       
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#dabf75" stroke-width="2" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" />
  <line x1="12" y1="8" x2="12" y2="8" />
  <line x1="12" y1="12" x2="12" y2="16" />
</svg>

    <span class="promil-baslik">${promilMesaj}</span>
    <span class="promil-status-icon">${durumSembol}</span>
  </div>

      

      <div class="promil-wrapper">
        <div class="promil-label ${promilRenkSinifi}">Promil</div>
<div class="promil-deger ${promilRenkSinifi}">${baslangicPromil.toFixed(
      2
    )}</div>
      </div>

      <p class="result-note">
        * Bu hesaplama özel araç kullanıcıları içindir. Ticari araç ve ağır vasıta
        sürücüleri için yasal sınır <strong>0.00%</strong>’dir.
      </p>

      <div class="ek-veriler-satir">
        <span
          ><strong>Kan Hacminiz (mL):</strong> ${(kanHacmiLitre * 1000).toFixed(
            0
          )}</span
        >
        <span><strong>Alınan Alkol (g):</strong> ${safAlkolGram.toFixed(
          1
        )}</span>
      </div>

      Geçen ${saat} saat sonra tahmini promil: ${kalanPromil} %<br /><br />
      <strong>Durum:</strong> ${yorum}<br /><br />
      <strong>${ayilmaMesaji}</strong>
      `;

    sonucBox.style.display = "block";

    // Ekranı otomatik kaydır
    document.getElementById("sonuc").scrollIntoView({ behavior: "smooth" });

    document.getElementById("paylasKutu").style.display = "block";
    document.getElementById("paylasBtn").onclick = () => {
      const text = `Benim tahmini promilim: ${kalanPromil} ‰ — ${yorum}`;
      const url = "https://promilhesapla.com";
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`;
      window.open(tweetUrl, "_blank");
    };
  }, 1200); // 1200ms bekletiyoruz
});

// === İçki Ekle ===
const ickiAlani = document.getElementById("ickilerAlani");
const ickiEkleBtn = document.getElementById("ickiEkleBtn");

ickiEkleBtn.addEventListener("click", () => {
  const yeniGrup = document.createElement("div");
  yeniGrup.classList.add("icki-grubu");

  yeniGrup.innerHTML = `
    <div class="icki-ust">
      <div class="icki-select-wrapper">
      <label for="ickiSecimi">Alkol Türü:</label>
        <select class="icki-turu">
          <option value="bira">Bira</option>
          <option value="sarap">Şarap</option>
          <option value="rakı">Rakı Tek</option>
          <option value="raki_double">Rakı Double</option>
          <option value="votka">Votka</option>
          <option value="viski">Viski</option>          
          <option value="cin">Cin</option>
          <option value="tekila">Tekila</option>
          <option value="jager">Jagermeister Shot</option>
          <option value="tekila_shot">Tekila Shot</option>
          <option value="cin_tonic">Cin Tonic</option>
          <option value="whisky_sour">Whisky Sour</option>
        </select>
         <div class="custom-arrow">
    <!-- SVG kodu buraya gelecek -->
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#dabf75" stroke-width="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6"/>
    </svg>
    

  </div>
      </div>
      <button type="button" class="icki-sil">🗑️</button>
    </div>

    <div class="icki-alt">
      <img src="img/bira.png" alt="İçki" class="icki-icon" />
      <div class="icki-input-kolon">
        <label>Adet</label>
        <div class="input-step">
          <button type="button" class="azalt">−</button>
          <input type="number" class="icki-adet" value="1" min="1" required />
          <button type="button" class="arttir">+</button>
        </div>

        <label>Hacim (ml)</label>
        <div class="input-step">
          <button type="button" class="azalt">−</button>
          <input type="number" class="icki-hacim" value="500" required />
          <button type="button" class="arttir">+</button>
        </div>

        <label>Alkol Oranı % </label>
        <div class="input-step">
          <button type="button" class="azalt">−</button>
          <input type="number" class="icki-alkol" value="5" required />
          <button type="button" class="arttir">+</button>
        </div>
      </div>
    </div>
  `;

  ickiAlani.appendChild(yeniGrup);

  // Gecikmeli fonksiyon bağlama (önemli)
  setTimeout(() => {
    silmeButonlariniGuncelle();
    resimleriGuncelle();
    sayacButonlariniAktiflestir();
  }, 0);
});

// === Sil Butonları ===
function silmeButonlariniGuncelle() {
  const silBtns = document.querySelectorAll(".icki-sil");
  silBtns.forEach((btn) => {
    btn.style.display = "inline-block";
    btn.onclick = () => btn.parentElement.parentElement.remove();
  });
  if (silBtns.length === 1) {
    silBtns[0].style.display = "none";
  }
}

function resimleriGuncelle() {
  const gruplar = document.querySelectorAll(".icki-grubu");
  gruplar.forEach((grup) => {
    const select = grup.querySelector(".icki-turu");
    const img = grup.querySelector(".icki-icon");
    const alkolInput = grup.querySelector(".icki-alkol");
    const hacimInput = grup.querySelector(".icki-hacim");

    select.addEventListener("change", () => {
      const secilenTur = select.value;
      img.src = `img/${secilenTur}.png`;
      img.alt = secilenTur;

      if (alkolOranlari[secilenTur] !== undefined) {
        alkolInput.value = (alkolOranlari[secilenTur] * 100).toFixed(1);
      }

      if (varsayilanHacimler[secilenTur] !== undefined) {
        hacimInput.value = varsayilanHacimler[secilenTur];
      }
    });
  });
}

function sayacButonlariniAktiflestir() {
  document.querySelectorAll(".input-step").forEach((wrapper) => {
    const input = wrapper.querySelector("input");
    const azaltBtn = wrapper.querySelector(".azalt");
    const arttirBtn = wrapper.querySelector(".arttir");

    azaltBtn.onclick = () => {
      let val = parseFloat(input.value) || 0;
      let step = 1;

      if (input.classList.contains("icki-hacim")) step = 10;
      if (input.classList.contains("icki-alkol")) step = 0.5;
      // saat için step = 1 zaten default ama istersen belirt:
      if (input.classList.contains("saat-input")) step = 0.5;

      input.value = Math.max(val - step, input.min ? parseFloat(input.min) : 0);
    };

    arttirBtn.onclick = () => {
      let val = parseFloat(input.value) || 0;
      let step = 1;

      if (input.classList.contains("icki-hacim")) step = 10;
      if (input.classList.contains("icki-alkol")) step = 0.5;
      if (input.classList.contains("saat-input")) step = 0.5;

      input.value = val + step;
    };
  });
}
// === Sayfa yüklenince 1 içki kutusu gelsin ===
ickiEkleBtn.click();

window.addEventListener("DOMContentLoaded", () => {
  genderButtons.forEach((btn) => {
    if (btn.dataset.cinsiyet === "erkek") {
      btn.classList.add("selected");
      genderInput.value = "erkek";
    }
  });
  kiloInput.value = ortalamalar["erkek"].kilo;
  boyInput.value = ortalamalar["erkek"].boy;

  sayacButonlariniAktiflestir(); // input-step butonlarını etkinleştir
});
