document.getElementById('promilForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const kilo = parseFloat(document.getElementById('kilo').value);
    const cinsiyet = document.getElementById('cinsiyet').value;
    const miktar = parseFloat(document.getElementById('miktar').value);
  
    const alkolOrani = 0.08; // %8 alkol oranı varsayımı
    const vucutSuKatsayisi = cinsiyet === 'erkek' ? 0.7 : 0.6;
  
    const promil = ((miktar * alkolOrani * 0.8) / (kilo * vucutSuKatsayisi)).toFixed(2);
  
    document.getElementById('sonuc').textContent = `Tahmini Promil: ${promil} ‰`;
  });
  