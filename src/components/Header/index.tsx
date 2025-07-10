// src/components/Header.tsx
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    setUserEmail(user?.email || null);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout(); // informa à App que o logout foi feito
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Sistema de Monitoramento Sonoro</h1>
      <div style={styles.userInfo}>
        {userEmail && <span style={styles.email}>{userEmail}</span>}
        <button onClick={handleLogout} style={styles.button}>Sair</button>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: "#4f46e5",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  email: {
    fontSize: "1rem",
    opacity: 0.9,
  },
  button: {
    background: "#ef4444",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;
