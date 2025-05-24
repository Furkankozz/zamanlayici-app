import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <button onClick={() => navigate("/")} style={{ float: "left" }}>← Ana Sayfa</button>
      <h2>👤 Profil Sayfası</h2>
      {user ? (
        <>
          <img
            src={user.photoURL || "https://via.placeholder.com/100"}
            alt="Profil"
            style={{ borderRadius: "50%", width: "100px", marginTop: "1rem" }}
          />
          <p><strong>Ad:</strong> {user.displayName || "Bilinmeyen"}</p>
          <p><strong>E-posta:</strong> {user.email}</p>
          <p><strong>Toplam Süre:</strong> {user.time || 0} saniye</p>
        </>
      ) : (
        <p>Kullanıcı bilgisi bulunamadı.</p>
      )}
    </div>
  );
}
