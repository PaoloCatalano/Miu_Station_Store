import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import GoBack from "./GoBack";
import Loading from "./Loading";
import Button from "./Button";
import Title from "./Title";

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

          <Title>Unauthorized Access</Title>
          <div>
            <Link href="/login">
              <Button>Please Login</Button>
            </Link>
          </div>
          <GoBack />
        </>
      )}
    </div>
  );
}
