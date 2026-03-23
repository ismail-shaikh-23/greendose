import TopProductsIcon from "@/components/SVGComponents/TopProductsIcon";
import styles from "./TopProducts.module.scss";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDashboardTopProductsData } from "@/store/slices/dashboardSlice";
import fallbackImage from "/fallback_product_image.jpg"; // fallback if no image available
import { addBaseUrl } from "@/lib/utils";

const TopProducts = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dashboard);

  const topProducts = data?.topProducts || [];

  useEffect(() => {
    dispatch(getDashboardTopProductsData());
  }, [dispatch]);

  return (
    <div className={styles.parentContainer}>
      <div className={styles.header}>
        <TopProductsIcon />
        <h3>Top Products</h3>
      </div>
      <div className={styles.listContainer}>
        {topProducts.length > 0 ? (
          topProducts.map((product, index) => (
            <ListItem
              key={product.id}
              sr={index + 1}
              name={product.name}
              image={addBaseUrl(
                product?.images?.[0]?.imageDetails?.path?.replace?.(
                  "public/",
                  ""
                ) || fallbackImage
              )}
              number={+product.count || 0}
              category={product?.subCategory?.category?.name || "N/A"}
              currency={`AED ${product.price}`}
            />
          ))
        ) : (
          <p>No top products found.</p>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
