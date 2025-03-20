import { useContext, createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user && user.emailVerified) {
          // User is signed in and email is verified
          setCurrentUser(user);
        } else {
          // User is either null or email not verified
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isAuthenticating]);

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const startAuthentication = () => {
    setIsAuthenticating(true);
  };

  const stopAuthentication = () => {
    setIsAuthenticating(false);
  };

  const value = {
    currentUser,
    setCurrentUser,
    logout,
    startAuthentication,
    stopAuthentication,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}