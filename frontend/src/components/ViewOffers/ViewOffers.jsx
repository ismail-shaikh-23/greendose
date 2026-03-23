import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MODAL_ID } from "@/lib/constants";
import { setModalOpen } from "@/store/slices/globalSlice";
import Modal from "@/components/Modal/Modal";
import styles from "./ViewOffers.module.scss";
import { CURRENCY_SYMBOL } from "@/lib/constants";


const ViewOffers = () => {
  const dispatch = useDispatch();
  const { modalOpen } = useSelector((state) => state.global);

  const isOpen = modalOpen?.id === MODAL_ID.VIEW_OFFERS;
  const offers = modalOpen?.data?.allApplicableOffers || [];
  const originalPrice=modalOpen?.data?.price;
  
  const closeModal = () => {
    dispatch(setModalOpen(false));
  };

  return (
    <Modal
      modalOpen={isOpen}
      closeModal={closeModal}
      heading="Available Offers" 
      className={styles.viewOffersModal}
    >
      <div className={styles.offerList}>
        {offers.length ? (
          offers.map((offer, index) => (
            <div key={index} className={styles.offerCard}>
              <div className={styles.offerHeader}>
                <span className={styles.badge}>
                  {offer.discountType === "percentage"
                    ? `${offer.discountValue}% OFF`
                    : `₹${offer.discountValue} OFF`}
                </span>
                <h3>{offer.offerName}</h3>
              </div>
              <div className={styles.offerDetails}>
                <p>
                  <strong>Discount Amount:</strong> {CURRENCY_SYMBOL}{offer.discountAmount}
                </p>
                <p>
                  <strong>Final Price:</strong>
                  <span className={styles.finalPrice}> { CURRENCY_SYMBOL}{offer.finalPrice} </span>
                    <span className={styles.originalPrice}> {CURRENCY_SYMBOL}{originalPrice} </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noOffers}>No offers available.</p>
        )}
      </div>
    </Modal>
  );
};

export default ViewOffers;
