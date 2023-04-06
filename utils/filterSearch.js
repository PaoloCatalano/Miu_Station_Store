const filterSearch = ({
  router,
  page,
  category,
  showInStock,
  sort,
  search,
}) => {
  const path = router.pathname;
  const query = router.query;

  if (category) query.category = category;
  if (page) query.page = page;
  if (search) query.search = search;
  if (sort) query.sort = sort;
  if (showInStock) query.showInStock = showInStock;

  router.push(
    {
      pathname: path,
      query: query,
    },
    { pathname: path, query: query },
    { scroll: false }
  );
};

export default filterSearch;
