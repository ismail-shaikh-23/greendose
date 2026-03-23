import Button from "@/components/Button/Button";
import FormControl from "@/components/FormControl/FormControl";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID } from "@/lib/constants";
import { addBaseUrl, dateConverter, getInitialValues, inputDateFormat, requiredMessage } from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../AddCampaign/AddCampaign.module.scss";
import toast from "@/lib/toast";
import CampaignService from "@/services/api/campaign";
import LoadingText from "@/components/LoadingText/LoadingText";
import formRenderer from "@/lib/formRenderer";

const AddCampaign = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Campaign`;

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name || "",
        validations: {
          required: requiredMessage("Campaign name"),
        },
        controlType: "input",
        label: "Campaign Name",
        isRequired: true,
      },

      startDate: {
        defaultValue: modalOpen?.data?.startDate
          ? inputDateFormat(modalOpen?.data?.startDate)
          : "",
        validations: {
          required: requiredMessage("Start date"),
        },
        controlType: "input",
        label: "Start Date",
        isRequired: true,
        props: {
          type: "date",
        },
      },
      endDate: {
        defaultValue: modalOpen?.data?.endDate
          ? inputDateFormat(modalOpen?.data?.endDate)
          : "",
        validations: {
          required: requiredMessage("End date"),
        },
        controlType: "input",
        label: "End Date",
        isRequired: true,
        props: {
          type: "date",
        },
      },
      files: {
          defaultValue: modalOpen?.data?.imageDetails?.path
    ? [addBaseUrl(modalOpen?.data?.imageDetails?.path)]
    : [],
        controlType: "file",
        label: "File",
        placeholder: "Select File",
        isRequired: true,
        isControlled: true,
        validations: {
          required: requiredMessage("Image"),
        },
        props: {
          multiple: false,
          accept: "image/*",
        },
      },
    }),
    [modalOpen?.data]
  );

  const { control, register, handleSubmit, formState, reset } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });

  const closeModal = () => {
    reset();
    dispatch(setModalOpen(false));
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: dateConverter(values.startDate),
      endDate: dateConverter(values.endDate),
    };

    const formData = new FormData();
    for (const key in payload) {
      if (key === "files") {
        for (const file of payload[key]) {
          formData.append("files", file);
        }
      } else {
        formData.append(key, payload[key]);
      }
    }

    const data = isEdit
      ? await CampaignService.updateCampaign(modalOpen?.data?.id, formData)
      : await CampaignService.addCampaign(formData);
    if (data) {
      toast.success(
        data.message ||
          `Campaign ${isEdit ? "updated" : "created"} successfully`
      );
      getData?.();
      closeModal();
    }
    // const data = isEdit
    //   ? await CampaignService.updateCampaign(modalOpen?.data?.id, values)
    //   : await CampaignService.addCampaign(values);
    // if (data) {
    //   toast.success(
    //     data.message ||
    //       `Campaign ${isEdit ? "updated" : "created"} successfully`
    //   );
    //   getData?.();
    //   closeModal();
    // }
  };

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [modalOpen.data, formConfig, reset]);

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.ADD_CAMPAIGN}
      closeModal={closeModal}
      heading={heading}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <div className={styles.main}>
          {formRenderer(formConfig, formState, register, control)}
        </div>
        <div className={styles.buttonsContainer}>
          <Button type="button" onClick={closeModal} outlined>
            Cancel
          </Button>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={formState.isSubmitting || !formState.isValid}
          >
            {formState.isSubmitting ? (
              <LoadingText text="Submitting" />
            ) : (
              heading
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCampaign;
