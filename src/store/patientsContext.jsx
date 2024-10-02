import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { ref, onValue } from "firebase/database";
import { database } from "../util/firebaseConfig";

const PatientsContext = createContext();

export function usePatients() {
  return useContext(PatientsContext);
}

export function PatientsProvider({ children }) {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    if (currentUser) {
      const patientsRef = ref(database, `users/${currentUser.uid}/patients`);

      unsubscribe = onValue(patientsRef, (snapshot) => {
        const patientsObject = snapshot.val();
        const patientsArray = Object.entries(patientsObject || {}).map(
          ([id, patient]) => ({
            patientId: id,
            ...patient,
          })
        );
        setPatients(patientsArray);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const value = {
    loading,
    patients,
  };

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
}
