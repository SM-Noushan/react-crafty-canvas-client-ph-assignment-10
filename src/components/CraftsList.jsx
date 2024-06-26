import { Link } from "react-router-dom";
import { FaEye, FaPenClip, FaRegStar, FaTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import "animate.css";
import client from "../utils/axios";

const swalWithCustomButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-error text-white",
    cancelButton: "btn btn-info text-white ml-4",
  },
  buttonsStyling: false,
});

const CraftsList = ({ crafts, myCrafts = false, refetch }) => {
  const handleDelete = (id) => {
    swalWithCustomButtons
      .fire({
        title: "Are you sure?",
        text: "Are you sure that you want to delete it?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
        },
      })
      .then((result) => {
        if (result.isConfirmed)
          client("delete", `/painting-and-drawing/${id}`).then((res) => {
            if (res?.data?.deletedCount) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Craft and Art deleted",
                icon: "success",
              });
            } else
              Swal.fire({
                title: "Failed!",
                text: "Something went wrong",
                icon: "error",
              });
          });
      });
  };
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>SL</th>
            <th>Craft & Art</th>
            <th>{myCrafts ? "Name" : "Uploaded By"}</th>
            {myCrafts ? (
              <>
                <th>Customization</th>
                <th>Stock Status</th>
                <th>Rating</th>
                <th>Price</th>
              </>
            ) : (
              <>
                <th className="hidden min-[425px]:table-cell">Category</th>
                <th className="hidden md:table-cell">Description</th>
              </>
            )}
            <th>{myCrafts ? "Action" : "View Details"} </th>
          </tr>
        </thead>
        <tbody>
          {crafts.map((item, idx) => (
            <tr key={item._id} className="hover">
              <th>{idx + 1}</th>
              <td>
                <div className="flex flex-col gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle size-16">
                      <img
                        src={
                          item.imageURL ||
                          "https://images.unsplash.com/photo-1488274319148-051ed60a9404?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt="art-and-craft-avatar"
                      />
                    </div>
                  </div>
                  {!myCrafts && (
                    <div>
                      <div className="font-bold capitalize">
                        {item.itemName || "Unknown"}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="capitalize">
                {myCrafts
                  ? item.itemName || "Unknown"
                  : item.userName || "Unknown"}
              </td>
              {myCrafts ? (
                <>
                  <td className="capitalize">
                    {item.itemCustomization || "-"}
                  </td>
                  <td className="capitalize">{item.itemStock || "-"}</td>
                  <td className="capitalize">
                    <div className="flex items-center gap-2">
                      {item.itemRating || "0"}
                      <FaRegStar />
                    </div>
                  </td>
                  <td className="capitalize">BDT {item.itemPrice || "0"}</td>
                </>
              ) : (
                <>
                  <td className="capitalize hidden min-[425px]:table-cell">
                    {item.subCategoryName || "Others"}
                  </td>
                  <td className="hidden md:table-cell max-w-md xl:max-w-lg text-justify">
                    {item.shortDescription}
                  </td>
                </>
              )}
              <th>
                <div className="flex items-center gap-2">
                  {!myCrafts ? (
                    <Link
                      to={`/item/${item._id}`}
                      className="btn btn-square  btn-outline btn-accent"
                    >
                      <FaEye />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={`/item/${item._id}/edit`}
                        className="btn btn-square  btn-outline btn-info"
                      >
                        <FaPenClip />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        to={`/item/${item._id}`}
                        className="btn btn-square  btn-outline btn-error"
                      >
                        <FaTrashCan />
                      </button>
                    </>
                  )}
                </div>
              </th>
            </tr>
          ))}
        </tbody>
        {/* foot */}
      </table>
    </div>
  );
};

CraftsList.propTypes = {
  crafts: PropTypes.array.isRequired,
  myCrafts: PropTypes.bool,
  refetch: PropTypes.func,
};

export default CraftsList;
