// src/App.js
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDj5-F10syG0bHcPGlHiI99UCrdyy0KHOo",
  authDomain: "zamanla-eaec0.firebaseapp.com",
  projectId: "zamanla-eaec0",
  storageBucket: "zamanla-eaec0.firebasestorage.app",
  messagingSenderId: "962945287538",
  appId: "1:962945287538:web:5e08c83668d693f77a49eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function TimerApp() {
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const saveUserToDB = async (userData, savedTime = 0) => {
    const userRef = doc(collection(db, "users"), userData.uid);
    await setDoc(userRef, {
      time: savedTime,
      name: userData.displayName || userData.email,
      photo: userData.photoURL || ""
    }, { merge: true });

    setUser(userData);
    setTime(savedTime);
    fetchLeaderboard();
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const userData = result.user;
    const userRef = doc(collection(db, "users"), userData.uid);
    const userSnap = await getDoc(userRef);
    const savedTime = userSnap.exists() ? userSnap.data().time || 0 : 0;
    await saveUserToDB(userData, savedTime);
  };

  const signInWithEmail = async () => {
    try {
      let result;
      if (isNewUser) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      const userData = result.user;
      const userRef = doc(collection(db, "users"), userData.uid);
      const userSnap = await getDoc(userRef);
      const savedTime = userSnap.exists() ? userSnap.data().time || 0 : 0;
      await saveUserToDB(userData, savedTime);
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const saveTime = async () => {
    if (user) {
      const userRef = doc(collection(db, "users"), user.uid);
      await setDoc(userRef, {
        time,
        name: user.displayName || user.email,
        photo: user.photoURL || ""
      }, { merge: true });
      fetchLeaderboard();
    }
  };

  const resetTime = async () => {
    setTime(0);
    if (user) {
      const userRef = doc(collection(db, "users"), user.uid);
      await setDoc(userRef, {
        time: 0,
        name: user.displayName || user.email,
        photo: user.photoURL || ""
      }, { merge: true });
      fetchLeaderboard();
    }
  };

  const fetchLeaderboard = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    users.sort((a, b) => b.time - a.time);
    setLeaderboard(users);
  };

  return (
    <div className="container text-center mt-5">
      {!user ? (
        <div className="space-y-3">
          <button onClick={signInWithGoogle} className="btn btn-primary btn-lg">
            Google ile Giriş Yap
          </button>
          <div className="my-3">
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-2"
            />
            <button onClick={signInWithEmail} className="btn btn-success me-2">
              {isNewUser ? "Kayıt Ol" : "Giriş Yap"}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsNewUser(!isNewUser)}
            >
              {isNewUser ? "Giriş Ekranına Dön" : "Yeni Hesap Oluştur"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="mb-4">Merhaba, {user.displayName || user.email}!</h1>
          <h4 className="mb-3">
            Geçen Süre: <span className="text-primary fw-bold">{time} saniye</span>
          </h4>
          <div className="mb-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`btn btn-lg me-3 ${isRunning ? "btn-danger" : "btn-success"}`}
            >
              {isRunning ? "Durdur" : "Başlat"}
            </button>
            <button onClick={saveTime} className="btn btn-warning btn-lg me-3">
              Kaydet
            </button>
            <button onClick={resetTime} className="btn btn-secondary btn-lg">
              Sıfırla
            </button>
          </div>

          <h3 className="mt-5 mb-4">🏆 Liderlik Tablosu</h3>
          <div className="row justify-content-center">
            {leaderboard.map((u, index) => (
              <div key={u.id} className="col-md-6 mb-3">
                <div className="card d-flex flex-row align-items-center p-3 shadow-sm">
                  <img
                    src={u.photo || "https://via.placeholder.com/50"}
                    alt="profile"
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div className="flex-grow-1 text-start">
                    <h5 className="mb-1">
                      {index + 1}. {u.name || "Bilinmeyen"}
                    </h5>
                    <small className="text-primary fw-bold">{u.time} saniye</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
