import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCtx } from "store/globalState";
import filterSearch from "utils/filterSearch";
import useDebounce from "utils/useDebounce";
import Fieldset from "components/Fieldset";
import Input from "components/Input";
import CheckBox from "components/CheckBox";
import { Category } from "utils/types";

const Filter = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState(
    router?.query?.category ? router.query.category : ""
  );
  const debouncedSearchTerm = useDebounce(search);

  const { categories }: { categories: Category[] } = useCtx();

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };
  const handleShowInStock = (e: boolean) => {
    filterSearch({ router, showInStock: e ? "true" : "false" });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  const AZsort = (a: { name: string }, b: { name: string }) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
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
          // autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <select
              className="capitalize bg-slate-50 w-full mb-2 p-2 text-slate-600 cursor-pointer focus:outline-none focus:text-miu-600 transition"
              value={sort}
              placeholder="Order"
              onChange={handleSort}
            >
              <optgroup
                label="Order"
                className="bg-slate-100 text-xl text-miu-600 "
              >
                <option value="-createdAt">Newest</option>
                <option value="oldest">Oldest</option>
                {/* <option value="-sold">Best sales</option>
                <option value="price">Lowest Price</option>
                <option value="-price">Highest Price</option> */}
              </optgroup>
            </select>
          </div>

          <div>
            <select
              className="capitalize bg-slate-50 w-full mb-2 p-2 text-slate-600 cursor-pointer focus:outline-none focus:text-miu-600 transition"
              value={category}
              onChange={handleCategory}
            >
              <optgroup
                label="Category"
                className="bg-slate-100 text-xl text-miu-600 "
              >
                <option value="all">All Category</option>
                {categories.sort(AZsort).map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {/* <div className="ml-2 my-4 mb-6">
            <CheckBox
              isSelected={router?.query?.showInStock === "true" ? true : false}
              onChange={handleShowInStock}
            >
              Show products in stock
            </CheckBox>
          </div> */}

          {/* HIDDEN ALREADY BEFORE NO_PAY <input
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
