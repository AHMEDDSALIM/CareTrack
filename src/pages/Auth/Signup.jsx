import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import LOGO from "../../assets/Teeth-12.png";
import { useEffect, useRef, useState } from "react";
import FixedAlert from "../../components/FixedAlert";
import { useAuth } from "../../store/authContext";
import { Button, Label, TextInput } from "flowbite-react";
export default function Signup() {
  const navigate = useNavigate();
  const [alertId, setAlertId] = useState(0);
  const { currentUser } = useAuth();
  const actionData = useActionData();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }

    if (actionData) {
      setAlertId((prevId) => prevId + 1);
    }
  }, [actionData, navigate, currentUser]);
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {actionData && (
        <FixedAlert
          key={alertId}
          message={actionData.message}
          success={actionData.success}
        />
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 transition ease-in-out animate-showup">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src={LOGO} alt="logo" />
          Dental Notes
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up your account
            </h1>
            <Form className="space-y-4 md:space-y-6" method="post">
              <div>
                <Label
                  htmlFor="email"

                >
                  Your email
                </Label>
                <TextInput
                  ref={email}
                  type="email"
                  name="email"
                  id="email"
                  color="blue"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </Label>
                <TextInput
                  ref={password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  color="blue"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </Label>
                <TextInput
                  ref={confirmPassword}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  color="blue"
                  required
                />
              </div>
              <Button
                color="blue"
                type="submit"
                className="w-full text-white bg-blue-500"
              >
                Sign up
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                You have an account?
                <Link
                  to="/login"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
