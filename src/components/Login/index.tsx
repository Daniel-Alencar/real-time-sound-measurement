import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../../firebase";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  // modo login ou cadastro
  const [isCadastro, setIsCadastro] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      if (isCadastro) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      onLogin();
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está cadastrado.");
      } else if (e.code === "auth/invalid-email") {
        setErro("E-mail inválido.");
      } else if (e.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else if (e.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else if (e.code === "auth/user-not-found") {
        setErro("Usuário não encontrado.");
      } else {
        setErro("Erro ao autenticar. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>{isCadastro ? "Cadastro" : "Autenticação"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          required
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={carregando}>
          {carregando ? "Processando..." : isCadastro ? "Cadastrar" : "Entrar"}
        </button>

        {erro && <p style={styles.erro}>{erro}</p>}

        <p style={styles.toggle}>
          {isCadastro ? (
            <>
              Já tem uma conta?{" "}
              <span onClick={() => setIsCadastro(false)} style={styles.link}>
                Entrar
              </span>
            </>
          ) : (
            <>
              Não tem uma conta?{" "}
              <span onClick={() => setIsCadastro(true)} style={styles.link}>
                Cadastre-se
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: "1rem",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#333",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  erro: {
    color: "red",
    fontSize: "0.875rem",
    textAlign: "center",
  },
  toggle: {
    fontSize: "0.875rem",
    textAlign: "center",
    color: "#000"
  },
  link: {
    color: "#4f46e5",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
