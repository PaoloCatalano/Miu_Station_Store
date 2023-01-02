import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { postData } from "utils/fetchData";
import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import Button from "components/Button";

export default function VerifyEmail() {
  const { auth, notify } = useCtx();
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { token, email } = router.query;

    if (token && email) {
      verifyingEmail({ token, email });
    }
  }, [router.query, auth]);

  async function verifyingEmail({ token, email }) {
    const res = await postData("auth/verify-email", {
      verificationToken: token,
      email,
    });

    if (res.err) {
      setError(true);
      return notify({ error: res.err });
    }

    setError(false);
    return notify({ success: res.msg });
  }

  return (
    <div className="row mx-auto">
      <NextSeo title={`${process.env.WEBSITE_NAME} | Verify Email`} />
      <div className=" w-100  table-responsive my-5 ">
        {Object.keys(router.query).length > 0 && !error && (
          <h2 className="text-uppercase alert-success px-3">
            Thank you! Your account has been verified correctly.
          </h2>
        )}
      </div>
      <Link href="/">
        <Button type="button" className="btn btn-warning w-100 text-uppercase">
          enjoy shopping
        </Button>
      </Link>
    </div>
  );
}
