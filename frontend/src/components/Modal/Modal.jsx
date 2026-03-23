import React from "react";
import styles from "./Modal.module.scss";

const Modal = ({
  modalOpen,
  closeModal,
  heading,
  children,
  doNotClose = false,
  className="",
}) => {
  if (modalOpen) {
    return (
      <div
        className={styles.mainContainer}
        onMouseDown={(e) => {
          e.stopPropagation();
          !doNotClose && closeModal(false);
        }}
      >
        <div
          className={`${styles.modalDiv} ${className}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <p>{heading}</p>
          </div>
          <div className={styles.modalBody}>{children}</div>
        </div>
      </div>
    );
  }
};

export default Modal;


// import React from "react";
// import styles from "./Modal.module.scss";

// const Modal = ({
//   modalOpen,
//   closeModal,
//   heading,
//   children,
//   doNotClose = false,
//   className = "",
// }) => {
//   if (!modalOpen) return null; 

//   return (
//     <div
//       className={styles.mainContainer}
//       onMouseDown={(e) => {
//         e.stopPropagation();
//         !doNotClose && closeModal(false);
//       }}
//     >
//       <div
//         className={`${styles.modalDiv} ${className}`}
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         <div className={styles.modalHeader}>
//           <p>{heading}</p>
//         </div>
//         <div className={styles.modalBody}>{children}</div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
