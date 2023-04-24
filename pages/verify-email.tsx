import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { postData } from "utils/fetchData";
import { useCtx } from "store/globalState";
import { useRouter } from "next/router";
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
      <Link href="/products?search=all" className="self-center">
        {/* CTA Button ~ */}
        <button className="my-3 text-white rounded max-w-xs transition-all  hover:ring-4 active:shadow-in focus:outline-none focus:ring-4 bg-gradient-to-br from-blue-400 to-miu-600 to-60% hover:ring-miu-400 focus:ring-miu-500 hover:to-70%">
          <div className="px-5 p-2 transition-all active:translate-x-[1px] active:translate-y-[1px]">
            Enjoy Shopping
          </div>
        </button>
      </Link>
    </>
  );
}
