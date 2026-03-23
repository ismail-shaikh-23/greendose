import React, { useCallback } from "react";
import styles from "./DeliveryTracker.module.scss";
import { DELIVERY_STATUS } from "@/lib/constants";
import { capitalizeText, combineClasses } from "@/lib/utils";
import CheckIcon from "@/components/SVGComponents/CheckIcon";
import TimesIcon from "@/components/SVGComponents/TimesIcon";
import CrossIcon from "@/components/SVGComponents/CrossIcon";
import OrderPlaced from "@/components/SVGComponents/OrderPlaced";
import OrderShipped from "@/components/SVGComponents/OrderShipped";
import OrderInTransit from "@/components/SVGComponents/OrderInTransit";
import OutForDelivery from "@/components/SVGComponents/OutForDelivery";
import OrderDelivered from "@/components/SVGComponents/OrderDelivered";

const statusLabels = DELIVERY_STATUS.reduce((acc, x) => {
  acc[x] = capitalizeText(x?.replaceAll("_", " "));
  return acc;
}, {});
const statusIcons = {
  placed: <OrderPlaced className={styles.icon} />,
  shipped: <OrderShipped className={styles.icon} />,
  in_transit: <OrderInTransit className={styles.icon} />,
  out_for_delivery: <OutForDelivery className={styles.icon} />,
  delivered: <OrderDelivered className={styles.icon} />,

};
const DeliveryTracker = ({ currentStatus = "placed" }) => {
  const currentIndex = DELIVERY_STATUS.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  const getCircleClass = useCallback(
    (index, isDone) => {
      const isActive = index === currentIndex && !isCancelled;
      switch (true) {
        case isDone:
          return styles.done;
        case isActive:
          return styles.active;
        default:
          return styles.inactive;
      }
    },
    [isCancelled, currentIndex]
  );

  const renderFinalCircle = useCallback(() => {
    const isDone = currentStatus === "delivered"
    let props;
    switch (true) {
      case isDone:
        props = { className: styles.done, icon: <CheckIcon className={styles.icon} /> };
        break
      case isCancelled:
        props = { className: styles.cancelled, icon: <CrossIcon className={styles.icon} /> };
        break
      default:
        props = { className: styles.inactive, icon: <TimesIcon className={styles.icon} /> };
        break
    }
    return (
      <div className={styles.stepContainer}>
        <div
          className={combineClasses(
          
            props.className,
            styles.renderFinal
          )}
        >
          {props.icon}
        </div>
        <div className={styles.label}>{statusLabels[currentStatus]}</div>
      </div>
    );
  }, [currentStatus, isCancelled])

  return (
    <div className={styles.trackerContainer}>
      {DELIVERY_STATUS.slice(0, -1).map((status, index) => {
        const isDone = index < currentIndex && !isCancelled;

        return (
          <React.Fragment key={status}>
            <div className={styles.stepContainer}>
              <div
                className={combineClasses(
                  styles.circle,
                  getCircleClass(index, isDone)
                )}
              >
                {isDone ? <CheckIcon className={styles.icon} /> : index + 1}
              </div>
               <div className={styles.statusIcon}>
          {statusIcons[status]}
        </div>
              <div className={styles.label}>{statusLabels[status]}</div>

              
            </div>
            {index < DELIVERY_STATUS.length - 2 && (
              <div
                className={combineClasses(
                  styles.line,
                  isDone && styles.lineDone
                )}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Final step: Delivered or Cancelled */}
      {renderFinalCircle()}
    </div>
  );
};

export default DeliveryTracker;
