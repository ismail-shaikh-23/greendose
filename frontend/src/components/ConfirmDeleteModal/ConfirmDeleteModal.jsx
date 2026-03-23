
import React from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./ConfirmDeleteModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import DANGER from "@/assets/png/Danger.png"
const ConfirmDeleteModal = ({ deleteLabel = "", handleDelete }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setModalOpen(false));
  };

  return (
    <Modal
      heading="Confirm Delete"
      modalOpen={modalOpen.id === MODAL_ID.CONFIRM_DELETE}
      
      closeModal={closeModal}
      className={styles}
    > 
    <img src={DANGER} className={styles.danger}/>
      <h3> Delete {deleteLabel} </h3>
      <p>Are you sure you want to delete   <strong>{modalOpen?.data?.userName || deleteLabel}</strong>
</p>
      <div className={styles.buttonContainer}>
        <Button className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </Button>
        <Button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
