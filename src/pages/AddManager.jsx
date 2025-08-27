import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { User, Mail, Phone, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingButton from "../components/LoadingButton";
import { useAddManagerMutation } from "../store/apiSlice/apiSlice";
import { addManagerSchema } from "../validation/managerValidation"; // Import the new ADD schema
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddManager = () => {
  const navigate = useNavigate();
  const [addManager, { isLoading }] = useAddManagerMutation();

  const form = useForm({
    resolver: zodResolver(addManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: undefined,
      password: "",
      status: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await addManager({
        payload: {
          role_id: 2,
          ...data,
        },
      }).unwrap();
      toast.success(response.message || "Manager created successfully!", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      form.reset(); // Clear the form for the next entry
      navigate("/managers");
    } catch (error) {
      // Handle potential validation errors from the backend
      const errorMessages = error.data?.errors
        ? Object.values(error.data.errors).flat().join(", ")
        : error.data?.message || "An error occurred.";
      toast.error(errorMessages, {
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
      <main className="sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              {/* Form Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-(--primaryFont)">
                  Add New Manager
                </h1>
                <p className="mt-1 text-sm text-(--secondaryFont)">
                  Fill in the details below to create a new manager profile.
                </p>
              </div>

              {/* Main Content Area */}
              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                          <FormControl>
                            <Input
                              placeholder="e.g., Jane Smith"
                              {...field}
                              className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Address */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g., jane.smith@example.com"
                              {...field}
                              className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 599123456"
                              {...field}
                              className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4 pt-2"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="m" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="f" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            key={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="pl-10 focus-visible:ring-(--primary) focus:border-0 placeholder-(--secondaryFont) text-(--secondaryFont)">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="text-(--secondaryFont)">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="deleted">
                                Not Active
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Must be at least 8 characters"
                                {...field}
                                className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-4 p-6 bg-gray-50/50 border-t border-gray-200 rounded-b-xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                  }}
                  className="text-(--secondaryFont) hover:text-(--primary) cursor-pointer "
                >
                  Clear Form
                </Button>
                <LoadingButton
                  btnClass={"cursor-pointer"}
                  disabled={isLoading}
                  isButton={true}
                  loadingText="Creating..."
                  text="Create Manager"
                  type="submit"
                />
              </div>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default AddManager;
