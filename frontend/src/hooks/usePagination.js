import { useState } from "react";

const usePagination = (data, rowsPerPage) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return {
    currentData,
    totalPages,
    page,
    handlePageChange,
  };
};

export default usePagination;
