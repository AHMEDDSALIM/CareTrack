import { HR } from 'flowbite-react';
export default function CFooter() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <section>
      <HR className="mt-8 mb-0" />
      <footer className="flex justify-center p-5">
        <a href="/" className="text-blue-500 hover:text-blue-800 px-5">
          ©{year} CareTrack™
        </a>
        <a
          href="mailto:ahmed.d.s4lim@gmail.com"
          className="text-blue-500 hover:text-blue-800 px-5"
        >
          Contact us
        </a>
      </footer>
    </section>
  );
}
