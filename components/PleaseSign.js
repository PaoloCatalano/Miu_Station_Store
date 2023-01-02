import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import GoBack from "./GoBack";
import Loading from "./Loading";
import Button from "./Button";

export default function PleaseSign() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home_page">
      {show ? (
        <>
          <NextSeo title="Miu Landing..." />
          <Loading />
        </>
      ) : (
        <>
          <NextSeo
            title={`${process.env.WEBSITE_NAME} | Unauthorized Access`}
          />

          <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
            Unauthorized Access
          </h1>
          <div style={{ display: "grid", placeItems: "center" }}>
            <Link href="/login">
              <Button
                type="button"
                className="btn btn-outline-info d-block my-3 px-5"
              >
                Please Login!
              </Button>
            </Link>
          </div>
          <GoBack />
        </>
      )}
    </div>
  );
}
