
import React, { useEffect, useMemo } from "react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import styles from "./FilterModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import { getInitialValues, getSelectOptions, requiredMessage } from "@/lib/utils";
import { useForm } from "react-hook-form";
import formRenderer from "@/lib/formRenderer";
import { getVendors } from "@/store/slices/vendorSlice";

const FilterModal = ({ handleApply, handleReset }) => {
    const { modalOpen } = useSelector((state) => state.global);
    const { vendors } = useSelector((state) => state.vendor);
    const dispatch = useDispatch();
    const closeModal = () => {
        dispatch(setModalOpen(false));
    };
    const vendorOptions = useMemo(
        () => getSelectOptions(vendors, "organizationName"),
        [vendors]
    );

   
    const formConfig = useMemo(() => ({
        vendorId: {
            defaultValue: "",

            controlType: "select",
            label: "Vendor",
           
            isControlled: true,
            props: { options: vendorOptions },
        },
        startDate: {
            defaultValue: "",
            controlType: "input",
            label: "Start Date",
            props: { type: "date" },
            isRequired: false,
        },
        endDate: {
            defaultValue: "",
            controlType: "input",
            label: "End Date",
            props: { type: "date" },
            isRequired: false,
        },
    }), [vendorOptions]);


    const { register, control, handleSubmit, formState, reset } = useForm({
        defaultValues: getInitialValues(formConfig),
    });

   
    useEffect(() => {
        if (!modalOpen?.data || vendorOptions.length === 0) return;

        const { vendorId, startDate, endDate } = modalOpen.data;

        const matchedVendor = vendorOptions.find((v) => v.value === vendorId) ?? "";

        reset({
            vendorId: matchedVendor,
            startDate: startDate ?? "",
            endDate: endDate ?? "",
        });
    }, [modalOpen?.data, vendorOptions, reset]);

    useEffect(() => {

        dispatch(getVendors({ status: "approved" }));

    }, [dispatch]);

    const onSubmit = (values) => {
        handleApply?.(values);
        closeModal();
    };

    const onReset = () => {
        reset(getInitialValues(formConfig));
        handleReset?.();
        closeModal();
    };


    return (
        <Modal
            heading="Filter"
            modalOpen={modalOpen.id === MODAL_ID.FILTER_MODAL}

            closeModal={closeModal}
            className={styles}
        >
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.main}>
                    {formRenderer(formConfig, formState, register, control)}
                </div>
                <div className={styles.buttonsContainer}>
                    <Button onClick={onReset} outlined type="button">
                        Reset
                    </Button>
                    <Button type="submit">Apply</Button>
                </div>
            </form>
        </Modal>
    );
};

export default FilterModal;
