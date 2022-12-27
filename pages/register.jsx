import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useZorm } from "react-zorm";
import { useCtx } from "store/globalState";
import { postData } from "utils/fetchData";
import Button from "components/Button";
import Input from "components/Input";
import userSchema from "validators/userSchema";
import { passwordSchema } from "validators/valid";

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
  const { auth, notify, notifyStatus } = useCtx();
  const router = useRouter();

  const handleChangeInput = (e) => {
    // const { name, value } = e.target;
    // setUserData({ ...userData, [name]: value });
    notify({});
  };

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

  const errorField = `border-2 border-red-500`;

  return (
    <main className="main">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Register`}
        canonical="https://miustationstore.netlify.app/register"
        openGraph={{
          url: "https://miustationstore.netlify.app/register",
        }}
      />
      <h1 className="text-6xl font-bold mb-10">Register</h1>
      <form ref={zo.ref} className="">
        <fieldset className="container max-w-[247.2px] flex flex-col gap-4  rounded border-2 border-sky-500 my-3 p-3">
          <legend className="px-1 text-sky-600 select-none">
            Register Form
          </legend>
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
            type="password"
            description="minimum 6 characters"
            name={zo.fields.password()}
            className={`px-2 ${zo.errors.password(errorField)}`}
            errorMessage={zo.errors.password((e) => e.message)}
          />
          <Input
            label="Confirm Password"
            type="password"
            name={zo.fields.cf_password()}
            className={`px-2 ${zo.errors.cf_password(errorField)}`}
            errorMessage={zo.errors.cf_password((e) => e.message)}
          />
          <Button isDisabled={disabled} type="submit">
            Signup
          </Button>
        </fieldset>
        {/* <pre className="text-left">
          zo.validation:
          <p>{JSON.stringify(zo.validation, null, 1)}</p>
        </pre> */}
      </form>
      <section className="mb-10">
        <p className="my-2">Have you got an account?</p>
        <Link
          href="/login"
          className="text-rose-500 text-center font-bold underline-offset-4 decoration-2 hover:decoration-dashed hover:underline"
        >
          Login Now
        </Link>
      </section>
    </main>
  );
}
