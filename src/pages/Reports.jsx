import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { CalendarIcon, EllipsisVertical, Trash2 } from "lucide-react";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptySection from "../components/EmptySection";

import {
  useChangeReportsStatusMutation,
  // useDeleteReportMutation,
  useReportsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/reportSlice";
import ReportsSkeleton from "../components/skeleton/ReportsSkeleton";

const ReportsPage = () => {
  const dispatch = useDispatch();
  // const { confirmPopUpOpened } = useSelector((state) => state.report);
  const [date, setDate] = useState(null);
  // const [reviewID, setReviewID] = useState(null);
  const {
    data: reports,
    isLoading: reportsIsLoading,
    refetch: refetchReports,
  } = useReportsQuery();

  const [changeStatus, { isLoading: changeReportsStatusIsLoading }] =
    useChangeReportsStatusMutation();
  // const [deleteReview, { isLoading: deleteReportIsLoading }] =
  //   useDeleteReportMutation();

  // Data processing
  const reportsInfo = reports?.map((r) => ({
    id: r.id,
    managerId: r.manager_id,
    status: r.status,
    subject: r.subject,
    details: r.details,
    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : "N/A",
  }));

  // Event Handlers
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await changeStatus({ id: complaintId, status: newStatus }).unwrap();
      toast.success("Review status updated successfully!");
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update status.");
    }
  };

  const handleDeleteClick = (id) => {
    setReviewID(id);
    dispatch(openConfirmPopUp(true));
  };

  // const handleDeleteReport = async () => {
  //   try {
  //     await deleteReview(reviewID).unwrap();
  //     toast.success("Review has been deleted successfully.");
  //     dispatch(openConfirmPopUp(false));
  //     refetchReports();
  //   } catch (error) {
  //     toast.error(error?.data?.message || "Failed to delete review.");
  //   }
  // };

  return (
    <>
      <Toaster position="top-center" richColors />
      {/* {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deleteReportIsLoading}
          onConfirm={handleDeleteReport}
          onCancel={() => dispatch(openConfirmPopUp(false))}
          title="Confirm Deletion"
          content="Are you sure you want to delete this review? This action cannot be undone."
        />
      )} */}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        {/* --- Header with Title and Date Filter --- */}
        <header className="flex gap-2 items-start flex-col sm:flex-row sm:items-center justify-between font-bold mb-6">
          <span className="text-lg text-center sm:text-2xl">Reports</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-fit min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
              >
                {date ? format(date, "PPP") : <span>Filter by Date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                className="text-(--primaryFont)"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </header>
        <section className="text-sm sm:text-base border-t-2 border-(--border-color) pt-6">
          {reportsIsLoading ? (
            <ReportsSkeleton />
          ) : !reports || reports.length === 0 ? (
            <div className="py-10">
              <EmptySection
                title="No Reports Found"
                message="There are no reports to display at this time."
              />
            </div>
          ) : (
            reportsInfo.map((report) => (
              <div
                key={report.id}
                className="p-6 mb-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-(--primaryFont)">
                    {report.subject}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(report.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 py-1 px-2 rounded-full capitalize">
                    {report.status}
                  </span>
                  <Select
                    value={report.status}
                    onValueChange={(newStatus) =>
                      handleStatusChange(report.id, newStatus)
                    }
                    disabled={changeReportsStatusIsLoading}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-(--secondaryFont) mb-4">
                  Reported on: {report.date}
                </p>
                <p className="text-(--primaryFont) tracking-wider">
                  {report.details}
                </p>
              </div>
            ))
          )}
        </section>
        {/* Pagination */}
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
      </main>
    </>
  );
};

export default ReportsPage;
