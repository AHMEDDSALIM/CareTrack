import { MdOutlineStorage, MdBackup } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
export default function Services() {
  return (
    <div
      className="grid md:grid-cols-3 w-10/12 mx-auto gap-10 mt-16 px-5"
      id="services"
    >
      <div className="flex gap-4 items-start flex-col justify-center">
        <span className="text-blue-500 bg-violet-500/10 p-3 rounded-full">
          <MdOutlineStorage />
        </span>
        <div>
          <h3 className="font-semibold text-xl">Patient Records Management</h3>
          <p className="mt-1 text-gray-500">
            {" "}
            Securely store and access patient information, treatment history,
            and medical records with ease. Keep everything organized and at your
            fingertips.
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-start flex-col ">
        <span className="text-blue-500 bg-violet-500/10 p-3 rounded-full">
          <TbReportSearch />
        </span>
        <div>
          <h3 className="font-semibold text-xl">Reporting</h3>
          <p className="mt-1 text-gray-500">
            Print patient data reports for accurate records.
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-start flex-col ">
        <span className="text-blue-500 bg-violet-500/10 p-3 rounded-full">
          <MdBackup />
        </span>
        <div>
          <h3 className="font-semibold text-xl">Real-Time Data Access</h3>
          <p className="mt-1 text-gray-500">
            With our real-time database, access and update patient information
            instantly across all devices. Ensure your practice runs smoothly
            with up-to-the-minute data synchronization.
          </p>
        </div>
      </div>
    </div>
  );
}
