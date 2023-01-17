import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { z, ZodSchema } from "zod";
import { useZorm } from "react-zorm";
import Link from "next/link";
import Cookie from "js-cookie";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import { useRouter } from "next/router";
import Button from "components/Button";
import Input from "components/Input";
import Fieldset from "components/Fieldset";
import Banner from "components/Banner";
import { emailSchema, passwordSchema } from "validators/valid";

const FormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default function Login() {
  if (FormSchema instanceof ZodSchema === false) {
    throw Error("useZorm must have a ZodSchema as second argument");
  }
  const zo = useZorm("signup", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      handleSubmit(e.data);
    },
  });
  const { auth, notify, authUser } = useCtx();

  const router = useRouter();

  const disabled = zo.validation?.success === false;

  const handleSubmit = async (userObj) => {
    notify({ loading: true });
    const res = await postData("auth/login", userObj);

    if (res.err) return notify({ error: res.err });

    notify({ success: res.msg });

    authUser({
      token: res.access_token,
      user: res.user,
    });

    Cookie.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });

    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(auth).length !== 0) {
        return router.push("/");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [auth]);

  return (
    <main className="main">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Login`}
        canonical="https://miustationstore.netlify.app/login"
        openGraph={{
          url: "https://miustationstore.netlify.app/login",
        }}
      />
      <h1 className="text-6xl font-bold mb-10">Login</h1>
      {Object.keys(auth).length !== 0 && (
        <Banner text="Login Successful! Redirect" />
      )}
      <form ref={zo.ref} className="">
        <Fieldset legend="Enter to your account">
          <Input
            label="Email"
            type="email"
            name={zo.fields.email()}
            errorMessage={zo.errors.email((e) => e.message)}
          />
          <Input
            label="Password"
            type="password"
            name={zo.fields.password()}
            errorMessage={zo.errors.password(
              "Must have more than 6 characters"
            )}
          />

          <Button isDisabled={disabled} type="submit">
            Login
          </Button>
        </Fieldset>
        {/* <pre className="text-left">
          zo.validation:
          <p>{JSON.stringify(zo.validation, null, 1)}</p>
        </pre> */}
      </form>
      <section className="mb-10">
        <p className="my-2">Did you forget your password?</p>
        <Link
          href="/forgot-password"
          className="text-slate-800 text-center font-bold underline-offset-4 decoration-2 hover:decoration-dashed hover:underline"
        >
          Reset password
        </Link>
      </section>
      <section className="mb-10">
        <p className="my-2">Don't you have an account yet?</p>
        <Link
          href="/register"
          className="text-rose-500 text-center font-bold underline-offset-4 decoration-2 hover:decoration-dashed hover:underline"
        >
          Register Now
        </Link>
      </section>
    </main>
  );
}
