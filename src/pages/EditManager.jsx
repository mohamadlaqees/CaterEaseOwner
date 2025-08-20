// src/pages/EditManager.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { User, Mail, Phone, KeyRound } from "lucide-react";

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
import {
  useEditManagerMutation,
  useManagerDetailsQuery,
} from "../store/apiSlice/apiSlice";
import { editManagerSchema } from "../validation/managerValidation"; // Import the new schema

const EditManager = () => {
  const { managerID } = useParams();
  const navigate = useNavigate();

  // Correctly use manager-specific hooks
  const { data: managerResponse, isFetching } =
    useManagerDetailsQuery(managerID);
  const [editManager, { isLoading: isUpdating }] = useEditManagerMutation();
  const response = managerResponse.user;
  const form = useForm({
    resolver: zodResolver(editManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: undefined,
      password: "",
    },
    mode: "onChange",
  });

  // Effect to populate the form with manager data once it's loaded
  useEffect(() => {
    if (response) {
      form.reset({
        name: response.name,
        email: response.email,
        phone: String(response.phone),
        gender: response.gender, // 'm' or 'f'
        password: "", // Keep password field empty by default for security
      });
    }
  }, [managerResponse, form]);

  const onSubmit = async (data) => {
    // Construct the payload, only including password if it's not empty
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
    };

    if (data.password) {
      payload.password = data.password;
    }

    try {
      const response = await editManager({ managerID, payload }).unwrap();
      toast.success(response.message || "Manager updated successfully!");
      navigate(`/managers/${managerID}`); // Navigate back to details page on success
    } catch (error) {
      toast.error(error?.data?.message || "An update error occurred.");
    }
  };

  if (isFetching) {
    // You can return a skeleton loader here if you have one for the form
    return <div>Loading form...</div>;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-(--primaryFont)">
                Edit Manager Information
              </h2>
              <p className="mt-1 text-sm text-(--secondaryFont)">
                Update the profile details for{" "}
                {managerResponse?.name || "the manager"}.
              </p>
            </div>

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
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input {...field} className="pl-10" />
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
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input type="email" {...field} className="pl-10" />
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
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input type="tel" {...field} className="pl-10" />
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
                            <FormLabel className="font-normal">Male</FormLabel>
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

                {/* New Password */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (Optional)</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current password"
                              {...field}
                              className="pl-10"
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
                className={"cursor-pointer"}
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <LoadingButton
                btnClass={"cursor-pointer"}
                disabled={isUpdating}
                isButton={true}
                loadingText="Saving..."
                text="Save Changes"
                type="submit"
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditManager;
