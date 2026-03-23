import EditIcon from "@/components/SVGComponents/EditIcon";
import DeleteIcon from "@/components/SVGComponents/DeleteIcon";
import styles from "./ActionsCell.module.scss";
import Eye from "@/components/SVGComponents/Eye";
import PropTypes from "prop-types";
import Tooltip from "../Tooltip/Tooltip";
import TickIcon from "../SVGComponents/TickIcon";
import CrossIcon from "../SVGComponents/CrossIcon";

const ActionsCell = ({
  id = "0",
  image,
  onView,
  onEdit,
  onDelete,
  onText,
  onApprove,
  onReject,
}) => {
  return (
    <div className={styles.actions}>
      {onApprove && (
        <Tooltip id={id} data="Approve">
          <TickIcon className={styles.approveIcon} onClick={onApprove} />
        </Tooltip>
      )}
      {onReject && (
        <Tooltip id={id} data="Reject">
          <CrossIcon className={styles.rejectIcon} onClick={onReject} />
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip id={id} data="Edit">
          <EditIcon className={styles.editIcon} onClick={onEdit} />
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip id={id} data="Delete">
          <DeleteIcon className={styles.deleteIcon} onClick={onDelete} />
        </Tooltip>
      )}
      {onText && (
        <button className={styles.viewText} onClick={onText}>
          {" "}
          View Offers
        </button>
      )}
    </div>
  );
};

ActionsCell.propTypes = {
  id: PropTypes.string || PropTypes.number,
  image: PropTypes.func,
  onView:PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onText: PropTypes.func,
};

export default ActionsCell;
