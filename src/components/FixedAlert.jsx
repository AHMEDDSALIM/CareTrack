import { useEffect, useState } from "react";
export default function FixedAlert({ message, success, autoDismiss = true }) {
  const [visible, setVisible] = useState(true);

  const style = success
    ? "bg-green-400 border-green-700"
    : "bg-red-400 border-red-700";

  function handleClose() {
    setVisible(false);
  }

  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [autoDismiss, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 flex items-end justify-right px-4 py-6 justify-end z-50">
      <div
        className={`max-w-sm w-full shadow-lg rounded px-4 py-3 relative ${style} text-white border-l-4 transition-opacity ease-in-out`}
      >
        <div className="p-2">
          <div className="flex items-start">
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm leading-5 font-medium">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="inline-flex text-white transition ease-in-out duration-150"
                onClick={handleClose}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
