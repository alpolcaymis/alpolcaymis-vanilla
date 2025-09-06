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
  cin_tonic: 0.4,
  whisky_sour: 0.43,
  raki_double: 0.45,
};

const varsayilanHacimler = {
  bira: 500,
  sarap: 150,
  rakı: 40,
  raki_double: 80,
  votka: 40,
  viski: 40,
  cin: 40,
  tekila: 40,
  jager: 40,
  tekila_shot: 40,
  cin_tonic: 50,
  whisky_sour: 50,
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

  // === Yükleme Animasyonu Başlat ===
  document.getElementById("loadingOverlay").classList.add("show");

  // === Hesaplama Gecikmeli Başlat ===
  setTimeout(() => {
    document.getElementById("loadingOverlay").classList.remove("show");

    if (!genderInput.value) {
      alert("Lütfen cinsiyet seçin.");
      return;
    }

    // === Giriş Değerlerini Al ===
    const kilo = parseFloat(document.getElementById("kilo").value);
    const boyCm = parseFloat(document.getElementById("boy").value);
    const boyM = boyCm / 100;
    const cinsiyet = genderInput.value;
    const saat = parseFloat(document.getElementById("saat").value);

    // === Alınan Alkol Miktarını Hesapla ===
    const ickiGruplari = document.querySelectorAll(".icki-grubu");
    let safAlkolGram = 0;

    ickiGruplari.forEach((grup) => {
      const adet = parseFloat(grup.querySelector(".icki-adet").value) || 0;
      const hacim = parseFloat(grup.querySelector(".icki-hacim").value) || 0;
      const oran =
        parseFloat(grup.querySelector(".icki-alkol").value) / 100 || 0;
      safAlkolGram += adet * hacim * oran * 0.789;
    });

    // === Kan Hacmini Hesapla (Nadler formülü) ===
    let kanHacmiLitre = 0;
    if (cinsiyet === "erkek") {
      kanHacmiLitre = 0.3669 * Math.pow(boyM, 3) + 0.03219 * kilo + 0.6041;
    } else {
      kanHacmiLitre = 0.3561 * Math.pow(boyM, 3) + 0.03308 * kilo + 0.1833;
    }

    // === Başlangıç Promili Hesapla ===
    const baslangicPromil = (safAlkolGram / (kanHacmiLitre * 1000)) * 100;

    // === Promil Rengi Belirle ===
    let promilRenkSinifi = "";
    if (baslangicPromil <= 0.5) {
      promilRenkSinifi = "promil-beyaz";
    }

    // === Kalan Promil Hesapla ===
    const yakimOrani = cinsiyet === "erkek" ? 0.15 : 0.12;
    const kalanPromil = Math.max(
      baslangicPromil - saat * yakimOrani,
      0
    ).toFixed(2);
    const kalanPromilFloat = parseFloat(kalanPromil);

    // === Promil Yorum ve Görsel Sınıf ===
    const yorum = promilYorum(kalanPromil);
    const sinif = promilSeviyeSinifi(kalanPromil);
    sonucBox.className = `result-box ${sinif} show`;

    // === Yasal Sınır Süresi Hesabı ===
    let yasalSinirSuresi = "";
    let yasalMesaj = "";
    if (baslangicPromil > 0.5) {
      yasalSinirSuresi = ((baslangicPromil - 0.5) / yakimOrani).toFixed(1);
      yasalMesaj = `Promil seviyeniz şu an yasal sınırın üstünde. Yaklaşık <strong>${yasalSinirSuresi} saat</strong> sonra 0.50 promil altına inecektir.`;
    } else {
      yasalMesaj = "Promil seviyeniz yasal sınırın altında.";
    }

    // === Promil Bilgisi Mesajı ve Sembol ===
    let durumSinifi = "";
    let promilMesaj = "";
    let durumSembol = "";
    let ekBilgi = "";
    let cezaBilgisi = "";

    if (kalanPromilFloat <= 0.5) {
      durumSinifi = "safe";
      promilMesaj = "Testi Geçtiniz. Trafiğe çıkabilirsiniz";
      durumSembol = "✅";
      ekBilgi =
        "2918 sayılı Karayolları Trafik Kanunu’na göre, özel araç sürücüleri için 0.50 promil ve altı değerler yasal kabul edilir.";
    } else if (kalanPromilFloat <= 1.0) {
      durumSinifi = "warning";
      promilMesaj = "Ceza yersin! 0.50 promil Yasal sınırın üstündesiniz";
      durumSembol = "⚠️";
      ekBilgi =
        "Yasal sınır olan 0.50 promil aşılmıştır. Trafik çevirmesinde alkolmetreye üflenmesi halinde idari para cezası ve ehliyetin geçici olarak alınması riski doğar.";
      cezaBilgisi = `<div class="ek-ceza-bilgi">🚓 <strong>2025 Bilgilendirme:</strong> 0.51 – 1.00 promil arası: <strong>9.268 TL</strong> ceza ve <strong>6 ay</strong> ehliyete el koyma uygulanır.</div>`;
    } else {
      durumSinifi = "danger";
      promilMesaj = "Kesin Ceza Yersin! Arabadan uzak durun!";
      durumSembol = "❌";
      ekBilgi =
        "1.00 promil üstü durumlar Türk Ceza Kanunu ve Karayolları Trafik Yönetmeliği uyarınca alkollü araç kullanmakla birlikte trafik güvenliğini tehlikeye sokma suçlarını oluşturabilir.";
      cezaBilgisi = `<div class="ek-ceza-bilgi">❌ <strong>2025 Uyarısı:</strong> 1.00 promil üzeri: Adli işlem, <strong>2 yıla kadar</strong> ehliyete el koyma ve ağır yaptırımlar (TCK 179) uygulanır.</div>`;
    }

    // === Sonuç Kutusunu Oluştur ===
    sonucBox.innerHTML = `
      <div class="promil-info-bar ${durumSinifi}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16h-1v-6h2v5h-1v1zm0-7h-1V7h2v4z"
          />
        </svg>
        <span class="promil-baslik">${promilMesaj}</span>
        <span class="promil-status-icon">${durumSembol}</span>
      </div>

      <div class="promil-wrapper">
        <div class="promil-label ${promilRenkSinifi}">Promil</div>
        <div class="promil-deger ${promilRenkSinifi}">${kalanPromil}</div>
      </div>

      <div class="promil-ek-info">${ekBilgi}</div>

      <p class="result-note">
        * Ticari araç sürücüleri için yasal sınır <strong>0.20%</strong>’dir. 
      * 2 yılını doldurmamış aday sürücüler için yasal sınır <strong>0.20%</strong>’dir.
      <br/>
      </p>

      <div class="ek-veriler-satir">
        <span
          ><strong>Kan Hacminiz:</strong> ${(kanHacmiLitre * 1000).toFixed(0)}
          mL</span
        >
        <span><strong>Alınan Alkol:</strong> ${safAlkolGram.toFixed(1)} g</span>
      </div>

      <strong>Başlangıç Promil:</strong> ${baslangicPromil.toFixed(2)} ‰
      <br />
      <br />
      <strong>Durum:</strong> ${yorum}
      <p class="yasal-mesaj">${yasalMesaj}</p>
      ${cezaBilgisi}
      <p class="minik-yasal">
        "Bu ölçümler veri bazlı tahminlere dayanmaktadır ve herhangi bir kesinlik
        teşkil etmemektedir. Buradaki verilere göre hareket ederek, kendinizin ve etrafınızdakilerin can güvenliğini tehlikeye atmayınız❗"</p>      
    `;

    sonucBox.style.display = "block";

    // === Otomatik Kaydır ve Paylaş ===
    document.getElementById("sonuc").scrollIntoView({ behavior: "smooth" });
  }, 1200);
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
      else if (input.classList.contains("icki-alkol")) step = 2.5;
      else if (input.classList.contains("saat-input")) step = 0.5;

      input.value = Math.max(val - step, input.min ? parseFloat(input.min) : 0);
    };

    arttirBtn.onclick = () => {
      let val = parseFloat(input.value) || 0;
      let step = 1;

      if (input.classList.contains("icki-hacim")) step = 10;
      else if (input.classList.contains("icki-alkol")) step = 2.5;
      else if (input.classList.contains("saat-input")) step = 0.5;

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
