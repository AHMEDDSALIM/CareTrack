import { useContext, createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tryTologin, setTryTologin] = useState(false);
  useEffect(() => {
    var timer = null;
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        if (tryTologin) {
          timer = setTimeout(() => {
            setCurrentUser(user);
          }, 2000);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [tryTologin]);

  const logout = () => {
    const auth = getAuth();
    return signOut(auth);
  };
  const tryToLoginf = () => {
    setTryTologin(true);
  };
  const notTryToLogin = () => {
    setTryTologin(false);
  };
  const value = {
    currentUser,
    setCurrentUser,
    logout,
    tryToLoginf,
    notTryToLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
