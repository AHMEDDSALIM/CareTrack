import {
  ref as dbRef,
  push,
  set,
  get,
  remove,
  update,
} from "firebase/database";
import { database, storage } from "./firebaseConfig";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

function sanitizeFileName(fileName) {
  const sanitizedFileName = fileName.replace(/[.#$/[\]]/g, "_");
  return sanitizedFileName;
}

async function addNewPatient(userId, patientData) {
  try {
    const patientsRef = dbRef(database, `users/${userId}/patients/`);
    const newPatientRef = push(patientsRef);
    const patientId = newPatientRef.key;

    const files = patientData.files ? Array.from(patientData.files) : [];
    const attachments = {};

    if (files.length > 0) {
      const fileUploadPromises = files.map((file) => {
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileStorageRef = storageRef(
          storage,
          `patients/${patientId}/attachments/${sanitizedFileName}`
        );
        const uploadTask = uploadBytesResumable(fileStorageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.error("Error uploading file:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`File available at ${downloadURL}`);

              attachments[sanitizedFileName] = downloadURL;
              resolve();
            }
          );
        });
      });

      await Promise.all(fileUploadPromises);
    }

    const patientDataWithFiles = {
      patientId,
      ...patientData,
      attachments,
    };

    await set(newPatientRef, patientDataWithFiles);

    return {
      success: true,
      patientId,
      message: "Patient added successfully ..",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
async function getAllPatients(userId) {
  try {
    const patientsRef = dbRef(database, `users/${userId}/patients`);

    const snapshot = await get(patientsRef);

    if (snapshot.exists()) {
      const patients = snapshot.val();
      return { success: true, patients };
    } else {
      return { success: false, message: "No patients found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function deletePatient(userId, patientId) {
  try {
    const patientRef = dbRef(database, `users/${userId}/patients/${patientId}`);

    const snapshot = await get(patientRef);

    if (snapshot.exists()) {
      const patientData = snapshot.val();

      if (
        patientData.attachments &&
        Object.keys(patientData.attachments).length > 0
      ) {
        const deletePromises = Object.values(patientData.attachments).map(
          (fileUrl) => {
            const fileRef = storageRef(storage, fileUrl);
            return deleteObject(fileRef);
          }
        );

        await Promise.all(deletePromises);
        console.log("Attachments deleted successfully.");
      }

      await remove(patientRef);
      return { success: true, message: "Patient deleted successfully." };
    } else {
      return { success: false, message: "Patient not found." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updatePatient(
  userId,
  patientId,
  updatedPatientData,
  newFiles = []
) {
  try {
    const patientRef = dbRef(database, `users/${userId}/patients/${patientId}`);

    const attachments = updatedPatientData.attachments || {};

    const updatedAttachments = { ...attachments };

    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileStorageRef = storageRef(
          storage,
          `patients/${patientId}/attachments/${sanitizedFileName}`
        );
        const uploadTask = uploadBytesResumable(fileStorageRef, file);

        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        updatedAttachments[sanitizedFileName] = downloadURL;
      }
    }

    const patientDataToUpdate = {
      ...updatedPatientData,
      attachments: updatedAttachments,
    };

    await update(patientRef, patientDataToUpdate);

    return { success: true, message: "Patient updated successfully" };
  } catch (error) {
    console.error("Error updating patient:", error);
    return { success: false, message: error.message };
  }
}
export { addNewPatient, getAllPatients, deletePatient, updatePatient };
