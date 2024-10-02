import { useParams, Link } from "react-router-dom";
import DashNav from "../components/DashNav";
import { pdf } from "@react-pdf/renderer";
import {
  Label,
  TextInput,
  Textarea,
  Breadcrumb,
  ListGroup,
  Spinner,
  Button,
} from "flowbite-react";
import { usePatients } from "../store/patientsContext";
import { HiUserGroup } from "react-icons/hi";
import Error from "./Error";
import MyDocument from "../components/MyDocumnet";
import { useState } from "react";
import Cmodal from "../components/Cmodal";
import { getUserData } from "../util/authActions";
import { useAuth } from "../store/authContext";
export default function PatientDetails() {
  const { patients, loading } = usePatients();
  const { currentUser } = useAuth();
  const { patientId } = useParams();
  const [printLoading, setPrintLoading] = useState(false);
  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);
  const [showRx, setShowRx] = useState(false);
  const [patient] = patients.filter(
    (patient) => patient.patientId === patientId
  );

  const attachments = Object.entries(patient?.attachments || {}).map(
    ([key, value]) => ({ key, value })
  );

  function addInput() {
    setInputs([...inputs, { id: inputs.length + 1, value: "" }]);
  }
  const handleInputChange = (id, newValue) => {
    const updatedInputs = inputs.map((input) =>
      input.id === id ? { ...input, value: newValue } : input
    );
    setInputs(updatedInputs);
  };
  const handlePrint = async () => {
    setPrintLoading(true);
    const { data } = await getUserData(currentUser.uid);
    const rx = inputs.map((input) => input.value);
    const blob = await pdf(
      <MyDocument key={Math.random()} user={data} rx={rx} patient={patient} />
    ).toBlob();
    const url = URL.createObjectURL(blob);

    // Open the PDF in a new window/tab
    const pdfWindow = window.open(url, "_blank");

    // Check if the new window/tab was successfully opened
    if (pdfWindow) {
      null;
    } else {
      alert("Please allow popups for this website");
    }
    setPrintLoading(false);
  };
  function handleAddRx() {
    setShowRx(true);
  }
  function hideModal() {
    setShowRx(false);
    setInputs([{ id: 1, value: "" }]);
  }
  if (!loading && !patient) {
    return <Error message="Patient Not found." />;
  }
  return (
    <>
      <DashNav />
      <main className="flex justify-center drop-shadow-md">
        <div className="w-11/12">
          <div className="mb-3 mt-3 ml-3">
            <Breadcrumb>
              <Breadcrumb.Item icon={HiUserGroup}>
                <Link to="/dashboard">Patients</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Patient Details</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div>
                <Spinner className="fill-blue-500"/>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <Label>Name</Label>
                <TextInput
                  type="text"
                  color="blue"
                  value={patient.patientName}
                  readOnly
                />
              </div>
              <div className="md:flex mb-4">
                <div className="md:flex-1 md:pr-3">
                  <Label>Age</Label>
                  <TextInput
                    type="text"
                    color="blue"
                    value={patient.age}
                    readOnly
                  />
                </div>
                <div className="md:flex-1 md:pl-3">
                  <Label>Gender</Label>
                  <TextInput
                    type="text"
                    color="blue"
                    value={patient.gender}
                    readOnly
                  />
                </div>
              </div>
              <div className="md:flex mb-4">
                <div className="md:flex-1 md:pr-3">
                  <Label>History of Illness</Label>
                  <Textarea
                    color="blue"
                    type="text"
                    value={patient.historyOfIllness || "No history available"}
                    readOnly
                  />
                </div>
                <div className="md:flex-1 md:pl-3">
                  <Label>Past Visit</Label>
                  <Textarea
                    color="blue"
                    type="text"
                    name="address_street"
                    value={patient.pastvisit || "No past visit data"}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex md:justify-center justify-start">
                <div className="flex-col md:w-6/12 w-full">
                  <Label>Attachments</Label>
                  <ListGroup>
                    {attachments.length > 0 ? (
                      attachments.map(({ key, value }) => (
                        <ListGroup.Item
                          key={key}
                          href={value}
                          target="_blank"
                          className="break-words whitespace-normal overflow-hidden text-ellipsis"
                          style={{ wordBreak: "break-all" }} // Ensure long words break
                        >
                          {key}
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No attachments found.</ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <div className="fixed bottom-10 right-5">
        <Button onClick={handleAddRx} className="bg-blue-500" color="blue">
          Print
        </Button>
      </div>
      <Cmodal openModal={showRx} hideModal={hideModal} size="xl">
        <div className="flex justify-start p-5 flex-col">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Prescription
            </h3>
          </div>
          {inputs.map((input) => (
            <div key={input.id} className="flex items-center mt-2">
              <div className="flex-1">
                <Label htmlFor={`rxInput-${input.id}`}>{`R${input.id}`}</Label>
                <TextInput
                  color="blue"
                  id={`rxInput-${input.id}`}
                  value={input.value}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
              </div>
              {input.id === inputs.length && (
                <div className="self-end">
                  <Button
                    onClick={addInput}
                    className="bg-blue-500 ml-3"
                    color="blue"
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
          ))}
          {/* Example button to trigger value logging */}
          <div className="flex justify-end mt-5">
            <Button onClick={handlePrint} color="blue" className="bg-blue-500" disabled={printLoading}>
              {printLoading?"Printing...":"OK"}
            </Button>
          </div>
        </div>
      </Cmodal>
    </>
  );
}
