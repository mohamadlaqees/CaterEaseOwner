import TableComponent from "./TableComponent";
import {
  useDeleteDiscountMutation,
  usePackagesWithDiscountQuery,
} from "../store/apiSlice/apiSlice";
import { Eye, PlusCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddDiscount from "./AddDiscount";
import { format } from "date-fns";
import ConfirmPopUp from "./ConfirmPopUp";
import { useDispatch, useSelector } from "react-redux";
import { openConfirmPopUp } from "../store/menuSlice";
import { toast } from "sonner";

const Discount = ({ isOpened, packageID, closeHandler }) => {
  const dispatch = useDispatch();
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [discountID, setDiscountID] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const { confirmPopUpOpened } = useSelector((state) => state.menu);
  console.log(discountData);
  const {
    data: packagesWithDiscount,
    refetch,
    isFetching,
  } = usePackagesWithDiscountQuery(packageID);
  const [deleteDiscount, { isLoading: deleteDiscountIsLoading }] =
    useDeleteDiscountMutation();

  console.log(packagesWithDiscount);

  const packagesDiscounts = packagesWithDiscount?.filter(
    (pkg) => pkg.package_id === +packageID
  );

  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const handleShowAddDiscount = () => {
    setDiscountData(null);
    setViewOnly(false);
    setIsAddDiscountModalOpen(true);
  };

  const handleCloseAddDisocunt = () => {
    setIsAddDiscountModalOpen(false);
    setDiscountData(null);
  };

  const handleShowDiscount = (discountID) => {
    const filteredDiscount = packagesDiscounts.find((d) => d.id === discountID);
    setDiscountData(filteredDiscount);
    setViewOnly(true);
    setIsAddDiscountModalOpen(true);
  };

  const handleDeleteDiscount = (discountId) => {
    dispatch(openConfirmPopUp(true));
    setDiscountID(discountId);
  };

  const deleteDiscountHandler = async () => {
    try {
      const response = await deleteDiscount(discountID).unwrap();
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
    } catch (error) {
      toast.error(error.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const tableHeader = [
    { name: "Value", key: "value" },
    { name: "Description", key: "description" },
    { name: "Status", key: "is_active" },
    { name: "Starts", key: "start_at" },
    { name: "Ends", key: "end_at" },
    {
      name: "Action",
      key: "action",
      render: (row) => (
        <div className="flex gap-2 items-center justify-center py-2 px-3 rounded-md">
          <Eye
            onClick={() => handleShowDiscount(row.id)}
            className="hover:bg-accent cursor-pointer rounded-md text-(--primaryFont) transition-all p-1"
            size={30}
          />
          <Trash2
            onClick={() => handleDeleteDiscount(row.id)}
            className="hover:bg-accent cursor-pointer rounded-md text-(--primaryFont) transition-all p-1"
            size={30}
          />
        </div>
      ),
    },
  ];

  const tableBody = packagesDiscounts?.map((discount) => {
    // Format dates safely for each discount in the array
    const validStartDate = discount.start_at
      ? format(new Date(discount.start_at), "yyyy-MM-dd")
      : "";
    const validEndDate = discount.end_at
      ? format(new Date(discount.end_at), "yyyy-MM-dd")
      : "";

    return {
      id: discount.id,
      value: `${discount.value}%`, // It's good practice to add the % sign here
      description: discount.description,
      start_at: validStartDate,
      end_at: validEndDate,
      is_active: discount.is_active ? "Active" : "Inactive",
    };
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!isOpened) {
    return null;
  }

  return (
    <>
      {isAddDiscountModalOpen && (
        <AddDiscount
          key={discountData ? discountData.id : "new"}
          isOpened={isAddDiscountModalOpen}
          closeHandler={handleCloseAddDisocunt}
          initialData={discountData}
          viewOnly={viewOnly}
          packageID={+packageID}
        />
      )}
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deleteDiscountIsLoading}
          onConfirm={deleteDiscountHandler}
          onCancel={cancelPopUpHandler}
          content={"Are you sure you want to delete this Discount?"}
        />
      )}

      <div
        className="fixed inset-0 w-full h-full bg-black opacity-30 z-20"
        onClick={closeHandler}
      />
      <div className="fixed bg-white text-sm sm:text-base text-(--primaryFont) p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[40%] h-fit rounded-md z-30">
        <header className="text-sm sm:text-lg flex justify-between font-bold mb-5">
          Discount
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={30}
            onClick={closeHandler}
          />
        </header>
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            size="sm"
            onClick={handleShowAddDiscount}
            className="cursor-pointer"
            disabled={packagesDiscounts?.length > 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <TableComponent
          tableClass={"text-(--primaryFont)"}
          tableBody={tableBody}
          tableHeader={tableHeader}
          isLoading={isFetching}
        />
      </div>
    </>
  );
};

export default Discount;
