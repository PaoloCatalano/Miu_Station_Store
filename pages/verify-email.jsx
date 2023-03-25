import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { postData } from "utils/fetchData";
import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
import Button from "components/Button";
import Banner from "components/Banner";

export default function VerifyEmail() {
  const { auth, notify } = useCtx();
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { token, email } = router.query;

    if (token && email) {
      verifyingEmail({ token, email });
    } else {
      setError(true);
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
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Verify Email`}
        canonical="https://miustationstore.netlify.app/verify-email"
        description="Verify email for Miu Station Store"
      />
      <div className="mb-10">
        {Object.keys(router.query).length > 0 && !error && (
          <Banner text="Thank you! Your account has been verified correctly." />
        )}
      </div>
      <Link href="/products">
        <Button cta>Enjoy Shopping</Button>
      </Link>
    </>
  );
}
