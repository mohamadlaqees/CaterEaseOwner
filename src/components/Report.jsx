// src/components/Report.js

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A small helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-(--secondaryFont)">{label}</p>
    <p className="text-base font-semibold text-(--primaryFont)">
      {value || "N/A"}
    </p>
  </div>
);

const Report = ({
  report,
  closeHandler,
  onStatusChange,
  onDelete,
  statusChangeLoading,
}) => {
  if (!report) return null;

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40 z-30"
        onClick={closeHandler}
      />
      <div className="fixed mt-10 bg-white text-sm sm:text-base text-(--primaryFont) p-6 sm:p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[50%] max-w-2xl h-fit max-h-[90vh] overflow-y-auto rounded-lg shadow-xl z-40">
        <header className="text-lg sm:text-xl flex justify-between items-center font-bold mb-6 pb-4 border-b">
          <span>Report Details</span>
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={26}
            onClick={closeHandler}
          />
        </header>

        <div className="space-y-6">
          {/* --- Main Report Details --- */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-(--primary)">
              {report.subject}
            </h2>
            <p className="text-(--primaryFont) leading-relaxed">
              {report.details}
            </p>
            <div className="flex items-center justify-between text-xs pt-2 text-(--secondaryFont)">
              <span>Reported on: {report.date}</span>
              <span className="font-medium bg-gray-200 py-1 px-3 rounded-full capitalize text-(--primaryFont)">
                Status: {report.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* --- Branch Information --- */}
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="font-bold text-lg mb-3 text-(--primaryFont)">
              Branch Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                label="Branch Name"
                value={report.branch?.description}
              />
              <InfoItem
                label="Location Note"
                value={report.branch?.location_note}
              />
              <InfoItem label="Manager" value={report.branch?.manager?.name} />
              <InfoItem label="City" value={report.branch?.city?.name} />
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium text-(--primaryFont)">
                Change Status
              </label>
              <Select
                value={report.status}
                onValueChange={(newStatus) =>
                  onStatusChange(report.id, newStatus)
                }
                disabled={statusChangeLoading}
              >
                <SelectTrigger className="w-full sm:w-[180px] mt-1 text-(--secondaryFont)">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent className="text-(--secondaryFont)">
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="destructive"
              onClick={() => onDelete(report.id)}
              className="w-full sm:w-auto self-end hover:brightness-105 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2 " />
              Delete Report
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
