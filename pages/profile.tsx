import { useState, useEffect } from "react";
import type { Order } from "utils/types";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Link from "next/link";
import Image from "next/image";
import { z, ZodSchema } from "zod";
import { useZorm } from "react-zorm";
import { useCtx } from "store/globalState";
import { patchData, postData } from "utils/fetchData";
import { rgbDataURL } from "utils/blurData";
import { imageUpload } from "utils/imageUpload";
import { FiCamera } from "react-icons/fi";
import { FcPaid } from "react-icons/fc";
import { TbTruckDelivery, TbUsers } from "react-icons/tb";
import Button from "components/Button";
import Input from "components/Input";
import Fieldset from "components/Fieldset";
import Banner from "components/Banner";
import {
  nameSchema,
  addressSchema,
  mobileSchema,
  passwordSchema,
} from "validators/valid";
import ShowPassword from "components/ShowPassword";
import SkeletonProfile from "components/SkeletonProfile";
import LogoutBtn from "components/LogoutBtn";

const FormSchema = z.object({
  name: z.optional(nameSchema),
  address: addressSchema,
  mobile: mobileSchema,
});

const FormPassSchema = z
  .object({
    oldPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match.",
    path: ["confirmPassword"],
  });

const Profile = () => {
  const router = useRouter();
  const { auth, authUser, notify, orders } = useCtx();
  const [data, setData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const updatePassword = (password: string, oldPassword: string) => {
    notify({ loading: true });

    postData(
      "auth/comparePassword",
      { email: auth.user.email, password: oldPassword },
      auth.token
    ).then((res) => {
      if (res.err) return notify({ error: res.err });

      patchData("user/resetPassword", { password }, auth.token).then((res) => {
        if (res.err) return notify({ error: res.err });
        return notify({ success: res.msg });
      });
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

  const updateInfo = async ({
    name,
    address,
    mobile,
  }: {
    name?: string;
    address?: string;
    mobile?: string;
  }) => {
    let media: any;
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
      updatePassword(e.data.password, e.data.oldPassword);
    },
  });

  const disabled = zo.validation?.success === false;

  const disabledPass = zoPass.validation?.success === false;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!auth.user) {
        return router.push("/login");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [auth]);

  if (!auth.user) return <SkeletonProfile />;

  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | ${auth?.user.name} Profile`}
        canonical="https://miustationstore.netlify.app/profile"
        description="My profile page for Miu Station Store"
        openGraph={{
          url: "https://miustationstore.netlify.app/profile",
          description: "My profile page for Miu Station Store",
          title: `${process.env.WEBSITE_NAME} | ${auth?.user.name} Profile`,
        }}
      />
      {!auth.user.isVerified && (
        <Banner role="alert" text="Check your email to verify account" />
      )}
      <section className="my-3 md:w-full md:max-w-xl flex flex-col justify-center">
        <article>
          <div className="text-center uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </div>

          <div className="group relative w-[150px] h-[150px] overflow-hidden my-4 mx-auto ring-2 ring-offset-2 ring-blue-300 rounded-full hover:ring-blue-400 transition">
            <Image
              className="w-full h-full block object-cover"
              src={data ? URL.createObjectURL(data) : auth.user.avatar}
              alt="avatar"
              fill
              placeholder="blur"
              blurDataURL={rgbDataURL()}
              sizes="20wv"
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
        </article>
        <article className="flex flex-col justify-between items-center  md:flex-row ">
          {/* FORM info */}
          <form ref={zo.ref}>
            <Fieldset legend="Your Details">
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
                // name={zo.fields.email()}
                // errorMessage={zo.errors.email((e) => e.message)}
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
            </Fieldset>
          </form>

          {/* FORM password */}
          <form ref={zoPass.ref}>
            <Fieldset legend="Update your Password">
              <Input
                label="Old Password"
                type={showPassword ? "text" : "password"}
                description="minimum 6 characters"
                name={zoPass.fields.oldPassword()}
                errorMessage={zoPass.errors.oldPassword((e) => e.message)}
              />
              <Input
                label="New Password"
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
        </article>

        {orders?.length > 0 && (
          <article className="mt-10">
            <div className="uppercase">Orders</div>
            <div className="my-8 pl-4 text-slate-500">
              <p>
                <span className="flex items-center">
                  <FcPaid
                    aria-label="paid"
                    title="paid"
                    className="text-xl mr-2 "
                  />{" "}
                  Paid
                </span>
              </p>
              <p>
                <span className="flex items-center">
                  <TbTruckDelivery
                    aria-label="delivered"
                    title="delivered"
                    className="text-xl mr-2"
                  />{" "}
                  Delivered
                </span>
              </p>
              {auth.user.role === "admin" && (
                <p className="text-rose-600 text-left">Email not verified</p>
              )}
            </div>
            <div className="my-3">
              <table className="text-sm mx-auto">
                <thead className="bg-slate-300">
                  <tr>
                    {auth.user.role === "admin" && (
                      <th className="p-2 hidden md:table-cell">user email</th>
                    )}
                    <th className="p-2">date</th>
                    <th className="p-2">total</th>
                    <th className="p-2">status</th>
                    <th className="p-2">info</th>
                  </tr>
                </thead>

                <tbody className="text-slate-700 ">
                  {orders.map((order: Order) => (
                    <tr
                      key={order._id}
                      className="[&:nth-child(even)]:bg-slate-200"
                    >
                      {auth.user.role === "admin" && (
                        <td className="p-2 hidden md:table-cell ">
                          {order?.user?._id ? (
                            <Link href={`/user/${order.user._id}`}>
                              <div
                                className={`lowercase underline hover:text-slate-800 transition ${
                                  order.user.isVerified ? "" : "text-rose-600"
                                }`}
                              >
                                {order.user.email}
                              </div>
                            </Link>
                          ) : (
                            <div className="text-red-800">USER DELETED</div>
                          )}
                        </td>
                      )}

                      <td className="p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">${order.total}</td>

                      <td className="p-2 flex justify-evenly ">
                        <span>
                          {order.paid && (
                            <FcPaid aria-label="paid" title="paid" />
                          )}
                        </span>
                        <span>
                          {order.delivered && (
                            <TbTruckDelivery
                              aria-label="delivered"
                              title="delivered"
                            />
                          )}
                        </span>
                      </td>
                      <td className="p-2 cursor-pointer">
                        <Link
                          href={`/order/${order._id}`}
                          className="underline hover:text-slate-800 transition "
                        >
                          more
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}
      </section>
      {auth.user.role === "admin" && (
        <section className="my-10">
          <Link href="/users" className="w-100 flex hover:underline">
            <TbUsers className="text-xl text-slate-600 mr-2" /> View all Users
          </Link>
        </section>
      )}
      <section className="w-full flex justify-end">
        <LogoutBtn />
      </section>
    </>
  );
};

export default Profile;
