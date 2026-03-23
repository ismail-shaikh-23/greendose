import React, { useState } from "react";
import styles from "./ProductsList.module.scss";
import Tooltip from "@/components/Tooltip/Tooltip";
import { capitalizeText, dateConverter } from "@/lib/utils";
import { Select } from "@/components/FormControl/Select/Select";
import { DELIVERY_STATUS } from "@/lib/constants";
import OrderService from "@/services/api/order";
import toast from "@/lib/toast";
import DeliveryTracker from "./DeliveryTracker/DeliveryTracker";
import MDEditor from "@uiw/react-md-editor";

const Product = ({ product, getData }) => {
  const [updating, setUpdating] = useState(false);
  const options = DELIVERY_STATUS.map((value) => ({
    label: capitalizeText(value?.replaceAll("_", " ")),
    value,
  }));

  const value = options.find((x) => x.value === product.deliveryStatus);

  const onChange = async (value) => {
    setUpdating(true);
    const data = await OrderService.updateDeliveryStatus({
      id: product?.id,
      status: value?.value,
    });
    if (data?.success) {
      await getData();
      toast.success(data?.message);
    } else if (data?.error) {
      toast.error(data?.error);
    }
    setUpdating(false);
  };
  return (
    <div className={styles.product}>
      <p className={styles.name}>{product?.productName || ""}</p>
      {/* <div className={styles.description} data-color-mode="light">
        <Tooltip
          id={product.productId?.toString()}
          data={product?.productDescription || ""}
          maxLength={300}
        />
        <MDEditor.Markdown source={product?.productDescription} />
      </div> */}
      <div className={styles.mid}>
        <div className={styles.productDetails}>
          <p>
            Qty: <span>{product?.productQuantity}</span>
          </p>
          <p>
            Expiry Date:{" "}
            <span>{dateConverter(product?.productExpiryDate)}</span>
          </p>
        </div>
        <Select
          className={styles.select}
          value={value}
          options={options}
          onChange={onChange}
          isLoading={updating}
          loadingText="Updating"
        />
      </div>
      <DeliveryTracker currentStatus={value.value} />
    </div>
  );
};

const ProductsList = ({ products = [], getData }) => {
  return (
    <div className={styles.productsList}>
      <p className={styles.heading}>Products List</p>
      <div className={styles.products}>
        {products?.map((product) => (
          <Product
            key={product.productId}
            product={product}
            getData={getData}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
