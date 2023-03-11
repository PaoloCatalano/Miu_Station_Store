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
import CheckBox from "components/CheckBox";
import userSchema from "validators/userSchema";
import { passwordSchema } from "validators/valid";
import ShowPassword from "../components/ShowPassword";
import BgAnimated from "components/BgAnimated";

const FormSchema = userSchema
  .extend({
    cf_password: passwordSchema,
  })
  .refine((data) => data.password === data.cf_password, {
    message: "Confirm password doesn't match.",
    path: ["cf_password"],
  });

/**@TODO limit register API */

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
        openGraph={{
          url: "https://miustationstore.netlify.app/register",
        }}
      />
      <BgAnimated />
      <h1 className="text-6xl font-bold mb-10 text-blue-400">Register</h1>
      <form ref={zo.ref} className="">
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
      <section className="mt-10 mb-14">
        <p className="my-2">Already an account?</p>
        <Link href="/login">
          <Button hipster>Login Now</Button>
        </Link>
      </section>
    </>
  );
}
