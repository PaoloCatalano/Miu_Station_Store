import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import Link from "next/link";
import Image from "next/image";
import PleaseSign from "components/PleaseSign";
import GoBack from "components/GoBack";
import Title from "components/Title";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { ACTIONS } from "store/actions";

const Users = () => {
  const { users, auth, addModal } = useCtx();

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;
  return (
    <>
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Users`}
        openGraph={{
          url: "https://miustationstore.netlify.app/users",
        }}
      />
      <Title>All Users</Title>
      <section className="container flex flex-col items-center">
        <div className="mb-10 pl-4 text-slate-500 self-start space-y-1">
          <p>Legend</p>
          <p className="bg-rose-200 px-2">ADMIN ROOT</p>
          <p className="bg-sky-200 px-2">ADMIN</p>
          <p>
            {" "}
            <span className="flex items-center">
              <FaCheck
                aria-label="verified"
                title="verified"
                className="text-xl mr-2 text-green-500"
              />{" "}
              Verified
            </span>
          </p>
          {auth.user.root && (
            <p>
              {" "}
              <span className="flex items-center smallcaps">
                <FaTrashAlt
                  aria-label="delete"
                  title="delete"
                  className="text-lg mr-3 text-red-500 "
                />{" "}
                delete user
              </span>
            </p>
          )}
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
                <td className="p-0 pl-px text-xs md:p-2 md:text-base">
                  {user.email}
                </td>
                <td className="p-2 ">
                  <div className="flex justify-between">
                    {auth.user.root && auth.user.email !== user.email && (
                      <div className="flex items-center">
                        <span
                          className="text-red-500 mr-2 cursor-pointer transition hover:text-red-600"
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
                      </div>
                    )}
                    <span>
                      {user.isVerified && (
                        <FaCheck
                          aria-label="verified"
                          title="verified"
                          className="text-green-500 m-0"
                        />
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-2 cursor-pointer">
                  <Link
                    href={
                      auth.user.root && auth.user.email !== user.email
                        ? `/user/${user._id}`
                        : "#!"
                    }
                    className="underline hover:text-slate-500 transition"
                  >
                    more
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <GoBack />
      </section>
    </>
  );
};

export default Users;
