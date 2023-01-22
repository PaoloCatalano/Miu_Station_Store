import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import Link from "next/link";
import Image from "next/image";
import PleaseSign from "components/PleaseSign";
import { FaTimes, FaCheck, FaEdit, FaTrashAlt } from "react-icons/fa";
import { ACTIONS } from "store/actions";

const Users = () => {
  const { users, auth, addModal } = useCtx();

  /**@TODO change vercel*/

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Users`}
        openGraph={{
          url: "https://miu-shop.vercel.app/users",
        }}
      />
      <h1>All Users</h1>
      <div className="my-8 pl-4 text-slate-500 self-start">
        <p className="bg-rose-200 px-2">ADMIN ROOT</p>
        <p className="bg-sky-200 px-2">ADMIN</p>
        <p>
          {" "}
          <span className="flex items-center">
            <FaCheck
              aria-label="paid"
              title="paid"
              className="text-xl mr-2 text-green-500"
            />{" "}
            Verified
          </span>
        </p>
      </div>

      <table className="table w-100">
        <thead>
          <tr>
            <th className="hidden md:table-cell"></th>
            <th className="hidden md:table-cell">Img</th>
            <th className="hidden md:table-cell">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Info</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              className={
                user.root && user.role === "admin"
                  ? "bg-rose-200"
                  : user.role === "admin"
                  ? "bg-sky-200"
                  : "bg-transparent"
              }
            >
              <td className="p-2 hidden md:table-cell">{index + 1}</td>

              <td className="p-2 hidden md:table-cell">
                <Image
                  src={user.avatar}
                  alt={user.avatar}
                  //   layout="fixed"
                  width={30}
                  height={30}
                  className="overflow-hidden rounded-full shadow"
                />
              </td>
              <td className="p-0 hidden md:table-cell">{user.name}</td>
              <td className="p-0 text-xs md:p-2 md:text-base">{user.email}</td>
              <td className="p-2 ">
                <div className="flex justify-between">
                  <span>
                    {user.isVerified && (
                      <FaCheck
                        aria-label="verified"
                        title="verified"
                        className="text-green-500 m-0"
                      />
                    )}
                  </span>
                  <div className="flex items-center">
                    {auth.user.root && auth.user.email !== user.email && (
                      <span
                        className="text-red-500 ml-2 cursor-pointer"
                        onClick={() =>
                          addModal([
                            {
                              data: users,
                              id: user._id,
                              title: user.name,
                              type: ACTIONS.ADD_USER, //deleteUser()
                            },
                          ])
                        }
                      >
                        <FaTrashAlt aria-label="delete" title="delete" />
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-2 cursor-pointer">
                <Link
                  href={
                    auth.user.root && auth.user.email !== user.email
                      ? `/user/${user._id}`
                      : "#!"
                  }
                  className="underline"
                >
                  more
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
