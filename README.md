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

3. `.env` **dosyası oluşturun ve değerleri doldurun.**
    ```env
    REACT_APP_FIREBASE_API_KEY=
    REACT_APP_FIREBASE_AUTH_DOMAIN=
    REACT_APP_FIREBASE_PROJECT_ID=
    REACT_APP_FIREBASE_STORAGE_BUCKET=
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
    REACT_APP_FIREBASE_APP_ID=
    REACT_APP_FIREBASE_MEASUREMENT_ID=
    ```

4. **Uygulamayı başlatın:**
   ```sh
   npm start
   ```
   Ardından tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Kullanılan Teknolojiler

- Node.js
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
