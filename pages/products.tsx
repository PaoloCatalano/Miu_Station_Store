import {
  useState,
  useEffect,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import type { NextPage } from "next";
import type { Product } from "utils/types";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineNewLabel } from "react-icons/md";
import { useCtx } from "store/globalState";
import { getData } from "utils/fetchData";
import ProductItem from "components/ProductItem";
import filterSearch from "utils/filterSearch";
import Filter from "components/Filter";
import CheckBox from "components/CheckBox";
import pic from "public/images/logos/products.png";
import Button from "components/Button";
import TitleImage from "components/TitleImage";
import Title from "components/Title";

type Props = {
  result: number;
  products: Product[];
};

type ExtendedButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  onClick: () => void;
};

const Products: NextPage = (props: Props) => {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const { auth, addModal, loading } = useCtx();
  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (router.query && !router.query.page) setPage(1);

    if (router.query?.page)
      setPage(Number.parseInt(router.query.page as string));
  }, [router.query]);

  const handleCheck = (id: string) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckALL = () => {
    products.forEach((product) => (product.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          title: "Delete selected products?",
          type: "deleteProduct",
        });
      }
    });

    addModal(deleteArr);
  };

  const buttonProps: ExtendedButtonProps = {
    onClick: () => {
      filterSearch({ router, page: (page + 1) as unknown as string });
    },
  };

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} 🚉🛍️ Products`}
        description={`Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.
`}
        canonical="https://miustationstore.netlify.app/products"
        openGraph={{
          title: `${process.env.WEBSITE_NAME} 🚉🛍️ Products`,
          description: `Miu Station Store is an online shop selling various handmade items. Navigating through the product page, you will find stickers, dolls, clothes, kimonos, paintings, handcrafts, and much more.`,
          url: "https://miustationstore.netlify.app/products",
        }}
      />
      <TitleImage image={pic} alt="products" />
      <section className="relative w-full container flex flex-col items-center justify-center gap-5 px-1 md:flex-row md:items-start md:space-x-10">
        <aside className="top-1 md:pl-4 md:sticky">
          {auth.user && auth.user.role === "admin" && (
            <Link href="/create">
              <Button>
                <MdOutlineNewLabel className="mx-auto my-1 text-3xl" />
                Create New Product
              </Button>
            </Link>
          )}
          <Filter />
        </aside>
        <div className="grow">
          <div className="flex flex-wrap justify-center md:justify-center gap-6 ">
            {products.length === 0 ? (
              <div className="mt-10">
                <Title>No Products</Title>
              </div>
            ) : (
              products.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  handleCheck={handleCheck}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="my-10">
        {!loading ? (
          <button
            {...buttonProps}
            className="uppercase px-10 ring-2 ring-slate-600 rounded p-2 text-slate-600 transition hover:ring-4 disabled:pointer-events-none 
            disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-slate-400
            "
            disabled={loading || props.result < page * 6}
          >
            Load more
          </button>
        ) : (
          <button className="w-[177.56px] px-10 ring-2 ring-slate-600 rounded p-2 transition hover:ring-4 pointer-events-none">
            <div className="flex gap-2 px-[11px] py-1">
              <span className="rounded-full px-2 w-4 h-4 bg-slate-600 animate-bounce"></span>
              <span
                className="rounded-full px-2 w-4 h-4 bg-slate-600 animate-bounce"
                style={{ animationDelay: "75ms" }}
              ></span>
              <span
                className="rounded-full px-2 w-4 h-4 bg-slate-600 animate-bounce"
                style={{ animationDelay: "100ms" }}
              ></span>
            </div>
          </button>
        )}
      </section>
      {auth.user && auth.user.role === "admin" && (
        <section className="bg-red-200 w-11/12 max-w-screen-lg py-10 px-6 rounded space-y-5">
          <h1 className="text-center text-2xl">Danger Zone</h1>
          <div className="w-100 flex-col space-y-4">
            <CheckBox isSelected={isCheck} onChange={handleCheckALL}>
              Delete All Products
            </CheckBox>

            <Button hipster onPress={handleDeleteAll} className="!bg-red-400">
              DELETE
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const showInStock = query.showInStock || "";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&showInStock=${showInStock}&sort=${sort}&title=${search}`
  );
  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default Products;
