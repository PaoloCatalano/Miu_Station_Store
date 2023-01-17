import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import Input from "components/Input";
import Button from "components/Button";
import Fieldset from "components/Fieldset";
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

  const handleSubmit = async (user) => {
    notify({ loading: true });
    const res = await postData("resetPassword/forgot-password", user);

    if (res.err) return notify({ error: res.err });

    setMessage(res.msg);
    return notify({ success: res.msg });
  };

  return (
    <div>
      <NextSeo title={`${process.env.WEBSITE_NAME} | Forgot Password`} />
      {message && <h1 className="bg-green-500 rounded p-2">{message}</h1>}
      <form className="mx-auto my-4" style={{ maxWidth: "500px" }} ref={zo.ref}>
        <Fieldset legend="Insert your Email">
          <div className="form-group">
            <Input
              type="email"
              label="Email"
              name={zo.fields.email()}
              errorMessage={zo.errors.email((e) => e.message)}
            />
          </div>

          <Button
            isDisabled={disabled}
            type="submit"
            className="btn btn-dark w-100"
          >
            Get Reset Password Link
          </Button>
        </Fieldset>
      </form>
      <section className="mb-10">
        <p className="my-2">You don't have an account yet?</p>
        <Link
          href="/register"
          className="text-rose-500 text-center font-bold underline-offset-4 decoration-2 hover:decoration-dashed hover:underline"
        >
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default ForgotPassword;
