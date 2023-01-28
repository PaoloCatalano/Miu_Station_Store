import { useState, useEffect } from "react";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import { useRouter } from "next/router";
import Input from "components/Input";
import Button from "components/Button";
import Fieldset from "components/Fieldset";
import { useZorm } from "react-zorm";
import { z, ZodSchema } from "zod";
import { confirmPasswordSchema } from "validators/valid";
import ShowPassword from "../components/ShowPassword";

const FormPassSchema = confirmPasswordSchema;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    <>
      <NextSeo title={`${process.env.WEBSITE_NAME} | Reset Password`} />
      <h1 className="my-5">Reset Password</h1>
      <form ref={zoPass.ref}>
        <Fieldset legend="Insert new Password">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            description="minimum 6 characters"
            name={zoPass.fields.password()}
            errorMessage={zoPass.errors.password((e) => e.message)}
          />
          <Input
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            name={zoPass.fields.confirmPassword()}
            errorMessage={zoPass.errors.confirmPassword((e) => e.message)}
          />
          <ShowPassword
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Button isDisabled={disabledPass} type="submit">
            Update Password
          </Button>
        </Fieldset>
      </form>
    </>
  );
};

export default ResetPassword;
