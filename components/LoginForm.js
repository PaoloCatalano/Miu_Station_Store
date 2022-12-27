import React from "react";
import { z, ZodObject } from "zod";
import { useZorm } from "react-zorm";
import Button from "./Button";
import Input from "./Input";
import { emailSchema, passwordSchema } from "validators/valid";

const FormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export default function LoginForm() {
  const zo = useZorm("login", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      console.log();
      // submitData(e).then((data) => console.log(data));
      // console.log(e);
      alert(FormSchema instanceof ZodObject);
      // alert("Form ok!\n" + JSON.stringify(e.data, null, 2));
    },
  });
  const disabled = zo.validation?.success === false;

  const errorField = `border-2 border-red-500`;

  return (
    <form ref={zo.ref} className="">
      <fieldset className="container max-w-[247.2px] flex flex-col gap-4  rounded border-2 border-sky-500 my-3 p-3">
        <legend className="px-1 text-sky-600 select-none">
          Select User Profile
        </legend>

        <Input
          label="Email"
          type="email"
          description="not empty"
          name={zo.fields.email()}
          errorMessage={zo.errors.email((e) => e.message)}
          defaultValue="PC@email.com"
        />
        <Input
          label="Password"
          type="password"
          description="your password"
          name={zo.fields.password()}
          className={`px-2 ${zo.errors.password(errorField)}`}
          errorMessage={zo.errors.password("Must be a valid password")}
          defaultValue="password"
        />

        <Button isDisabled={disabled} type="submit">
          Login
        </Button>
      </fieldset>
      <pre className="text-left">
        zo.validation:
        <p>{FormSchema instanceof ZodObject}</p>
        {/* <p>{JSON.stringify(zo.validation, null, 1)}</p> */}
      </pre>
    </form>
  );
}
