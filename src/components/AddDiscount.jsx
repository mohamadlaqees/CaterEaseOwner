import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "./LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { discountSchema } from "../validation/discountValidation";
import { useAddDiscountMutation } from "../store/apiSlice/apiSlice";

const AddDiscount = ({
  isOpened,
  closeHandler,
  initialData,
  viewOnly = false,
  packageID,
}) => {
  const [addDiscount, { isLoading: addDiscountIsLoading }] =
    useAddDiscountMutation();

  const mode = viewOnly ? "view" : "add";
  const modalTitle = {
    add: "Add New Discount",
    view: "Discount Details",
  }[mode];

  const form = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      value: "",
      description: "",
      startDate: null,
      endDate: null,
    },
  });

  const onSubmit = async (data) => {
    if (mode === "view") return;
    const payload = {
      package_id: packageID,
      value: data.value,
      description: data.description,
      start_at: format(data.startDate, "yyyy-MM-dd"),
      end_at: format(data.endDate, "yyyy-MM-dd"),
    };
    try {
      let response;
      response = await addDiscount({
        ...payload,
      }).unwrap();
      console.log(response);
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
      closeHandler();
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

  useEffect(() => {
    if (isOpened) {
      if (initialData) {
        form.reset({
          value: initialData.value,
          description: initialData.description,
          startDate: new Date(initialData.start_at),
          endDate: new Date(initialData.end_at),
        });
      } else {
        form.reset({
          value: "",
          description: "",
          startDate: null,
          endDate: null,
        });
      }
    }
  }, [isOpened, initialData, form.reset]);

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-30 z-30"
        onClick={closeHandler}
      />
      <div className="fixed bg-white text-sm sm:text-base text-(--primaryFont) p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[40%] h-fit rounded-md z-40">
        <header className="text-sm sm:text-lg flex justify-between font-bold mb-5">
          {modalTitle}
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={30}
            onClick={closeHandler}
          />
        </header>

        <Form {...form}>
          {/* We can still use a form for layout, but disable submission if view-only */}
          <form
            onSubmit={
              mode !== "view"
                ? form.handleSubmit(onSubmit)
                : (e) => e.preventDefault()
            }
            className="mt-10 space-y-10"
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-(--primaryFont)">Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Discount Value"
                      {...field}
                      disabled={mode === "view"} // <-- Disable input in view mode
                      className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-(--primaryFont)">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the discount"
                      {...field}
                      disabled={mode === "view"} // <-- Disable textarea in view mode
                      className="text-(--secondaryFont) focus-visible:ring-(--primary) focus:border-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col lg:flex-row gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-(--primaryFont)">
                      Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={mode === "view"} // <-- Disable button in view mode
                            className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Start Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-(--primaryFont)">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={mode === "view"} // <-- Disable button in view mode
                            className="focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>End Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- Conditionally render buttons --- */}
            {mode === "add" && (
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeHandler}
                  className="text-(--secondaryFont) cursor-pointer hover:bg-gray-100"
                >
                  Cancle{" "}
                </Button>
                <LoadingButton
                  isButton={true}
                  btnClass={"cursor-pointer"}
                  type="submit"
                  loadingText="Creating..."
                  text="Create Discount"
                  disabled={addDiscountIsLoading}
                />
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddDiscount;
