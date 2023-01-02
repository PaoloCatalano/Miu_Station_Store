import { useState } from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { z, ZodSchema } from "zod";
import { useZorm } from "react-zorm";
import { useCtx } from "store/globalState";
import { patchData } from "utils/fetchData";
import { rgbDataURL } from "utils/blurData";
import { imageUpload } from "utils/imageUpload";
import { FiCamera } from "react-icons/fi";
import { FaTimes, FaCheck } from "react-icons/fa";
import Button from "components/Button";
import Input from "components/Input";
import {
  nameSchema,
  addressSchema,
  mobileSchema,
  confirmPasswordSchema,
} from "validators/valid";
import LogoutBtn from "../components/LogoutBtn";

/**@TODO reset password functionality */

const FormSchema = z.object({
  name: z.optional(nameSchema),
  address: addressSchema,
  mobile: mobileSchema,
});

const FormPassSchema = confirmPasswordSchema;

const Profile = () => {
  const { auth, authUser, notify, orders } = useCtx();
  const [data, setData] = useState(null);

  const handleChange = (e) => {
    notify({});
  };

  const updatePassword = (password) => {
    notify({ loading: true });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err) return notify({ error: res.err });
      return notify({ success: res.msg });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return notify({ error: "File does not exist." });

    if (file.size > 1024 * 1024)
      //1mb
      return notify({ error: "The largest image size is 1mb." });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //1mb
      return notify({ error: "Image format is incorrect." });

    notify({ info: "Don't forget to UPDATE your profile!" });

    setData(file);
  };

  const updateInfo = async ({ name, address, mobile }) => {
    let media;
    notify({ loading: true });

    if (data) media = await imageUpload([data]);

    patchData(
      "user",
      {
        name,
        address,
        mobile,
        avatar: data ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err) return notify({ error: res.err });

      authUser({
        token: auth.token,
        user: res.user,
      });
      return notify({ success: res.msg });
    });
  };

  if (
    FormSchema instanceof ZodSchema === false &&
    FormPassSchema instanceof ZodSchema === false
  ) {
    throw Error("useZorm must have a ZodSchema as second argument");
  }

  const zo = useZorm("updateInfo", FormSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      updateInfo(e.data);
    },
  });

  const zoPass = useZorm("updatePassword", FormPassSchema, {
    onValidSubmit(e) {
      e.preventDefault();
      updatePassword(e.data.password);
    },
  });

  const disabled = zo.validation?.success === false;

  const disabledPass = zoPass.validation?.success === false;

  const errorField = `border-2 border-red-500`;

  if (!auth.user) return <>login again</>;

  return (
    <div className="main">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | ${auth?.user.name} Profile`}
      />
      {!auth.user.isVerified && (
        <div className="p-2 bg-red-400 rounded" role="alert">
          <div className="text-center">
            <h4>Check your email to verify account</h4>
          </div>
        </div>
      )}
      <section className="my-3">
        <div className="col-md-4">
          <h3 className="text-center uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h3>

          <div className="group relative w-[150px] h-[150px] overflow-hidden my-4 mx-auto ring-2 ring-offset-2 ring-sky-400 rounded-full">
            <Image
              className="w-full h-full block object-cover"
              src={data ? URL.createObjectURL(data) : auth.user.avatar}
              alt="avatar"
              fill
              placeholder="blur"
              blurDataURL={rgbDataURL()}
            />

            <span className="absolute flex flex-col items-center justify-start translate-y-40 left-0 pt-3 w-full h-2/4 bg-slate-500/70 text-center text-rose-300 font-bold transition group-hover:translate-y-20">
              <FiCamera />
              <p>UPLOAD</p>
              <input
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                name="file"
                id="file_up"
                accept="image/*"
                onChange={changeAvatar}
              />
            </span>
          </div>
          {/* FORM info */}
          <form ref={zo.ref} className="">
            <fieldset className="container max-w-[247.2px] flex flex-col gap-4  rounded border-2 border-sky-500 my-3 p-3">
              <legend className="px-1 text-sky-600 select-none">
                Update Information
              </legend>
              <Input
                maxLength={20}
                label="Name"
                type="text"
                name={zo.fields.name()}
                errorMessage={zo.errors.name((e) => e.message)}
                defaultValue={auth.user.name}
              />
              <Input
                label="Email"
                type="email"
                name={zo.fields.email()}
                errorMessage={zo.errors.email((e) => e.message)}
                defaultValue={auth.user.email}
                isReadyOnly
                isDisabled
              />
              <Input
                label="Address"
                type="text"
                name={zo.fields.address()}
                errorMessage={zo.errors.address((e) => e.message)}
                defaultValue={auth.user.address}
              />
              <Input
                label="Mobile"
                type="text"
                name={zo.fields.mobile()}
                errorMessage={zo.errors.mobile((e) => e.message)}
                defaultValue={auth.user.mobile}
              />

              <Button isDisabled={disabled} type="submit">
                Update Info
              </Button>
            </fieldset>
            {/* <pre className="text-left">
              zo.validation:
              <p>{JSON.stringify(zo.validation, null, 1)}</p>
            </pre> */}
          </form>
        </div>
        <div>
          {/* FORM info */}
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

        <div className="col-md-8 mt-5">
          <h3 className="uppercase">Orders</h3>

          <div className="my-3 ">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: "600px" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  {auth.user.root && <td className="p-2">user email</td>}
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>

              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <Link href={`/order/${order._id}`}>
                      <td className="p-2" style={{ cursor: "pointer" }}>
                        {order._id.slice(0, 9)}...
                      </td>
                    </Link>
                    {auth.user.root && (
                      <td className="p-2">
                        {order?.user?._id ? (
                          <Link href={`/edit_user/${order.user._id}`}>
                            <div
                              className={`text-lowercase ${
                                order.user.isVerified ? "" : "text-danger"
                              }`}
                            >
                              {order.user.email}
                            </div>
                          </Link>
                        ) : (
                          <div className="text-danger">USER DELETED</div>
                        )}
                      </td>
                    )}
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered ? (
                        <FaCheck className="text-success"></FaCheck>
                      ) : (
                        <FaTimes className="text-danger"></FaTimes>
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <FaCheck className="text-success"></FaCheck>
                      ) : (
                        <FaTimes className="text-danger"></FaTimes>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="w-full m-10 flex justify-center">
        <LogoutBtn />
      </section>
    </div>
  );
};

export default Profile;
