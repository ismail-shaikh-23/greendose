import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MODAL_ID } from "@/lib/constants";
import { setModalOpen } from "@/store/slices/globalSlice";
import Modal from "@/components/Modal/Modal";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import styles from './ViewImage.module.scss'
import { addBaseUrl} from "@/lib/utils";

const ViewImage = () => {
  const dispatch = useDispatch();
  const { modalOpen } = useSelector((state) => state.global);

  const isOpen = modalOpen?.id === MODAL_ID.VIEW_IMAGE;
  const images = modalOpen?.data?.images?.map((img) => ({
    id: img.id,
    url: addBaseUrl(img.imageDetails?.path.replace("public/", ""))
  })) || [];


  const closeModal = () => {
    dispatch(setModalOpen(false));
  };


  return (
    <Modal modalOpen={isOpen} closeModal={closeModal} heading="View Images" className={styles.smallModal}>
      <div className={styles.image_width}>

        {images.length > 0 ? (
          <ImageSlider images={images} />
        ) : (
          <p>No images available</p>
        )}

      </div>
    </Modal>
  );
};

export default ViewImage;
