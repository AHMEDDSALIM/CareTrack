import { Button, Navbar } from "flowbite-react";
import LOGO from "../assets/Teeth-12.png";
import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const navigate = useNavigate();
  return (
    <Navbar fluid rounded className="sticky top-0 z-50">
      <Navbar.Brand href="/">
        <img src={LOGO} className="mr-3 h-11" />
        <span className="self-center whitespace-nowrap font-semibold dark:text-white text-2xl">
          Dental Notes
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button
          color="blue"
          className="bg-blue-500 mr-2"
          onClick={() => navigate("/signup")}
        >
          Get started
        </Button>
        {/* <Navbar.Toggle /> */}
      </div>
      {/* <Navbar.Collapse>
        <Navbar.Link href="#home" className="md:hover:text-blue-700">
          Home
        </Navbar.Link>
        <Navbar.Link href="#services" className="md:hover:text-blue-700">
          Services
        </Navbar.Link>
        <Navbar.Link href="#contact" className="md:hover:text-blue-700">
          Contact
        </Navbar.Link>
      </Navbar.Collapse> */}
    </Navbar>
  );
}
