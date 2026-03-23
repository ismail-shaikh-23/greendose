import { useEffect, useState } from "react";
import { PAGINATION } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";

const debounceTime = 500;

export function useSearchPagination() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(
    params.get("search") ?? null
  );
  const [pageSelected, setPageSelected] = useState(
    parseInt(params.get("pageNo")) || PAGINATION.DEFAULT_PAGE_NUMBER
  );
  const [rowsPerPageValue, setRowsPerPageValue] = useState(
    PAGINATION.DEFAULT_ROWS_PER_PAGE
  );

  const reset = () => {
    setSearch(null);
    setDebouncedSearch(null);
    setPageSelected(PAGINATION.DEFAULT_PAGE_NUMBER);
    setRowsPerPageValue(PAGINATION.DEFAULT_ROWS_PER_PAGE);
  };

  useEffect(() => {
    const x = setTimeout(() => {
      if (search !== null) {
        setDebouncedSearch(search);
        setPageSelected(1);
      }
    }, debounceTime);

    return () => {
      clearTimeout(x);
    };
  }, [search]);

  useEffect(() => {
    setParams((prev) => {
      prev.set("pageNo", pageSelected);
      if (debouncedSearch !== null) {
        prev.set("search", debouncedSearch);
      }
      return prev;
    });
  }, [pageSelected, debouncedSearch, setParams]);

  return {
    debouncedSearch,
    search: search ?? debouncedSearch,
    setSearch,
    pageSelected,
    setPageSelected,
    rowsPerPageValue,
    setRowsPerPageValue,
    reset,
  };
}
