const alkolOranlari = {
    bira: 0.05,
    sarap: 0.12,
    votka: 0.40,
    viski: 0.43,
    rakı: 0.45
  };
  
  function promilYorum(promil) {
    if (promil < 0.3) return "Genel olarak güvendesiniz.";
    if (promil < 0.8) return "Hafif sarhoşluk, dikkat dağınıklığı başlayabilir.";
    if (promil < 1.5) return "Denge bozukluğu ve refleks kaybı yaşanabilir.";
    if (promil < 2.5) return "Ciddi sarhoşluk, yasal sınırların üzerindesiniz.";
    return "Zehirlenme riski var, tıbbi yardım gerekebilir!";
  }
  
  document.getElementById('promilForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const kilo = parseFloat(document.getElementById('kilo').value);
    const cinsiyet = document.getElementById('cinsiyet').value;
    const miktar = parseFloat(document.getElementById('miktar').value);
    const icki = document.getElementById('icki').value;
    const saat = parseFloat(document.getElementById('saat').value);
  
    const alkolOrani = alkolOranlari[icki];
    const vucutSuKatsayisi = cinsiyet === 'erkek' ? 0.7 : 0.6;
    const yakimOrani = cinsiyet === 'erkek' ? 0.15 : 0.12;
  
    const baslangicPromil = (miktar * alkolOrani * 0.8) / (kilo * vucutSuKatsayisi);
    const kalanPromil = Math.max(baslangicPromil - (saat * yakimOrani), 0).toFixed(2);
    const yorum = promilYorum(kalanPromil);
  
    document.getElementById('sonuc').innerHTML =
      `Başlangıç Promil: ${baslangicPromil.toFixed(2)} ‰<br>
       Geçen ${saat} saat sonra tahmini promil: ${kalanPromil} ‰<br><br>
       <strong>Durum:</strong> ${yorum}`;
  
    // Paylaş kutusunu göster
    document.getElementById('paylasKutu').style.display = 'block';
  
    // Paylaş butonu işlevi
    document.getElementById('paylasBtn').onclick = () => {
      const text = `Benim tahmini alkol promilim: ${kalanPromil} ‰ — ${yorum}`;
      const url = "https://alpolcaymis.com";
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(tweetUrl, '_blank');
    };
  });
  