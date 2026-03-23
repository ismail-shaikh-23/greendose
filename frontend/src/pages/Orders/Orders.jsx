import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "@/store/slices/orderSlice";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/constants";
import { capitalizeText, checkPermission } from "@/lib/utils";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import Table from "@/components/Table/Table";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import { Select } from "@/components/FormControl/Select/Select";
import styles from "./Orders.module.scss";
import { Link } from "react-router-dom";
import Tooltip from "@/components/Tooltip/Tooltip";
import OrderService from "@/services/api/order";
import toast from "react-hot-toast";
import FilterModal from "@/components/FilterModal/FilterModal";
import Button from "@/components/Button/Button";

const canEditPaymentStatus = checkPermission("update order payment status");
const canEditOrderStatus = checkPermission("update order status");

const Orders = () => {
  const {
    debouncedSearch,
    search,
    setSearch,
    pageSelected,
    setPageSelected,
    rowsPerPageValue,
    setRowsPerPageValue,
  } = useSearchPagination();

  const [filterParams, setFilterParams] = useState({});

  const handleApply = (filters) => {
    const cleanFilters = {
      ...filters,
      vendorId: filters?.vendorId?.value || "",
    };

    Object.keys(cleanFilters).forEach((key) => {
      if (!cleanFilters[key]) delete cleanFilters[key];
    });

    setFilterParams(cleanFilters);
    setPageSelected(1);
  };

  const handleReset = () => {
    setFilterParams({});
    setSearch("");
    setPageSelected(1);
  };

  const [updatingStatus, setUpdatingStatus] = useState(null);

  const dispatch = useDispatch();
  const { isFetching, orders, totalOrders } = useSelector(
    (state) => state.order
  );

  const handlePaymentStatusChange = async (id, status) => {
    setUpdatingStatus({ type: "payment", id });
    const data = await OrderService.updatePaymentStatus({ id, status });
    if (data?.success) {
      await getData(true);
      toast.success(data?.message);
    } else if (data?.error) {
      toast.error(data?.error);
    }
    setUpdatingStatus(null);
  };

  const handleOrderStatusChange = async (id, status) => {
    setUpdatingStatus({ type: "order", id });
    const data = await OrderService.updateOrderStatus({ id, status });
    if (data?.success) {
      await getData(true);
      toast.success(data?.message);
    } else if (data?.error) {
      toast.error(data?.error);
    }
    setUpdatingStatus(null);
  };

  const renderPaymentStatusDropdown = (row) => {
    if (!canEditPaymentStatus) return capitalizeText(row?.paymentStatus || "-");
    const options = PAYMENT_STATUS.map((status) => ({
      value: status.toLowerCase(),
      label: capitalizeText(status),
    }));

    const selectedValue = options.find(
      (opt) => opt.value === row?.paymentStatus
    );

    const loading =
      updatingStatus?.type === "payment" && updatingStatus?.id === row?.id;

    return (
      <Select
        value={selectedValue}
        options={options}
        className={styles.select}
        classNamePrefix="react-select"
        isSearchable={false}
        isLoading={loading}
        loadingText="Updating"
        onChange={(selected) => {
          handlePaymentStatusChange(row.id, selected?.value);
        }}
      />
    );
  };

  const renderOrderStatusDropdown = (row) => {
    if (!canEditOrderStatus)
      return capitalizeText(row?.orderStatusHistory?.status || "-");
    const options = ORDER_STATUS.map((status) => ({
      value: status.toLowerCase(),
      label: capitalizeText(status),
    }));

    const selectedValue = options.find(
      (opt) => opt.value === row?.orderStatusHistory?.status
    );

    const loading =
      updatingStatus?.type === "order" && updatingStatus?.id === row?.id;

    return (
      <Select
        value={selectedValue}
        options={options}
        className={styles.select}
        isSearchable={false}
        isLoading={loading}
        loadingText="Updating"
        onChange={(selected) => {
          handleOrderStatusChange(row.id, selected?.value);
        }}
      />
    );
  };

  const columns = [
    {
      name: "OrderNo",
      width: "170px",
      cell: (row) => <Link to={row?.id?.toString()}>{row?.orderNumber}</Link>,
    },
    {
      name: "Customer Name",
      width: "160px",
      selector: (row) =>
        row?.customer?.firstName
          ? `${row?.customer?.firstName} ${row?.customer?.lastName}`
          : "-",
    },
    {
      name: "Email",
      width: "230px",
      cell: (row) => (
        <Tooltip
          id={row?.id.toString()}
          data={row?.customer?.email || "-"}
          maxLength={30}
        />
      ),
    },
    {
      name: "Quantity",
      width: "100px",
      selector: (row) => row?.quantity,
    },
    {
      name: "Total-Amount",
      width: "130px",
      selector: (row) => row?.totalAmount,
    },
    {
      name: "Sub-Total",
      width: "100px",
      selector: (row) => row?.subTotal,
    },
    {
      name: "Vendor Name",
      width: "220px",
      cell: (row) => {
        const vendorNames =
          row?.vendorData
            ?.map((vendor) => vendor?.organizationName)
            ?.filter(Boolean)
            ?.join(", ") || "-";

        return (
          <Tooltip id={`vendor-${row?.id}`} data={vendorNames} maxLength={30} />
        );
      },
    },
    {
      name: "Payment-Status",
      width: "150px",
      selector: (row) => row?.paymentStatus,
      cell: (row) => renderPaymentStatusDropdown(row),
    },
    {
      name: "Order-Status",
      width: "150px",
      selector: (row) => row?.orderStatusHistory?.status,
      cell: (row) => renderOrderStatusDropdown(row),
    },
    {
      name: "Invoice-No",
      width: "200px",
      selector: (row) => row?.invoiceNumber,
    },
  ];

  const getData = useCallback(
    async (noLoading) => {
      await dispatch(
        getOrders({
          search: debouncedSearch,
          page: pageSelected,
          limit: rowsPerPageValue,
          noLoading,
          ...filterParams,
        })
      );
    },
    [dispatch, debouncedSearch, pageSelected, rowsPerPageValue, filterParams]
  );

  const handleExport = async () => {
    const data = await OrderService.getOrders({
      report: true,
      ...filterParams,
    });

    if (data?.data) {
      const downloadUrl = data?.data;
      console.log('downloadUrl', downloadUrl)
      setTimeout(() => {
        window.open(downloadUrl, "_self");
      }, 100)

    }
  };
  
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={styles.main}>
      <div className={styles.topBar}>
      <CustomHeader search={search} setSearch={setSearch} showFilter={true} />
        <FilterModal handleApply={handleApply} handleReset={handleReset} />
        <Button className={styles.exportButton} onClick={handleExport}>Export</Button>
      </div>
      <Table
        columns={columns}
        data={orders}
        className={styles.candidatesTable}
        progressPending={isFetching}
        paginationProps={{
          isPagination: true,
          tableName: "Orders",
          totalCount: totalOrders,
          pageSelected,
          rowsPerPageValue,
          setRowsPerPageValue,
          setPageSelected,
        }}
      />
    </div>
  );
};

export default Orders;
