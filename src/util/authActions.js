import { auth } from "./firebaseConfig";
import { getDatabase, ref, get, set, update } from "firebase/database";
import {ref as storageRef,getDownloadURL,uploadBytes,deleteObject, getStorage} from 'firebase/storage'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
export async function loginAction({ request }) {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  try {
    // Firebase login logic
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if the email is verified before allowing login
    if (user.emailVerified) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      get(userRef).then((snapshot) => {
        if (!snapshot.exists()) {
          // If user does not exist, create a new user entry
          set(ref(db, "users/" + user.uid), {
            email: user.email,
            name: "",
            description: "",
            phoneNumber: "",
            address: "",
            patients: {}, // Initialize with an empty patients object
          });
          console.log("New user created in the database");
        } else {
          console.log("User already exists in the database");
        }
      });
      return { success: true, message: "Login successful" };
    } else {
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      return {
        message: "Please Check your Email and password and try again.",
        success: false,
      };
    }
    return { success: false, error: error.message };
  }
}
export async function signUpAction({ request }) {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  const confirmPassword = data.get("confirmPassword");
  if (password != confirmPassword) {
    return { success: false, message: "Password mismatch" };
  }
  try {
    // Firebase login logic
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    return {
      message:
        "Signup successful! A verification email has been sent to your inbox.",
      success: true,
    };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return {
        message: "Email already in use. Please log in instead.",
        success: false,
      };
    }
    return { success: false, error: error.message };
  }
}
export async function updateUser(uid, updatedData, logoFile) {
  try {
    const db = getDatabase();
    const storage = getStorage()
    const userRef = ref(db, `users/${uid}`)

    // Check if the user has an existing logo
    const existingLogoUrl = updatedData.logo

    // Upload new logo if logoFile is provided
    if (logoFile) {
      const logoStorageRef = storageRef(storage, `users/${uid}/logo`)

      // Delete the existing logo from storage if it exists
      if (existingLogoUrl) {
        const oldLogoRef = storageRef(storage, existingLogoUrl)
        await deleteObject(oldLogoRef).catch((error) => {
          console.error('Error deleting old logo:', error)
        })
      }

      // Upload the new logo
      await uploadBytes(logoStorageRef, logoFile)
      const newLogoUrl = await getDownloadURL(logoStorageRef)

      // Update the user data with the new logo URL
      updatedData.logo = newLogoUrl
    }

    // Update the user's data in the database
    await update(userRef, updatedData)

    return { success: true, message: 'User info and logo updated successfully' }
  } catch (error) {
    console.error('Error updating user data:', error)
    return { success: false, message: error.message }
  }
}
export async function getUserData(uid) {
  try {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`);

    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val(); // Get the user data
      return { success: true, data: userData };
    } else {
      return { success: false, message: "No user data found" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}
