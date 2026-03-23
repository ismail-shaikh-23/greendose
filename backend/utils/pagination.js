exports.getPagination = ({ page = 1, limit = 10 }) => {
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  return { offset, pageLimit: parseInt(limit, 10) };
};
