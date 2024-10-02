import { Modal } from "flowbite-react";
export default function Cmodal({ openModal, hideModal, size, children }) {
  return (
    <Modal show={openModal} size={size} popup onClose={hideModal}>
      <Modal.Header />
      {children}
    </Modal>
  );
}
