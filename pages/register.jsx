import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useZorm } from "react-zorm";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import Button from "components/Button";
import Input from "components/Input";
import Fieldset from "components/Fieldset";
import userSchema from "validators/userSchema";
import { passwordSchema } from "validators/valid";
import ShowPassword from "../components/ShowPassword";
import BgAnimated from "components/BgAnimated";
import Title from "components/Title";

const FormSchema = userSchema
  .extend({
    cf_password: passwordSchema,
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Confirm password doesn't match.",
    path: ["cf_password"],
  });

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { notify, notifyStatus } = useCtx();
  const router = useRouter();

  const handleSubmit = async (userObj) => {
    notify({ loading: true });
    const res = await postData("auth/register", userObj);

    if (res.err) return notify({ error: res.err });

    return notify({ success: res.msg });
  };

  const zo = useZorm("register", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      handleSubmit(e.data);
      if (notifyStatus.success) {
        setTimeout(() => {
          router.push("/login");
        }, 3001);
      }
    },
  });

  const disabled = zo.validation?.success === false;

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Register`}
        canonical="https://miustationstore.netlify.app/register"
        description="Sign up page for Miu Station Store"
        openGraph={{
          url: "https://miustationstore.netlify.app/register",
          description: "Sign up page for Miu Station Store",
          title: `${process.env.WEBSITE_NAME} | Register}`,
        }}
      />
      <BgAnimated />
      <Title>Register</Title>
      <p className="text-sm text-slate-700">
        <b>IMPORTANT: </b>
        We will not send you any spam, promotional emails or advertisement at
        anytime!
      </p>
      <form ref={zo.ref}>
        <Fieldset legend="Create your Account">
          <Input
            maxLength={20}
            label="Name"
            type="text"
            name={zo.fields.name()}
            errorMessage={zo.errors.name((e) => e.message)}
          />
          <Input
            label="Email"
            type="email"
            name={zo.fields.email()}
            errorMessage={zo.errors.email((e) => e.message)}
          />
          <Input
            label="Address"
            type="text"
            name={zo.fields.address()}
            errorMessage={zo.errors.address((e) => e.message)}
          />
          <Input
            label="Mobile"
            type="text"
            maxLength={15}
            name={zo.fields.mobile()}
            errorMessage={zo.errors.mobile((e) => e.message)}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            description="minimum 6 characters"
            name={zo.fields.password()}
            errorMessage={zo.errors.password((e) => e.message)}
          />
          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            name={zo.fields.cf_password()}
            errorMessage={zo.errors.cf_password((e) => e.message)}
          />
          <ShowPassword
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Button isDisabled={disabled} type="submit">
            Create Account
          </Button>
        </Fieldset>
      </form>
      <section className="mb-14">
        <div className="my-2 text-slate-600">
          Already an account?{" "}
          <Link
            href="/login"
            className="text-rose-500 underline hover:text-rose-600 transition"
          >
            Login Now
          </Link>
        </div>
      </section>
    </>
  );
}
