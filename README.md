# Zamanlayıcı Uygulaması

Bu proje kullanıcıların süre tutabileceği, Pomodoro tekniğini kullanabileceği ve istatistiklerini görebileceği bir zamanlayıcı uygulamasıdır. Firebase ile kimlik doğrulama ve veri saklama işlemleri yapılmaktadır.

## Özellikler

- E-posta/şifre veya Google ile giriş/kayıt olma
- Zamanlayıcı başlatma, durdurma ve sıfırlama
- Pomodoro zamanlayıcı (25 dakika çalışma, 5 dakika mola)
- Günlük, haftalık ve aylık istatistikler
- Liderlik tablosu (en çok süre tutanlar)
- Koyu/Açık tema desteği
- Profil sayfası

## Kurulum ve Çalıştırma

1. **Depoyu klonlayın:**
   ```sh
   git clone https://github.com/Furkankozz/zamanlayici-app
   cd zamanlayici-app
   ```

2. **Bağımlılıkları yükleyin:**
   ```sh
   npm install
   ```

3. **Uygulamayı başlatın:**
   ```sh
   npm start
   ```
   Ardından tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Kullanılan Teknolojiler

- React
- Firebase (Authentication & Firestore)
- Chart.js & react-chartjs-2
- date-fns
- Bootstrap

## Proje Yapısı

- `src/App.js`: Ana uygulama bileşeni
- `src/AppRouter.js`: Sayfa yönlendirme
- `src/ProfilePage.js`: Profil sayfası
- `src/StatisticsChart.js`: İstatistik grafik bileşeni
- `src/firebase.js`: Firebase yapılandırması
