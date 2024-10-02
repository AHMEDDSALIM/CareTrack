import {
  Avatar,
  Dropdown,
  Navbar,
  Button,
  TextInput,
  Label,
  Textarea,
  FileInput,
  Badge,
} from "flowbite-react";
import LOGO from "../assets/Teeth-12.png";
import { useAuth } from "../store/authContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getUserData, updateUser } from "../util/authActions";
import Cmodal from "./Cmodal";
import FixedAlert from "./FixedAlert";

export default function DashNav({ setSearchQuery }) {
  const navigate = useNavigate();
  const { logout, tryToLoginf, currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const file = useRef()
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    description: "",
    address: "",
  });
  const [respnce, setRespnce] = useState({
    message: null,
    success: null,
  });

  // Fetch user data and sync it to the form when the component mounts
  useEffect(() => {
    async function fetchUser() {
      const { data } = await getUserData(currentUser.uid);
      setUserData(data);
    }
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  // Update the search query
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value); // Update parent search query state
  };

  // Handle user logout
  async function handleLogout() {
    try {
      await logout();
      navigate("/"); // Redirect to login after logging out
      tryToLoginf();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

  // Handle input changes and update the userData state
  function handleInput(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }

  // Show modal for updating user info
  function handleUpdateUserInfo() {
    setShowModal(true);
  }

  // Hide the modal
  function hideModal() {
    setShowModal(false);
  }

  // Handle the update of user information
  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    const responce = await updateUser(currentUser.uid, userData,file.current.files[0]);
    setRespnce({
      success: responce.success,
      message: responce.message,
    });
    setLoading(false);
  }

  // Auto-hide alert after a successful update
  useEffect(() => {
    if (respnce.success != null) {
      const timer = setTimeout(() => {
        setRespnce({
          message: null,
          success: null,
        });
      }, 2000); // Changed to 2 seconds for better user feedback
      return () => clearTimeout(timer);
    }
  }, [respnce]);

  return (
    <>
      <Navbar fluid rounded className={"transition-all duration-300"}>
        <Navbar.Brand href="/">
          <img src={LOGO} className="mr-0 sm:mr-3 h-11" alt="DentalDB Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white sr-only sm:not-sr-only">
            Dental Notes
          </span>
        </Navbar.Brand>
        <TextInput
          color="blue"
          onChange={handleSearchChange}
          placeholder="Search"
        ></TextInput>
        <div className="flex md:order-3">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img="" rounded />}
            className="z-30"
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleUpdateUserInfo}>
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => window.location.href = "https://github.com/AHMEDDSALIM/dentalNotes/releases/download/v1.0.0/dentalnotes-1.0.0-setup.exe"}>Download App<Badge className="ml-1" color="failure">Beta</Badge></Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>

      <Cmodal openModal={showModal} hideModal={hideModal} size="xl">
        {respnce.success && (
          <FixedAlert
            message={respnce.message}
            success={respnce.success}
          ></FixedAlert>
        )}
        <div className="flex justify-start ml-5">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              User Information
            </h3>
          </div>
        </div>
        <form>
          <div className="flex p-5 flex-col">
            <div>
              <Label>Name</Label>
              <TextInput
                color="blue"
                onChange={handleInput}
                type="text"
                name="name"
                value={userData.name}
              ></TextInput>
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                color="blue"
                onChange={handleInput}
                type="text"
                name="description"
                value={userData.description}
              ></TextInput>
            </div>
            <div>
              <Label>Phone Number</Label>
              <TextInput
                color="blue"
                onChange={handleInput}
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
              ></TextInput>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                color="blue"
                onChange={handleInput}
                type="text"
                name="address"
                value={userData.address}
              ></Textarea>
            </div>
            <div>
              <Label htmlFor="logo">Logo</Label>
              <FileInput id="logo" name="logo" ref={file} color="blue" accept="image/png"/>
            </div>
          </div>
          <div className="flex justify-end p-5">
            <div className="">
              <Button type="submit" onClick={handleUpdate} disabled={loading} color="blue" className="bg-blue-500">
                {loading ? "Saving..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </Cmodal>
    </>
  );
}
