import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import Input from "components/Input";
import Button from "components/Button";
import Banner from "components/Banner";
import Fieldset from "components/Fieldset";
import Title from "components/Title";
import BgAnimated from "components/BgAnimated";
import { useZorm } from "react-zorm";
import { z, ZodSchema } from "zod";
import { emailSchema } from "validators/valid";

const ForgotPassword = () => {
  const [message, setMessage] = useState(null);

  const { notify } = useCtx();

  const FormSchema = z.object({
    email: emailSchema,
  });
  if (FormSchema instanceof ZodSchema === false) {
    throw Error("useZorm must have a ZodSchema as second argument");
  }

  const zo = useZorm("forgotPassword", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      handleSubmit(e.data);
    },
  });

  const disabled = zo.validation?.success === false;

  const handleSubmit = async (user: { email?: string }) => {
    notify({ loading: true });
    const res = await postData("resetPassword/forgot-password", user);

    if (res.err) return notify({ error: res.err });

    setMessage(res.msg);
    return notify({ success: res.msg });
  };

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Forgot Password`}
        canonical="https://miustation.netlify.app/forgot-password"
        description="Forgot password page for Miu Station"
      />

      <BgAnimated />

      <Title>Reset Password</Title>
      {message && <Banner text={message} />}
      <form ref={zo.ref}>
        <Fieldset legend="Insert your Email">
          <div className="form-group">
            <Input
              type="email"
              label="Email"
              name={zo.fields.email()}
              errorMessage={zo.errors.email((e) => e.message)}
            />
          </div>

          <Button isDisabled={disabled} type="submit">
            Get Reset Password Link
          </Button>
        </Fieldset>
      </form>
      <section className="mb-14">
        <div className="my-2 text-slate-600">
          No account yet?{" "}
          <Link
            href="/register"
            className="text-rose-500 underline hover:text-rose-600 transition"
          >
            Register Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
