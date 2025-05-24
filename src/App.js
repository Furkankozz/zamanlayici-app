import StatisticsChart from "./StatisticsChart";
import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db, provider } from "./firebase";
import { format, subDays, startOfMonth } from "date-fns";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

export default function TimerApp() {
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }  
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboardPage, setShowLeaderboardPage] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("daily");
  const [allUsers, setAllUsers] = useState([]);
  const [showPomodoroPage, setShowPomodoroPage] = useState(false);
const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 dakika
const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
const [pomodoroPhase, setPomodoroPhase] = useState("work"); // work | break



useEffect(() => {
  document.body.className = darkMode ? "dark-mode" : "";
}, [darkMode]);

useEffect(() => {
  let pomodoroInterval;
  if (isPomodoroRunning) {
    pomodoroInterval = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev === 0) {
          if (pomodoroPhase === "work") {
            setPomodoroPhase("break");
            return 300; // 5 dakika mola
          } else {
            setPomodoroPhase("work");
            return 1500; // 25 dakika çalışma
          }
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(pomodoroInterval);
}, [isPomodoroRunning, pomodoroPhase]);
  
useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (user) {
      fetchLogs().then(setLogs);
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    users.sort((a, b) => b.time - a.time);
    setLeaderboard(users);
    setAllUsers(users);
  };

  const fetchLogs = async () => {
    const userRef = doc(db, "users", user.uid);
    const logsCol = collection(userRef, "logs");
    const querySnapshot = await getDocs(logsCol);
    const logs = [];

    querySnapshot.forEach((doc) => {
      const date = doc.id;
      const data = doc.data();
      logs.push({ label: date, time: data.time });
    });

    logs.sort((a, b) => new Date(a.label) - new Date(b.label));
    return logs;
  };
  

  const fetchLogsForAllUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const result = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const logsRef = collection(db, "users", userDoc.id, "logs");
      const logsSnap = await getDocs(logsRef);

      let total = 0;
      const today = format(new Date(), "yyyy-MM-dd");
      const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");
      const startOfCurrentMonth = format(startOfMonth(new Date()), "yyyy-MM-dd");

      let daily = 0, weekly = 0, monthly = 0;

      logsSnap.forEach((log) => {
        const date = log.id;
        const t = log.data().time || 0;
        if (date === today) daily += t;
        if (date >= sevenDaysAgo) weekly += t;
        if (date >= startOfCurrentMonth) monthly += t;
      });

      result.push({
        name: userData.name,
        photo: userData.photo,
        daily,
        weekly,
        monthly,
      });
    }

    return result;
  };

  const saveUserData = async (userData, savedTime = 0) => {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(
      userRef,
      {
        name: userData.displayName || userData.email,
        email: userData.email,
        photo: userData.photoURL || "",
        time: savedTime,
      },
      { merge: true }
    );
  };

  const handleLogin = async () => {
    try {
      let result;
      if (isNewUser) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      const userData = result.user;
      const userRef = doc(db, "users", userData.uid);
      const userSnap = await getDoc(userRef);
      const savedTime = userSnap.exists() ? userSnap.data().time || 0 : 0;

      setUser(userData);
      setTime(savedTime);
    } catch (err) {
      alert("Giriş Hatası: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;

      const userRef = doc(db, "users", userData.uid);
      const userSnap = await getDoc(userRef);
      const savedTime = userSnap.exists() ? userSnap.data().time || 0 : 0;

      await saveUserData(userData, savedTime);
      setUser(userData);
      setTime(savedTime);
    } catch (err) {
      alert("Google ile giriş hatası: " + err.message);
    }
  };

  const handleSave = async () => {
    if (user) {
      const today = format(new Date(), "yyyy-MM-dd");
      const userRef = doc(db, "users", user.uid);
      const logRef = doc(collection(userRef, "logs"), today);

      await setDoc(
        userRef,
        {
          name: user.displayName || user.email,
          email: user.email,
          photo: user.photoURL || "",
          time,
        },
        { merge: true }
      );

      await setDoc(logRef, { time });
      fetchLeaderboard();
      fetchLogs().then(setLogs);
      alert("Süre kaydedildi.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setTime(0);
    setIsRunning(false);
    setShowProfile(false);
    setShowLeaderboardPage(false);
  };

  const renderLeaderboardContent = (tab) => {
    const sorted = [...allUsers]
      .map((u) => ({
        name: u.name,
        photo: u.photo,
        time: u[tab] || 0,
      }))
      .sort((a, b) => b.time - a.time);

    return (
      <div style={{ marginTop: "1rem" }}>
        {sorted.map((u, index) => (
          <div key={index} className="leaderboard-item">
            <img
              src={u.photo || "https://via.placeholder.com/40"}
              alt="profile"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
            <span style={{ flex: 1 }}>{index + 1}. {u.name}</span>
            <span>{u.time} sn</span>
          </div>
        ))}
      </div>
    );
  };

  if (showPomodoroPage) {
    return (
      <div className="pomodoro-container">
        <div className="pomodoro-card">
          <button className="back-button" onClick={() => setShowPomodoroPage(false)}>← Geri</button>
          <h2 className="pomodoro-title">🍅 Pomodoro Zamanlayıcı</h2>
          <p className="session-label">{pomodoroPhase === "work" ? "Çalışma Zamanı" : "Mola Zamanı"}</p>
          <div className="time-display">{formatTime(pomodoroTime)}</div>
          <button className="start-button" onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}>
            {isPomodoroRunning ? "Durdur" : "Başlat"}
          </button>
        </div>
      </div>
    );
  }
  
  if (showProfile && user) {
  return (
    <div className="pomodoro-container">
      <div className="pomodoro-card">
        <button className="back-button" onClick={() => setShowProfile(false)}>← Ana Sayfa</button>
        <h2 className="pomodoro-title">👤 Profil Sayfası</h2>

        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt="Profil"
          className="profile-photo"
        />

        <p className="profile-info"><strong>Ad:</strong> {user.displayName || "Bilinmeyen"}</p>
        <p className="profile-info"><strong>E-posta:</strong> {user.email}</p>
        <p className="profile-info"><strong>Toplam Süre:</strong> {formatTime(time)}</p>

        <div className="stats-box">
          <h4>📊 İstatistikler</h4>
          <ul className="stats-list">
            <li>🔸 Günlük süre: {logs.find(log => log.label === format(new Date(), "yyyy-MM-dd"))?.time || 0} sn</li>
            <li>🔸 Haftalık süre: {logs.reduce((acc, log) => {
              const logDate = new Date(log.label);
              return logDate >= subDays(new Date(), 7) ? acc + log.time : acc;
            }, 0)} sn</li>
            <li>🔸 Aylık süre: {logs.reduce((acc, log) => {
              const logDate = new Date(log.label);
              return logDate >= startOfMonth(new Date()) ? acc + log.time : acc;
            }, 0)} sn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

  if (showLeaderboardPage) {
    return (
      <div className="login-container">
        <button className="btn btn-gray" onClick={() => setShowLeaderboardPage(false)}>← Geri</button>
        <h2 className="title">🏆 Liderlik Sıralaması</h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
          <button className="btn" onClick={() => setActiveTab("daily")}>Günlük</button>
          <button className="btn" onClick={() => setActiveTab("weekly")}>Haftalık</button>
          <button className="btn" onClick={() => setActiveTab("monthly")}>Aylık</button>
        </div>
        {renderLeaderboardContent(activeTab)}
      </div>
    );
  }

  return (
    <div className="login-container">
      {user && (
        <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999, display: "flex", gap: "10px" }}>
          <button className="btn btn-gray" onClick={async () => {
            const data = await fetchLogsForAllUsers();
            setAllUsers(data);
            setShowLeaderboardPage(true);
          }}>
            🏆 Liderlik Sıralaması
          </button>
          <button
  className="btn btn-darkmode"
  onClick={() => setDarkMode(!darkMode)}
  title="Tema Değiştir"
>
  {darkMode ? "☀️ Açık Mod" : "🌙 Koyu Mod"}
</button>

          <button className="btn btn-orange" onClick={() => setShowPomodoroPage(true)}>
🍅 Pomodoro
</button>
          <img
            src={user.photoURL || "https://via.placeholder.com/40"}
            alt="Profil"
            title="Profil Sayfası"
            style={{ borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", border: "2px solid #007bff" }}
            onClick={() => setShowProfile(true)}
          />
        </div>
      )}

      {!user ? (
        <>
          <h2 className="title">Zamanlayıcı Giriş</h2>
<input
  type="email"
  placeholder="E-posta"
  className="input"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<input
  type="password"
  placeholder="Şifre"
  className="input"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<div className="login-button-group">
  <button className="btn" onClick={handleLogin}>
    {isNewUser ? "Kayıt Ol" : "Giriş Yap"}
  </button>
  <button className="btn btn-google" onClick={handleGoogleLogin}>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      alt="Google logo"
      className="google-icon"
    />
    Google ile Giriş Yap
  </button>
  <button className="btn-link" onClick={() => setIsNewUser(!isNewUser)}>
    {isNewUser ? "Giriş Ekranına Dön" : "Yeni Hesap Oluştur"}
  </button>
</div>
        </>
      ) : (
        <>
          <h2 className="title">Hoş geldin, {user.displayName || user.email}!</h2>
          <p className="timer-display">
  Geçen süre: <strong>{formatTime(time)}</strong>
</p>
          <div className="timer-buttons">
            <button className="btn" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? "Durdur" : "Başlat"}
            </button>
            <button className="btn btn-gray" onClick={() => setTime(0)}>
              Sıfırla
            </button>
            <button className="btn btn-green" onClick={handleSave}>
              Kaydet
            </button>
            <button className="btn btn-red" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>

          <h3 className="leaderboard-title">🏆 Liderlik Tablosu</h3>
          <div className="leaderboard">
            {leaderboard.map((entry, index) => (
              <div key={index} className="leaderboard-item">
                <span>{index + 1}. {entry.name}</span>
                <span>{entry.time} sn</span>
              </div>
            ))}
          </div>

          <StatisticsChart data={logs} />
        </>
      )}
    </div>
  );
}
