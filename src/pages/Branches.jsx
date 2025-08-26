import { Link } from "react-router"; // Correct import for react-router-dom
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptySection from "../components/EmptySection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { PlusCircle, Pencil, Trash2 } from "lucide-react"; // Import Pencil icon
import {
  useBranchesQuery,
  useDeleteBranchMutation,
} from "../store/apiSlice/apiSlice";
import BranchCardGridSkeleton from "../components/skeleton/BranchesSkeleton";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { useDispatch, useSelector } from "react-redux";
import { openConfirmPopUp } from "../store/menuSlice";
import { useState } from "react";
import { toast, Toaster } from "sonner";

const Branches = () => {
  const dispatch = useDispatch();
  const { data: branchesResponse, isLoading: branchesIsLoading } =
    useBranchesQuery();
  const [deleteBranch, { isLoading: deleteBranchIsLoading }] =
    useDeleteBranchMutation();
  const [theBranchID, setTheBranchID] = useState(null);

  const { confirmPopUpOpened } = useSelector((state) => state.menu);

  const deleteHandler = (branchID) => {
    dispatch(openConfirmPopUp(true));
    setTheBranchID(branchID);
  };
  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const deleteTheBranch = async () => {
    try {
      const response = await deleteBranch(theBranchID);
      dispatch(openConfirmPopUp(false));
      toast.success(response.data.message, {
        style: {
          background: "white",
          color: "#314E76",
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

  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="p-4 sm:p-6 md:p-10">
        <>
          {confirmPopUpOpened && (
            <ConfirmPopUp
              loading={deleteBranchIsLoading}
              onConfirm={deleteTheBranch}
              onCancel={cancelPopUpHandler}
              content={"Are you sure you want to delete this Branch?"}
            />
          )}{" "}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-(--primaryFont)">
              Branches
            </h1>
            <Button asChild>
              <Link to="/branches/add-branch">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Branch
              </Link>
            </Button>
          </header>
          {/* Corrected conditional rendering order */}
          {branchesIsLoading ? (
            <BranchCardGridSkeleton count={8} />
          ) : !branchesResponse || branchesResponse.branches.length === 0 ? (
            <EmptySection
              title="No Branches Found"
              message="You can start by adding a new branch."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {branchesResponse.branches.map((branch) => (
                <Card
                  key={branch.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <CardHeader className="p-0">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-40 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-bold text-(--primaryFont )">
                      {branch.name}
                    </h3>
                    <p className="text-sm text-(--secondaryFont) mt-1">
                      Owner: {branch.ownerName}
                    </p>
                    <p className="text-sm text-(--secondaryFont) mt-2">
                      {branch.city}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 border-t flex flex-col gap-2">
                    {/* Primary Action */}
                    <Button asChild className="w-full">
                      <Link to={`/branches/${branch.id}`}>View Details</Link>
                    </Button>
                    {/* Secondary Action with distinct style and route */}
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/branches/edit/${branch.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Branch
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-transparent cursor-pointer"
                      onClick={() => deleteHandler(branch.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Branch
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <Pagination className="mt-10 text-(--secondaryFont) ">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="hover:bg-primary hover:text-white "
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="hover:bg-primary hover:text-white "
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="hover:bg-primary hover:text-white "
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="hover:bg-primary hover:text-white "
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className="hover:bg-primary hover:text-white "
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      </main>
    </>
  );
};

export default Branches;
