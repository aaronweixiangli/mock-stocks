import { useState } from "react";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import "./AuthPage.css";

export default function AuthPage({ setUser }) {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <main className="AuthPage">
      <div className="auth-img"></div>
      {showSignUp ? (
        <SignUpForm
          setUser={setUser}
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
        />
      ) : (
        <LoginForm
          setUser={setUser}
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
        />
      )}
    </main>
  );
}
