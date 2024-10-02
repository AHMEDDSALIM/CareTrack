import CrudTable from "../../components/CrudTable";
import DashNav from "../../components/DashNav";
import { Button } from "flowbite-react";
import { HiUserAdd } from "react-icons/hi";
import Cmodal from "../../components/Cmodal";
import AddPatient from "../../components/AddPatient";
import { useState } from "react";

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  function handelAddPatient() {
    setOpenModal(true);
  }

  function handelHideModal() {
    setOpenModal(false);
  }

  return (
    <>
      <Cmodal openModal={openModal} hideModal={handelHideModal} size="4xl">
        {/* Pass handelHideModal to AddPatient */}
        <AddPatient onSuccess={handelHideModal} />
      </Cmodal>
      <DashNav setSearchQuery={setSearchQuery} />

      <div className="flex justify-center">
        <CrudTable searchQuery={searchQuery} />
      </div>

      <Button
        onClick={handelAddPatient}
        color="blue"
        className="fixed bottom-4 right-4 z-50 text-white p-4 rounded-full shadow-lg drop-shadow-lg bg-blue-500"
      >
        <HiUserAdd size={24} />
      </Button>
    </>
  );
}
