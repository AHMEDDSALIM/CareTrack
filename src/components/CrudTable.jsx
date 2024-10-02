import {
  Button,
  Spinner,
  Table,
  Label,
  TextInput,
  Textarea,
  Select,
  FileInput,
  Breadcrumb,
} from "flowbite-react";
import { usePatients } from "../store/patientsContext";
import { deletePatient, updatePatient } from "../util/crud";
import { useAuth } from "../store/authContext";
import FixedAlert from "./FixedAlert";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cmodal from "./Cmodal";
import { HiSave, HiUserGroup } from "react-icons/hi";
export default function CrudTable({ searchQuery }) {
  const pnameRef = useRef();
  const genderRef = useRef();
  const ageRef = useRef();
  const pastvisitRef = useRef();
  const historyOfIllnessRef = useRef();
  const attachmentsRef = useRef();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { currentUser } = useAuth();
  const { patients, loading } = usePatients();
  const [deleteState, setDeleteState] = useState({
    success: null,
    message: null,
  });
  const [editState, setSetEditState] = useState({
    loading: false,
    success: null,
    message: null,
  });
  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  async function handleDeletePatients(patientId) {
    const result = await deletePatient(currentUser.uid, patientId);
    if (result) {
      setDeleteState({
        success: result.success,
        message: result.message,
      });
    }
  }
  function handleEditPatient(patient) {
    setSelectedPatient(patient);
    setShowEditModal(true);
  }
  async function handleSavePatient(e) {
    e.preventDefault();
    setSetEditState((prev) => ({ ...prev, loading: true }));
    const pname = pnameRef.current.value;
    const gender = genderRef.current.value;
    const age = ageRef.current.value;
    const pastvisit = pastvisitRef.current.value;
    const historyOfIllness = historyOfIllnessRef.current.value;
    const files = attachmentsRef.current.files;

    const updatedPatient = {
      patientName: pname,
      gender,
      age,
      pastvisit,
      historyOfIllness,
      attachments: selectedPatient.attachments,
    };
    const result = await updatePatient(
      currentUser.uid,
      selectedPatient.patientId,
      updatedPatient,
      files
    );

    if (result.success) {
      setSetEditState((prev) => ({
        ...prev,
        message: result.message,
        success: result.success,
      }));
      setTimeout(() => {
        setShowEditModal(false);
      }, 2000);
    } else {
      setSetEditState((prev) => ({
        ...prev,
        loading: false,
        message: result.message,
        success: result.success,
      }));
    }
  }
  useEffect(() => {
    if (deleteState.success !== null) {
      const timer = setTimeout(() => {
        setDeleteState({ success: null, message: null });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [deleteState]);
  useEffect(() => {
    if (editState.success !== null) {
      const timer = setTimeout(() => {
        setSetEditState((prev) => ({
          ...prev,
          loading: false,
          success: null,
          message: null,
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [editState]);
  return (
    <div className="max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-100px)] overflow-y-auto w-11/12 custom-scrollbar">
      {deleteState.success != null && (
        <FixedAlert
          message={deleteState.message}
          success={deleteState.success}
        />
      )}
      <div className="mb-3 mt-3 ml-3">
        <Breadcrumb>
          <Breadcrumb.Item icon={HiUserGroup}>
            <Link to="/dashboard">Patients</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Table hoverable className="relative">
        <Table.Head className="sticky top-0 bg-white dark:bg-gray-800 z-20">
          <Table.HeadCell>Patient name</Table.HeadCell>
          <Table.HeadCell>Gender</Table.HeadCell>
          <Table.HeadCell>Age</Table.HeadCell>
          <Table.HeadCell>
            <div className="flex justify-center">
              <div>Actions</div>
            </div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {loading && (
            <Table.Row>
              <Table.Cell colSpan="4" className="text-center py-4">
                <Spinner size="xl" className="fill-blue-500"/>
              </Table.Cell>
            </Table.Row>
          )}
          {filteredPatients.length === 0 && !loading && (
            <Table.Row>
              <Table.Cell colSpan="4" className="text-center py-4">
                No patients found.
              </Table.Cell>
            </Table.Row>
          )}
          {filteredPatients.length > 0 &&
            filteredPatients.map((patient) => (
              <Table.Row
                key={patient.patientId}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 transition-all hover:cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/patient/${patient.patientId}`)
                }
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {patient.patientName}
                </Table.Cell>
                <Table.Cell>{patient.gender}</Table.Cell>
                <Table.Cell>{patient.age}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-2 items-center justify-center sm:flex-row sm:gap-4">
                    <div className="order-2 w-full sm:w-auto">
                      <Button
                        color="blue"
                        className="w-full sm:w-auto px-0 py-0 text-sm sm:px-3 sm:py-1 sm:text-base bg-blue-500"
                        pill
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPatient(patient);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Button
                        color="failure"
                        className="w-full sm:w-auto px-0 py-0 text-sm sm:px-3 sm:py-1 sm:text-base bg-red-500"
                        pill
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePatients(patient.patientId);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {selectedPatient && (
        <Cmodal
          openModal={showEditModal}
          hideModal={() => setShowEditModal(false)}
          size="4xl"
        >
          {editState.success != null && (
            <FixedAlert
              message={editState.message}
              success={editState.success}
            />
          )}
          <div className="flex justify-start ml-5">
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Update patient
              </h3>
            </div>
          </div>
          <form
            className="grid grid-cols-2 gap-4 m-5 gap-y-8"
            onSubmit={handleSavePatient}
          >
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <TextInput
                color="blue"
                ref={pnameRef}
                type="text"
                id="patientName"
                name="patientName"
                required
                defaultValue={selectedPatient.patientName}
              ></TextInput>
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                color="blue"
                ref={genderRef}
                id="gender"
                name="gender"
                required
                defaultValue={selectedPatient.gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <TextInput
                ref={ageRef}
                color="blue"
                type="number"
                id="age"
                name="age"
                required
                defaultValue={selectedPatient.age}
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
                defaultValue={selectedPatient.pastvisit}
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
                defaultValue={selectedPatient.historyOfIllness}
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
                disabled={editState.loading}
              >
                {editState.loading ? "Saving..." : "Update"}
              </Button>
            </div>
          </form>
        </Cmodal>
      )}
    </div>
  );
}
