import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useCtx } from "store/globalState";
import { ACTIONS } from "store/actions";
import Input from "components/Input";
import CheckBox from "components/CheckBox";
import Button from "components/Button";
import GoBack from "components/GoBack";
import { patchData } from "utils/fetchData";
import PleaseSign from "components/PleaseSign";
import NoProduct from "components/NoProduct";
import Loading from "components/Loading";

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;

  const { auth, users, notify, updateItem } = useCtx();

  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  const [checkLoad, setCheckLoad] = useState(true);

  useEffect(() => {
    setCheckLoad(false);

    users.forEach((user) => {
      if (user._id === id) {
        setEditUser(user);
        setCheckAdmin(user.role === "admin" ? true : false);
        setCheckLoad(true);
      }
    });
  }, [users]);

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  const handleSubmit = () => {
    let role = checkAdmin ? "admin" : "user";

    if (num % 2 !== 0) {
      notify({ loading: true });
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.err) return notify({ error: res.err });

        updateItem(
          users,
          editUser._id,
          {
            ...editUser,
            role,
          },
          ACTIONS.ADD_USERS
        );

        return notify({ success: res.msg });
      });
    } else {
      notify({ info: "Nothing to change." });
    }
  };

  if (!auth.user || auth.user.role !== "admin") return <PleaseSign />;

  if (editUser.length === 0) return <NoProduct />;

  if (!checkLoad) return <Loading />;

  return (
    <div className="edit_user my-3">
      <NextSeo title={`${process.env.WEBSITE_NAME} | Edit User`} />

      <div className="col-md-4 mx-auto my-4">
        <h2 className="text-uppercase text-secondary">Edit User</h2>

        <div className="form-group">
          <Input
            type="text"
            label="Name"
            defaultValue={editUser.name}
            isDisabled
          />
        </div>

        <div className="form-group">
          <Input
            type="text"
            label="Email"
            defaultValue={editUser.email}
            isDisabled
            isReadOnly
          />
        </div>

        <div className="form-group">
          <Input
            type="text"
            label="ID"
            defaultValue={editUser._id}
            isReadOnly
          />
        </div>

        <div className="form-group">
          <CheckBox
            isSelected={editUser.isVerified}
            isDisabled
            className={editUser.isVerified ? "text-success" : "text-danger"}
          >
            Verified
          </CheckBox>
        </div>

        <div className="form-group">
          <CheckBox
            isSelected={checkAdmin}
            style={{ width: "20px", height: "20px" }}
            onChange={handleCheck}
          >
            Admin
          </CheckBox>
        </div>

        <Button className="btn btn-dark" onClick={handleSubmit}>
          Update
        </Button>
      </div>

      <GoBack />
    </div>
  );
};

export default EditUser;
