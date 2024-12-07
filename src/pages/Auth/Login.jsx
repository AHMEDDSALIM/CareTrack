import { Form, Link, useActionData } from 'react-router-dom';
import LOGO from '../../assets/Teeth-12.png';
import { useEffect, useRef, useState } from 'react';
import FixedAlert from '../../components/FixedAlert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { Button, Label, TextInput } from 'flowbite-react';

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, notTryToLogin, tryToLoginf } = useAuth();
  const [alertId, setAlertId] = useState(0);
  const [loading, setLoading] = useState(false);
  const actionData = useActionData();
  const email = useRef();
  const password = useRef();

  useEffect(() => {
    if (currentUser) {
      notTryToLogin();
      setLoading(false);
      navigate('/dashboard');
    } else {
      tryToLoginf();
    }
  }, [currentUser, navigate, tryToLoginf, notTryToLogin]);

  useEffect(() => {
    if (actionData) {
      setAlertId((prevId) => prevId + 1);
      if (!actionData.success) {
        setLoading(false);
      }
    }
  }, [actionData]);

  const handleSubmit = () => {
    setLoading(true); // Start loading when the form is submitted
  };

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
          CareTrack
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Form
              className="space-y-4 md:space-y-6"
              method="post"
              onSubmit={handleSubmit}
            >
              <div>
                <Label htmlFor="email">Your email</Label>
                <TextInput
                  color="blue"
                  ref={email}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <TextInput
                  ref={password}
                  type="password"
                  name="password"
                  color="blue"
                  id="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {/* <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Forgot password?
                </a>
              </div> */}
              <Button
                type="submit"
                color="blue"
                className="w-full transition ease-in-out bg-blue-500"
                disabled={loading} // Disable button if loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
