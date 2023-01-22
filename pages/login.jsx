import { useEffect, useState } from "react";
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
import CheckBox from "components/CheckBox";
import { emailSchema, passwordSchema } from "validators/valid";

const FormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
      <h1 className="text-6xl font-bold mb-10 text-slate-600">Login</h1>

      <form ref={zo.ref}>
        <Fieldset legend="Enter to your account">
          <Input
            label="Email"
            type="email"
            name={zo.fields.email()}
            errorMessage={zo.errors.email((e) => e.message)}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name={zo.fields.password()}
            errorMessage={zo.errors.password(
              "Must have more than 6 characters"
            )}
          />
          <div className="ml-2 mb-3 text-sm">
            <CheckBox onChange={() => setShowPassword(!showPassword)}>
              Show Password
            </CheckBox>
          </div>
          <Button isDisabled={disabled} type="submit">
            Login
          </Button>
        </Fieldset>
      </form>
      {Object.keys(auth).length !== 0 && (
        <Banner text="Login Successful! Redirect" />
      )}
      <section className="mb-10">
        <p className="my-2">Did you forget your password?</p>
        <Link href="/forgot-password">
          <Button hipster>Reset Password</Button>
        </Link>
      </section>
      <section className="mb-14">
        <p className="my-2">Don't you have an account yet?</p>
        <Link href="/register">
          <Button cta>Register Now</Button>
        </Link>
      </section>
    </main>
  );
}
