const alkolOranlari = {
  bira: 0.05,
  sarap: 0.12,
  votka: 0.40,
  viski: 0.43,
  rakı: 0.45
};

// Cinsiyet seçimi
const genderButtons = document.querySelectorAll('.gender-button');
const genderInput = document.getElementById('cinsiyet');

genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    genderButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    genderInput.value = btn.dataset.cinsiyet;
  });
});

// Tema geçişi
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark')
    ? '☀️ Gündüz Modu'
    : '🌙 Gece Modu';
});

// Promil yorum ve renk
function promilYorum(promil) {
  if (promil < 0.3) return "Genel olarak güvendesiniz.";
  if (promil < 0.8) return "Hafif sarhoşluk, dikkat dağınıklığı başlayabilir.";
  if (promil < 1.5) return "Denge bozukluğu ve refleks kaybı yaşanabilir.";
  if (promil < 2.5) return "Ciddi sarhoşluk, yasal sınırların üzerindesiniz.";
  return "Zehirlenme riski var, tıbbi yardım gerekebilir!";
}

function promilSeviyeSinifi(promil) {
  if (promil < 0.3) return 'result-safe';
  if (promil < 0.8) return 'result-warning';
  return 'result-danger';
}

const form = document.getElementById('promilForm');
const sonucBox = document.getElementById('sonuc');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!genderInput.value) {
    alert("Lütfen cinsiyet seçin.");
    return;
  }

  const kilo = parseFloat(document.getElementById('kilo').value);
  const boyCm = parseFloat(document.getElementById('boy').value);
  const boyM = boyCm / 100;
  const cinsiyet = genderInput.value;
  const saat = parseFloat(document.getElementById('saat').value);

  // ✅ Tüm içkilerden alkol gramı
  const ickiGruplari = document.querySelectorAll('.icki-grubu');
  let safAlkolGram = 0;

  ickiGruplari.forEach(grup => {
    const adet = parseFloat(grup.querySelector('.icki-adet').value) || 0;
    const hacim = parseFloat(grup.querySelector('.icki-hacim').value) || 0;
    const oran = parseFloat(grup.querySelector('.icki-alkol').value) / 100 || 0;
    safAlkolGram += adet * hacim * oran * 0.8;
  });

  // ✅ Nadler Equation ile kan hacmi (litre)
  let kanHacmiLitre = 0;
  if (cinsiyet === 'erkek') {
    kanHacmiLitre = 0.3669 * Math.pow(boyM, 3) + 0.03219 * kilo + 0.6041;
  } else {
    kanHacmiLitre = 0.3561 * Math.pow(boyM, 3) + 0.03308 * kilo + 0.1833;
  }

  // ✅ Bilimsel promil hesabı
  const baslangicPromil = (safAlkolGram / (kanHacmiLitre * 1000)) * 100;
  const yakimOrani = cinsiyet === 'erkek' ? 0.15 : 0.12;
  const kalanPromil = Math.max(baslangicPromil - (saat * yakimOrani), 0).toFixed(2);
  const yorum = promilYorum(kalanPromil);

  const kalanSaat = kalanPromil > 0 ? (kalanPromil / yakimOrani).toFixed(1) : 0;
  const ayilmaMesaji = kalanPromil > 0
    ? `Tahmini olarak yaklaşık ${kalanSaat} saat sonra ayılmaya başlarsınız.`
    : `Promil seviyeniz sıfıra çok yakın, ayık durumdasınız.`;

  const sinif = promilSeviyeSinifi(kalanPromil);
  sonucBox.className = `result-box ${sinif}`;
  sonucBox.innerHTML =
    `Başlangıç Promil: ${baslangicPromil.toFixed(2)} ‰<br>
     Geçen ${saat} saat sonra tahmini promil: ${kalanPromil} ‰<br><br>
     <strong>Durum:</strong> ${yorum}<br><br>
     <strong>${ayilmaMesaji}</strong>`;

  document.getElementById('paylasKutu').style.display = 'block';
  document.getElementById('paylasBtn').onclick = () => {
    const text = `Benim tahmini promilim: ${kalanPromil} ‰ — ${yorum}`;
    const url = "https://promilhesapla.com";
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank');
  };
});

// ✅ İçki satırı ekleme
const ickiAlani = document.getElementById('ickilerAlani');
const ickiEkleBtn = document.getElementById('ickiEkleBtn');

ickiEkleBtn.addEventListener('click', () => {
  const yeniGrup = document.createElement('div');
  yeniGrup.classList.add('icki-grubu');
  yeniGrup.innerHTML = `
    <img src="img/bira.png" alt="İçki" class="icki-icon" />

    <div class="icki-alani">
      <label>Tür</label>
      <select class="icki-turu">
        <option value="bira" selected>Bira</option>
        <option value="sarap">Şarap</option>
        <option value="votka">Votka</option>
        <option value="viski">Viski</option>
        <option value="rakı">Rakı</option>
      </select>
    </div>

    <div class="icki-alani">
      <label>Adet</label>
      <input type="number" class="icki-adet" value="1" min="1" required />
    </div>

    <div class="icki-alani">
      <label>Hacim (ml)</label>
      <input type="number" class="icki-hacim" value="500" required />
    </div>

    <div class="icki-alani">
      <label>Alkol %</label>
      <input type="number" class="icki-alkol" value="5" required />
    </div>

    <button type="button" class="icki-sil">🗑️</button>
  `;
  ickiAlani.appendChild(yeniGrup);
  silmeButonlariniGuncelle();
  resimleriGuncelle();
});

function silmeButonlariniGuncelle() {
  const silBtns = document.querySelectorAll('.icki-sil');
  silBtns.forEach(btn => {
    btn.style.display = 'inline-block';
    btn.onclick = () => btn.parentElement.remove();
  });
  if (silBtns.length === 1) {
    silBtns[0].style.display = 'none';
  }
}

function resimleriGuncelle() {
  const gruplar = document.querySelectorAll('.icki-grubu');
  gruplar.forEach(grup => {
    const select = grup.querySelector('.icki-turu');
    const img = grup.querySelector('.icki-icon');

    select.addEventListener('change', () => {
      img.src = `img/${select.value}.png`;
      img.alt = select.value;
    });
  });
}

silmeButonlariniGuncelle();
resimleriGuncelle();
