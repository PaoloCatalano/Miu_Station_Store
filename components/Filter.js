import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import filterSearch from "utils/filterSearch";
import useDebounce from "utils/useDebounce";
import Fieldset from "components/Fieldset";
import Input from "components/Input";

const Filter = () => {
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
    <>
      <Fieldset legend="filters">
        <form
          autoComplete="off"
          className=""
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="">
            <select
              className="capitalize bg-slate-50 w-full mb-2 p-2 appearance-none "
              value={sort}
              placeholder="Order"
              onChange={handleSort}
            >
              <optgroup label="Order" className="bg-slate-400 text-xl">
                <option value="-createdAt">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="-sold">Best sales</option>
                <option value="price">Lowest Price</option>
                <option value="-price">Highest Price</option>
              </optgroup>
            </select>
          </div>

          <div className="">
            <select
              className="capitalize bg-slate-50 w-full mb-2 p-2 appearance-none"
              value={category}
              onChange={handleCategory}
            >
              <optgroup label="Category" className="bg-slate-400 text-xl">
                <option value="all">All Category</option>
                {categories.sort(AZsort).map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* <input
          placeholder="Search..."
          type="search"
          className=""
          list="title_product"
          value={search?.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

          <Input
            label="Search"
            type="search"
            value={search.toLowerCase()}
            onChange={setSearch}
          />
        </form>
      </Fieldset>
    </>
  );
};

export default Filter;
