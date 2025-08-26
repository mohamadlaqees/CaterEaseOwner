// src/components/EditableTable.js

// --- 1. IMPORT useState ---
import { useState } from "react";
import {
  Loader2,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptySection from "./EmptySection";

const ITEMS_PER_PAGE = 5;

const EditableTable = ({
  inputClass,
  btnClass,
  control,
  name,
  title,
  columns,
  newRowObject,
  extraData,
  loading,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  const canAddMore =
    name === "working_hours" ? fields.length < 7 : name !== "delivery_regions";

  // --- 2. ADD STATE FOR PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);

  // --- 3. CALCULATE PAGINATION LOGIC ---
  const isPaginated = name === "delivery_regions";
  const pageCount = isPaginated ? Math.ceil(fields.length / ITEMS_PER_PAGE) : 1;

  // Determine which slice of the array to render
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFields = isPaginated
    ? fields.slice(startIndex, endIndex)
    : fields;

  const handleAddRow = () => {
    if (name === "working_hours") {
      const nextDayIndex = fields.length;
      const nextDay = extraData[nextDayIndex];
      append({ day: nextDay, open_time: "", close_time: "" });
    } else {
      append(newRowObject);
    }
  };

  // The Card itself has no height constraints.
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-lg text-(--primaryFont)">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {fields.length === 0 && name === "delivery_regions" && (
              <EmptySection
                title="No Delivery Regions"
                message="You can select delivery regions above."
              />
            )}

            {/* --- 4. MAP OVER THE PAGINATED DATA --- */}
            {paginatedFields.map((field, index) => {
              const originalIndex = startIndex + index;
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {columns.map((col) => (
                      <FormField
                        key={col.key}
                        control={control}
                        name={`${name}.${originalIndex}.${col.key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-(--primaryFont) font-medium">
                              {col.header}
                            </FormLabel>
                            <FormControl>
                              <Input
                                readOnly={
                                  (name === "working_hours" &&
                                    col.key === "day") ||
                                  (name === "delivery_regions" &&
                                    col.key === "governorate_id") ||
                                  (name === "delivery_regions" &&
                                    col.key === "city_id")
                                }
                                type={col.type}
                                {...field}
                                placeholder={col.header}
                                className={inputClass}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(originalIndex)}
                    className="w-10 h-10 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Remove Row</span>
                  </Button>
                </div>
              );
            })}

            {canAddMore && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddRow}
                className={btnClass}
              >
                <PlusCircle size={16} className="mr-2" /> Add{" "}
                {title.slice(0, -1)}
              </Button>
            )}
          </div>
        )}
      </CardContent>

      {/* --- 5. RENDER PAGINATION CONTROLS --- */}
      {isPaginated && pageCount > 1 && (
        <div className="flex items-center justify-end gap-4 p-4 border-t">
          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EditableTable;
