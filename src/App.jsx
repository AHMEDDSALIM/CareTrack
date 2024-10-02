import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/mainPage/Home";
import Error from "./pages/Error";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./pages/dashboard/ProtectedRoute";
import { loginAction, signUpAction } from "./util/authActions";
import PatientDetails from "./pages/PatientDetails";
import ClipLoader from "react-spinners/ClipLoader"; // Spinner
import { Spinner } from "flowbite-react";

// Layout component to wrap routes
function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

// Main App component
function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false); // Fade out state for spinner
  const [contentVisible, setContentVisible] = useState(false); // State to manage content fade-in

  useEffect(() => {
    // Simulate loading duration
    const timer = setTimeout(() => {
      setFadeOut(true); // Start the fade-out effect for the spinner
      setTimeout(() => {
        setLoading(false); // Remove spinner
        setContentVisible(true); // Show content and start fade-in effect
      }, 500); // Wait for the spinner fade-out to complete before showing content
    }, 1000); // Simulate 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Define the router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
          action: loginAction,
        },
        {
          path: "/signup",
          element: <Signup />,
          action: signUpAction,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
          errorElement: <Error />,
        },
        {
          path: "/dashboard/patient/:patientId",
          element: <PatientDetails />,
        },
      ],
    },
  ]);

  return (
    <div>
      {loading ? (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Spinner size="xl" className="fill-blue-500" />
        </div>
      ) : (
        // Apply fade-in effect to the content
        <div
          className={`transition-opacity duration-500 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <RouterProvider router={router} />
        </div>
      )}
    </div>
  );
}

export default App;
