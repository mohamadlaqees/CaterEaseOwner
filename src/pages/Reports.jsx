// src/pages/ReportsPage.js

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { CalendarIcon } from "lucide-react";

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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptySection from "../components/EmptySection";

import {
  useChangeReportsStatusMutation,
  useDeleteReportMutation,
  useFilterReportByDateQuery,
  useReportsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/reportSlice";
import ReportsSkeleton from "../components/skeleton/ReportsSkeleton";
import Report from "../components/Report";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.report);
  const [date, setDate] = useState(undefined);

  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const {
    data: reports,
    isLoading: reportsIsLoading,
    refetch: refetchReports,
  } = useReportsQuery();
  const { data: filteredReports, isLoading: filteredReportsIsLoading } =
    useFilterReportByDateQuery(formattedDate, { skip: !date });

  const [changeStatus, { isLoading: changeReportsStatusIsLoading }] =
    useChangeReportsStatusMutation();
  const [deleteReview, { isLoading: deleteReportIsLoading }] =
    useDeleteReportMutation();

  const reportLoading = date ? filteredReportsIsLoading : reportsIsLoading;
  const dataToDisplay = date ? filteredReports : reports;

  const reportsInfo = dataToDisplay?.map((r) => ({
    id: r.id,
    managerId: r.manager_id,
    status: r.status,
    subject: r.subject,
    details: r.details,
    date: r.created_at ? format(r.created_at, "yyyy-MM-dd") : "N/A",
    branch: r.branch,
  }));

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await changeStatus({ reportID: reportId, status: newStatus }).unwrap();
      toast.success("Report status changed successfully", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      setSelectedReport(null);
      refetchReports();
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    dispatch(openConfirmPopUp(true));
  };

  const handleDeleteReport = async () => {
    try {
      await deleteReview(deleteId).unwrap();
      toast.success("Report has been deleted successfully.", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
      if (selectedReport?.id === deleteId) {
        setSelectedReport(null);
      }
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete review.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      dispatch(openConfirmPopUp(false));
      setSelectedReport(null);
    };
  }, []);
  return (
    <>
      <Toaster position="top-center" richColors />

      {selectedReport && (
        <Report
          report={selectedReport}
          closeHandler={() => setSelectedReport(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteClick}
          statusChangeLoading={changeReportsStatusIsLoading}
        />
      )}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        {confirmPopUpOpened && (
          <ConfirmPopUp
            loading={deleteReportIsLoading}
            onConfirm={handleDeleteReport}
            onCancel={() => dispatch(openConfirmPopUp(false))}
            title="Confirm Deletion"
            content="Are you sure you want to delete this report? This action cannot be undone."
          />
        )}
        <header className="flex gap-2 items-start flex-col sm:flex-row sm:items-center justify-between font-bold mb-6">
          <span className="text-lg text-center sm:text-2xl text-(--primaryFont)">
            Reports
          </span>
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

        <section className="text-sm sm:text-base border-t-2 border-gray-200 pt-6">
          {reportLoading ? (
            <ReportsSkeleton />
          ) : !reportsInfo || reportsInfo.length === 0 ? (
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
                className="p-6 mb-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-(--primaryFont)">
                    {report.subject}
                  </h2>
                  <span className="text-xs font-medium text-(--secondaryFont) bg-gray-200 py-1 px-2 rounded-full capitalize">
                    {report.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-(--secondaryFont) mt-2">
                  Reported on: {report.date}
                </p>
              </div>
            ))
          )}
        </section>

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
