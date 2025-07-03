import { RefObject } from "react";
import { ModalRef } from "../components/Modal";

export const useModal = () => {
  const handleModalOpen = (ref: RefObject<ModalRef>) => {
    ref.current?.open();
  };

  const handleModalClose = (ref: RefObject<ModalRef>) => {
    ref.current?.close();
  };

  return {
    handleModalOpen,
    handleModalClose,
  };
}; 