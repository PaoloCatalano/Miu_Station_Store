import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import { useRouter } from "next/router";
import Input from "components/Input";
import Button from "components/Button";
import { useZorm } from "react-zorm";
import { z, ZodSchema } from "zod";
import { confirmPasswordSchema } from "validators/valid";

const FormPassSchema = confirmPasswordSchema;

const ResetPassword = () => {
  const { notify } = useCtx();
  const [pushToLogin, setPushToLogin] = useState(false);

  const router = useRouter();

  const { token, email } = router.query;

  if (FormPassSchema instanceof ZodSchema === false) {
    throw Error("useZorm must have a ZodSchema as second argument");
  }

  const zoPass = useZorm("updatePassword", FormPassSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      handleSubmit({ password: e.data.password, token, email });
      setPushToLogin(true);
    },
  });

  const disabledPass = zoPass.validation?.success === false;

  const errorField = `border-2 border-red-500`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pushToLogin) {
        return router.push("/login");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [pushToLogin]);

  const handleSubmit = async ({ password, token, email }) => {
    notify({ loading: true });

    const res = await postData("resetPassword/reset-password", {
      password,
      token,
      email,
    });

    if (res.err) return notify({ error: res.err });

    return notify({ success: res.msg });
  };

  return (
    <div>
      <NextSeo title={`${process.env.WEBSITE_NAME} | Reset Password`} />

      <form ref={zoPass.ref} className="">
        <fieldset className="container max-w-[247.2px] flex flex-col gap-4  rounded border-2 border-sky-500 my-3 p-3">
          <legend className="px-1 text-sky-600 select-none">
            Update Password
          </legend>
          <Input
            label="Password"
            type="password"
            description="minimum 6 characters"
            name={zoPass.fields.password()}
            className={`px-2 ${zoPass.errors.password(errorField)}`}
            errorMessage={zoPass.errors.password((e) => e.message)}
          />
          <Input
            label="Confirm Password"
            type="password"
            name={zoPass.fields.confirmPassword()}
            className={`px-2 ${zoPass.errors.confirmPassword(errorField)}`}
            errorMessage={zoPass.errors.confirmPassword((e) => e.message)}
          />
          <Button isDisabled={disabledPass} type="submit">
            Update Password
          </Button>
        </fieldset>
      </form>
    </div>
  );
};

export default ResetPassword;
