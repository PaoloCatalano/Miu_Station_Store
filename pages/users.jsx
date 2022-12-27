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
    <div className="table-responsive">
      <NextSeo
        title={`${process.env.WEBSITE_NAME} | Users`}
        openGraph={{
          url: "https://miu-shop.vercel.app/users",
        }}
      />

      <legend className="mt-5">
        <div className="_alert bg-rose-200 _legend">ADMIN ROOT</div>
        <div className="_alert bg-sky-200 _legend">ADMIN</div>
      </legend>

      <table className="table w-100">
        <thead>
          <tr>
            <th></th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Verified</th>
            <th>Action</th>
            <th>ID</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              style={
                user.root && user.role === "admin"
                  ? { background: "pink" }
                  : user.role === "admin"
                  ? { background: "lightblue" }
                  : null
              }
            >
              <th>{index + 1}</th>

              <th>
                <Image
                  src={user.avatar}
                  alt={user.avatar}
                  //   layout="fixed"
                  width={30}
                  height={30}
                  className="overflow-hidden rounded-circle _border-icon-gray"
                />
              </th>
              <th>{user.name}</th>
              <th>{user.email}</th>
              <th>
                {user.isVerified ? (
                  <FaCheck className="text-sky-500" />
                ) : (
                  <FaTimes className="text-red-500" />
                )}
              </th>
              <th>
                <div className="d-flex justify-content-between">
                  <Link
                    href={
                      auth.user.root && auth.user.email !== user.email
                        ? `/user/${user._id}`
                        : "#!"
                    }
                  >
                    <FaEdit className="text-info mr-2" title="Edit" />
                  </Link>

                  {auth.user.root && auth.user.email !== user.email ? (
                    <span
                      style={{ cursor: "pointer" }}
                      className="text-danger ml-2"
                      title="Remove"
                      data-toggle="modal"
                      data-target="#exampleModal"
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
                      <FaTrashAlt />
                    </span>
                  ) : (
                    <span>
                      <FaTrashAlt
                        className="text-success ml-2"
                        title="Can't Remove"
                        style={{ cursor: "not-allowed" }}
                      />
                    </span>
                  )}
                </div>
              </th>
              <th className="text-sm">{user._id}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
