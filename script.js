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
  whisky_sour: 0.15,
  raki_double: 0.45,
};

// Cinsiyet seçimi
const genderButtons = document.querySelectorAll(".gender-button");
const genderInput = document.getElementById("cinsiyet");

genderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    genderButtons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    genderInput.value = btn.dataset.cinsiyet;
  });
});

// Promil yorumu
function promilYorum(promil) {
  if (promil < 0.3) return "Genel olarak güvendesiniz.";
  if (promil < 0.8) return "Hafif sarhoşluk, dikkat dağınıklığı başlayabilir.";
  if (promil < 1.5) return "Denge bozukluğu ve refleks kaybı yaşanabilir.";
  if (promil < 2.5) return "Ciddi sarhoşluk, yasal sınırların üzerindesiniz.";
  return "Zehirlenme riski var, tıbbi yardım gerekebilir!";
}

function promilSeviyeSinifi(promil) {
  if (promil < 0.3) return "result-safe";
  if (promil < 0.8) return "result-warning";
  return "result-danger";
}

const form = document.getElementById("promilForm");
const sonucBox = document.getElementById("sonuc");

form.addEventListener("submit", function (e) {
  e.preventDefault();

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
    const oran = parseFloat(grup.querySelector(".icki-alkol").value) / 100 || 0;
    safAlkolGram += adet * hacim * oran * 0.8;
  });

  // Nadler Equation
  let kanHacmiLitre = 0;
  if (cinsiyet === "erkek") {
    kanHacmiLitre = 0.3669 * Math.pow(boyM, 3) + 0.03219 * kilo + 0.6041;
  } else {
    kanHacmiLitre = 0.3561 * Math.pow(boyM, 3) + 0.03308 * kilo + 0.1833;
  }

  const baslangicPromil = (safAlkolGram / (kanHacmiLitre * 1000)) * 100;
  const yakimOrani = cinsiyet === "erkek" ? 0.15 : 0.12;
  const kalanPromil = Math.max(baslangicPromil - saat * yakimOrani, 0).toFixed(
    2
  );
  const yorum = promilYorum(kalanPromil);

  const kalanSaat = kalanPromil > 0 ? (kalanPromil / yakimOrani).toFixed(1) : 0;
  const ayilmaMesaji =
    kalanPromil > 0
      ? `Tahmini olarak yaklaşık ${kalanSaat} saat sonra ayılmaya başlarsınız.`
      : `Promil seviyeniz sıfıra çok yakın, ayık durumdasınız.`;

  const sinif = promilSeviyeSinifi(kalanPromil);
  sonucBox.className = `result-box ${sinif} show`;
  sonucBox.innerHTML = `Başlangıç Promil: ${baslangicPromil.toFixed(2)} ‰<br>
     Geçen ${saat} saat sonra tahmini promil: ${kalanPromil} ‰<br><br>
     <strong>Durum:</strong> ${yorum}<br><br>
     <strong>${ayilmaMesaji}</strong>`;
  sonucBox.style.display = "block";

  document.getElementById("paylasKutu").style.display = "block";
  document.getElementById("paylasBtn").onclick = () => {
    const text = `Benim tahmini promilim: ${kalanPromil} ‰ — ${yorum}`;
    const url = "https://promilhesapla.com";
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, "_blank");
  };
});

// === İçki Ekle ===
const ickiAlani = document.getElementById("ickilerAlani");
const ickiEkleBtn = document.getElementById("ickiEkleBtn");

ickiEkleBtn.addEventListener("click", () => {
  const yeniGrup = document.createElement("div");
  yeniGrup.classList.add("icki-grubu");

  // içki seçenekleri
  yeniGrup.innerHTML = `
    <div class="icki-ust">
      <div class="icki-select-wrapper">
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

        <label>Alkol %</label>
        <div class="input-step">
          <button type="button" class="azalt">−</button>
          <input type="number" class="icki-alkol" value="5" required />
          <button type="button" class="arttir">+</button>
        </div>
      </div>
    </div>
  `;

  ickiAlani.appendChild(yeniGrup);
  silmeButonlariniGuncelle();
  resimleriGuncelle();
  sayacButonlariniAktiflestir();
});

// === Silme Butonları ===
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

// === Resim Güncelle ===
// function resimleriGuncelle() {
//   const gruplar = document.querySelectorAll(".icki-grubu");
//   gruplar.forEach((grup) => {
//     const select = grup.querySelector(".icki-turu");
//     const img = grup.querySelector(".icki-icon");
//     select.addEventListener("change", () => {
//       img.style.opacity = 0;
//       setTimeout(() => {
//         img.src = `img/${select.value}.png`;
//         img.alt = select.value;
//         img.style.opacity = 1;
//       }, 150);
//     });
//   });
// }

function resimleriGuncelle() {
  const gruplar = document.querySelectorAll(".icki-grubu");
  gruplar.forEach((grup) => {
    const select = grup.querySelector(".icki-turu");
    const img = grup.querySelector(".icki-icon");
    const alkolInput = grup.querySelector(".icki-alkol");

    select.addEventListener("change", () => {
      const secilenTur = select.value;
      img.src = `img/${secilenTur}.png`;
      img.alt = secilenTur;

      if (alkolOranlari[secilenTur] !== undefined) {
        alkolInput.value = (alkolOranlari[secilenTur] * 100).toFixed(1); // 0.4 → 40.0
      }
    });
  });
}

// === Sayaç + / − Butonları ===
function sayacButonlariniAktiflestir() {
  document.querySelectorAll(".input-step").forEach((wrapper) => {
    const input = wrapper.querySelector("input");
    const azaltBtn = wrapper.querySelector(".azalt");
    const arttirBtn = wrapper.querySelector(".arttir");

    azaltBtn.onclick = () => {
      let val = parseFloat(input.value) || 0;
      input.value = Math.max(val - 1, input.min ? parseFloat(input.min) : 0);
    };

    arttirBtn.onclick = () => {
      let val = parseFloat(input.value) || 0;
      input.value = val + 1;
    };
  });
}

// === Sayfa Yüklenince 1 içki kutusu otomatik eklensin ===
ickiEkleBtn.click();
