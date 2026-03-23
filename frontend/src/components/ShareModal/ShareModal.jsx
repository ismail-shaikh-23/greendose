
import React, { useEffect, useMemo } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./ShareModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import { getInitialValues } from "@/lib/utils";
import { useForm } from "react-hook-form";
import formRenderer from "@/lib/formRenderer";


const ShareModal = ({ handleShareClick }) => {
    const { modalOpen } = useSelector((state) => state.global);

    const dispatch = useDispatch();
    const closeModal = () => {
        
        dispatch(setModalOpen(false));
    };

    const formConfig = useMemo(() => ({
     
         email: {
            defaultValue: "",
            controlType: "input",
            label: "Email",
            isRequired: false,
            props: {
                type: "email",
                placeholder: "Enter email",
            },
        },
    }), []);


    const { register, control, handleSubmit, formState, reset } = useForm({
        defaultValues: getInitialValues(formConfig),
    });
    
const onClose = () => {
    reset();
    dispatch(setModalOpen(false));
  };

    const onSubmit = (data) => {
    const payload = {
      email: data.email,
    };
    handleShareClick(payload);
    onClose();;
    };

    return (
        <Modal
            heading="Enter your email"
            modalOpen={modalOpen.id === MODAL_ID.SHARE_MODAL}
            closeModal={closeModal}
            className={styles}
        >
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.main}>
                    {formRenderer(formConfig, formState, register, control)}
                </div>
                <div className={styles.buttonsContainer}>
                    <Button type="submit"> Submit</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ShareModal;
