import {
  TextInput,
  Label,
  FileInput,
  Textarea,
  Button,
  Select,
} from "flowbite-react";
import { useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useAuth } from "../store/authContext";
import { addNewPatient } from "../util/crud";
import FixedAlert from "./FixedAlert";
export default function AddPatient({ onSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState({
    loading: false,
    success: null,
    message: null,
  });
  const pnameRef = useRef();
  const genderRef = useRef();
  const ageRef = useRef();
  const pastvisitRef = useRef();
  const historyOfIllnessRef = useRef();
  const attachmentsRef = useRef();

  async function handleAddPatient(e) {
    e.preventDefault();
    setLoading((prev) => ({
      ...prev,
      loading: true,
    }));

    const userId = currentUser.uid;
    const pname = pnameRef.current.value;
    const gender = genderRef.current.value;
    const age = ageRef.current.value;
    const pastvisit = pastvisitRef.current.value;
    const historyOfIllness = historyOfIllnessRef.current.value;
    const files = attachmentsRef.current.files;

    const newPatient = {
      patientName: pname,
      gender,
      age,
      pastvisit,
      historyOfIllness,
      files,
    };

    const result = await addNewPatient(userId, newPatient);

    if (result.success) {
      setLoading((prev) => ({
        ...prev,
        success: result.success,
        message: result.message,
      }));
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setLoading((prev) => ({
        ...prev,
        success: result.success,
        message: result.message,
      }));
    }

    setLoading((prev) => ({
      ...prev,
      loading: true,
    }));
  }

  return (
    <>
      {loading.success != null && (
        <FixedAlert
          message={loading.message}
          success={loading.success}
        ></FixedAlert>
      )}
      <div className="flex justify-start ml-5">
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add new patient
          </h3>
        </div>
      </div>
      <form
        className="grid grid-cols-2 gap-4 m-5 gap-y-8"
        onSubmit={handleAddPatient}
      >
        <div>
          <Label htmlFor="patientName">Patient Name</Label>
          <TextInput
            ref={pnameRef}
            type="text"
            color="blue"
            id="patientName"
            name="patientName"
            required
          ></TextInput>
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            ref={genderRef}
            id="gender"
            name="gender"
            color="blue"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <TextInput
            color="blue"
            ref={ageRef}
            type="number"
            id="age"
            name="age"
            required
          ></TextInput>
        </div>
        <div>
          <Label htmlFor="pastvisit">Past Visit</Label>
          <Textarea
            ref={pastvisitRef}
            color="blue"
            type="text"
            id="pastvisit"
            name="pastvisit"
          ></Textarea>
        </div>
        <div>
          <Label htmlFor="historyOfIllness">History Of Illness</Label>
          <Textarea
            ref={historyOfIllnessRef}
            color="blue"
            type="text"
            id="historyOfIllness"
            name="historyOfIllness"
          ></Textarea>
        </div>
        <div>
          <div>
            <Label htmlFor="attachments" value="Attachments" />
          </div>
          <FileInput
            ref={attachmentsRef}
            color="blue"
            id="attachments"
            multiple
            name="attachments"
          />
        </div>
        <div className="col-start-2 justify-self-end">
          <Button
            type="submit"
            color="blue"
            className="rounded-full shadow-lg drop-shadow-lg bg-blue-500"
            disabled={loading.loading}
          >
            {loading.loading ? "Submitting..." : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}
