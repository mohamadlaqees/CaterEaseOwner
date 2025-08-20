import { BookOpen, ChevronRight } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import {
  useDeletePackageMutation,
  usePackagesQuery,
} from "../store/apiSlice/apiSlice";
import CategoryCard from "../components/CategoryCard";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptyState from "../components/EmptyState";
import { PackageGridSkeleton } from "../components/skeleton/PackageCardSkeleton";
import { openConfirmPopUp } from "../store/menuSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Discount from "../components/Discount";

const Category = () => {
  const { branchID, category, categoryID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [thePackageID, setThePackageID] = useState(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const { confirmPopUpOpened } = useSelector((state) => state.menu);

  const { data: packagesResponse, isLoading: packagesIsLoading } =
    usePackagesQuery(categoryID);

  const [deletePackage, { isLoading: deletePackageIsLoading }] =
    useDeletePackageMutation();

  const items = packagesResponse?.packages
    ?.filter((pkg) => String(pkg.branch_id) === String(branchID))
    .map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      photo: pkg.photo,
      description: pkg.description,
      price: pkg.base_price,
    }));

  const showHandler = (itemID) => {
    navigate(`${itemID}`);
  };
  const deleteHandler = async () => {
    try {
      const response = await deletePackage(thePackageID);
      dispatch(openConfirmPopUp(false));
      console.log(response);
      toast.success(response.data.message, {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.data.error, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const openPopUpHandler = (packageID) => {
    dispatch(openConfirmPopUp(true));
    setThePackageID(packageID);
  };

  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const closeDiscountHandler = () => {
    setIsDiscountModalOpen(false);
  };

  const openDiscountHandler = (packageID) => {
    setThePackageID(packageID);
    setIsDiscountModalOpen(true);
  };

  const renderContent = () => {
    if (packagesIsLoading) {
      return <PackageGridSkeleton />;
    }

    if (!items || items.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title={`No Packages in ${category}`}
          description={`This branch doesn't have any packages in this category yet.`}
        />
      );
    }

    return (
      <>
        <div className="grid justify-center sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              discountHandler={() => openDiscountHandler(item.id)}
              showHandler={() => showHandler(item.id)}
              deleteHandler={() => openPopUpHandler(item.id)}
            />
          ))}
        </div>
        {/* You can add real pagination logic here if needed */}
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    );
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deletePackageIsLoading}
          onConfirm={deleteHandler}
          onCancel={cancelPopUpHandler}
          content={"Are you sure you want to delete this package?"}
        />
      )}
      <Discount
        isOpened={isDiscountModalOpen}
        packageID={thePackageID}
        closeHandler={closeDiscountHandler}
      />
      <main className="text-(--primaryFont) p-4 sm:p-6 md:p-10">
        <header className="flex justify-between items-center font-bold mb-6">
          <span className="text-xl sm:text-2xl capitalize">
            {category.replace(/-/g, " ")}
          </span>
          <div className="flex items-center gap-2 font-medium">
            <NavLink
              to="/menu"
              className="hover:text-(--primary) transition-all"
              end
            >
              Menu
            </NavLink>
            <ChevronRight size={20} />
            <span className="text-(--primary) capitalize">
              {category.replace(/-/g, " ")}
            </span>
          </div>
        </header>
        {renderContent()}
      </main>
    </>
  );
};

export default Category;
