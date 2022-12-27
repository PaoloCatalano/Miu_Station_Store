import React from "react";
import { z } from "zod";
import { useZorm } from "react-zorm";
import Button from "./Button";
import Input from "./Input";
import userSchema from "validators/userSchema";

const FormSchema = userSchema.extend({
  cf_password: z.string(),
});

export default function Signup() {
  const zo = useZorm("signup", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      // submitData(e).then((data) => console.log(data));
      console.log(e);
      alert("Form ok!\n" + JSON.stringify(e.data, null, 2));
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
          label="Name"
          type="text"
          description="not empty"
          name={zo.fields.name()}
          errorMessage={zo.errors.name((e) => e.message)}
          defaultValue="PC"
        />
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
          type="text"
          description="min 6 char."
          name={zo.fields.password()}
          className={`px-2 ${zo.errors.password(errorField)}`}
          errorMessage={zo.errors.password("6 characters minimum")}
          defaultValue="password"
        />
        <Input
          label="Confirm Password"
          type="text"
          description="min 6 char."
          name={zo.fields.cf_password()}
          className={`px-2 ${zo.errors.cf_password(errorField)}`}
          errorMessage={zo.errors.cf_password("6 characters minimum")}
          defaultValue="password"
        />

        <Button isDisabled={disabled} type="submit">
          Signup!
        </Button>
      </fieldset>
      <pre className="text-left">
        zo.validation:
        <p>{JSON.stringify(zo.validation, null, 1)}</p>
      </pre>
    </form>
  );
}
