import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { requiredMessage } from "@/lib/utils";
import FormControl from "@/components/FormControl/FormControl";
import styles from "./RejectionModal.module.scss";
import Button from "@/components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";

const RejectionModal = ({ handleReject }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const closeModal = () => {
    setReason("")
    dispatch(setModalOpen(false));
  };

  const handleChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleReject(reason);
    setIsSubmitting(false);
    closeModal();
  };

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.VENDOR_REJECTION}
      closeModal={closeModal}
      heading="Reason for Rejection"
      className={styles.modal}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormControl
          name="reason"
          controlType="textarea"
          label="Rejection Reason"
          placeholder="Enter Rejection Reason"
          // errorMessage={formState?.errors?.email?.message}
          isRequired={true}
          value={reason}
          onChange={handleChange}
        />
        <div className={styles.buttonsContainer}>
          <Button onClick={closeModal} outlined>
            Cancel
          </Button>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingText text="Submitting" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectionModal;
