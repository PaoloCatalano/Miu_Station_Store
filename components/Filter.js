import React, { useState, useEffect } from "react";
import { useCtx } from "store/globalState";
import filterSearch from "utils/filterSearch";
import useDebounce from "utils/useDebounce";
import { useRouter } from "next/router";

const Filter = ({ state }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState(
    router?.query?.category ? router.query.category : ""
  );
  const debouncedSearchTerm = useDebounce(search);

  const { categories } = useCtx();

  const handleCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  const AZsort = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    filterSearch({
      router,
      search: debouncedSearchTerm ? debouncedSearchTerm.toLowerCase() : "all",
    });
  }, [debouncedSearchTerm]);

  return (
    <div className="input-group border border-info rounded-pill">
      <form
        autoComplete="off"
        className="d-flex  _search-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="input-group-prepend col-md-4 px-0 mt-2 mb-2">
          <select
            className="custom-select text-capitalize"
            value={sort}
            onChange={handleSort}
          >
            <option value="-createdAt">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="-sold">Best sales</option>
            <option value="price">Lowest Price</option>
            <option value="-price">Highest Price</option>
          </select>
        </div>

        <div className="input-group-prepend col-md-4 px-0 mt-2 mb-2">
          <select
            className="custom-select text-capitalize"
            value={category}
            onChange={handleCategory}
          >
            <option value="all">All Category</option>

            {categories.sort(AZsort).map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <input
          placeholder="Search..."
          type="search"
          className="form-control-plaintext col-md-8 mt-2 mb-2"
          list="title_product"
          value={search.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Filter;
