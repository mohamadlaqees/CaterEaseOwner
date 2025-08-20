import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingButton from "../components/LoadingButton";
import { branchSchema } from "../validation/BranchValidations";

import { ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import {
  useAddBranchMutation,
  useManagersQuery,
} from "../store/apiSlice/apiSlice";
import { toast, Toaster } from "sonner";
import EditableTable from "../components/EditableTable";
import EditableTag from "../components/EditableTag";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const cities = [
  { value: 1, label: "New York" },
  { value: 2, label: "London" },
  { value: 3, label: "Tokyo" },
  { value: 4, label: "Sydney" },
  { value: 5, label: "Paris" },
];

const AddBranch = () => {
  const navigate = useNavigate();
  const [addBranch, { isLoading }] = useAddBranchMutation();
  const { data: managersResponse, isLoading: ManagersIsloading } =
    useManagersQuery();
  const [locationStatus, setLocationStatus] = useState({
    loading: false,
    error: null,
  });

  const managers = managersResponse?.allManager?.map((manager) => {
    return {
      value: `${manager.id}`,
      label: manager.name,
    };
  });

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      description: "",
      location_note: "",
      city_id: undefined,
      latitude: "",
      longitude: "",
      managerName: "",
      categories: [],
      services: [],
      working_hours: [],
      delivery_regions: [],
    },
  });

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({
        loading: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setLocationStatus({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Set the values in the form
        form.setValue("latitude", parseFloat(latitude.toFixed(6)), {
          shouldValidate: true,
        });
        form.setValue("longitude", parseFloat(longitude.toFixed(6)), {
          shouldValidate: true,
        });

        setLocationStatus({ loading: false, error: null });
      },
      (error) => {
        // Handle different errors
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission to access location was denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setLocationStatus({ loading: false, error: errorMessage });
      }
    );
  };

  const onSubmit = async (data) => {
    console.log("Submitting new branch data:", data);
    try {
      const response = await addBranch(data).unwrap();
      form.reset();
      navigate("/branches");
      toast.success(response.data.message, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
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

  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("FORM VALIDATION ERRORS:", errors);
            })}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* --- Header --- */}
            <header className="flex text-sm sm:text-base justify-between items-center mb-6">
              <h1 className="text-lg sm:text-3xl font-bold text-(--primaryFont)">
                Add New Branch
              </h1>
              <div className="flex text-(--primaryFont) items-center gap-2 text-sm sm:text-base font-medium">
                <NavLink
                  to="/branches"
                  className="text-(--primaryFont) hover:text-(--primary) transition-all"
                >
                  Branches
                </NavLink>
                <ChevronRight size={20} />
                <span className="text-(--primary)">Add Branch</span>
              </div>
            </header>

            {/* --- Basic Information Card --- */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-(--primaryFont)">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-(--primaryFont) font-medium">
                        Branch description
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Downtown Central"
                          className="text-(--secondaryFont)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-(--primaryFont) font-medium">
                        Location Note
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g., Near the main square, second floor"
                          className="text-(--secondaryFont)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="managerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont) font-medium">
                          Manager Name
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-(--secondaryFont) w-full">
                              <SelectValue placeholder="Select a manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {managers?.map((manager) => (
                              <SelectItem
                                key={manager.value}
                                value={manager.value}
                              >
                                {manager.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* --- ADD THIS GRID FOR COORDINATES --- */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-(--primaryFont) font-medium">
                      Branch Coordinates
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={handleFetchLocation}
                      disabled={locationStatus.loading}
                    >
                      <MapPin size={16} className="mr-2" />
                      {locationStatus.loading
                        ? "Fetching..."
                        : "Get Current Location"}
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont) font-medium">
                            Latitude
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="e.g., 35.684"
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont) font-medium">
                            Longitude
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="e.g., 36.712"
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* This grid now enforces equal widths for its children */}
              </CardContent>
            </Card>

            {/* --- City Selection Card --- */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-(--primaryFont)">
                  City
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-(--primaryFont) font-medium">
                        City
                      </FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-(--secondaryFont) w-full">
                            <SelectValue placeholder="Select a City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <EditableTag field={field} title="Categories" />
              )}
            />

            {/* --- Services Table --- */}
            <EditableTable
              control={form.control}
              name="services"
              title="Services"
              columns={[
                { header: "Service Name", key: "name", type: "string" },
                { header: "Price", key: "price", type: "number" },
                { header: "Description", key: "description", type: "string" },
              ]}
              newRowObject={{ name: "", price: 0, description: "" }}
            />
            {/* --- Editable Tables --- */}
            <EditableTable
              control={form.control}
              extraData={weekDays}
              name="working_hours"
              title="Working Hours"
              columns={[
                { header: "Day", key: "day", type: "string" },
                { header: "Open Time", key: "open_time", type: "time" },
                { header: "Close Time", key: "close_time", type: "time" },
              ]}
              newRowObject={{ day: "", open_time: "", close_time: "" }}
            />
            <EditableTable
              control={form.control}
              name="delivery_regions"
              title="Delivery Regions"
              columns={[
                { header: "Region Name", key: "city_id", type: "string" },
                { header: "Price", key: "delivery_price", type: "number" },
              ]}
              newRowObject={{ name: "", price: 0 }}
            />

            {/* --- Form Actions --- */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                className="text-(--secondaryFont) hover:bg-gray-100 cursor-pointer"
              >
                Clear Form
              </Button>
              <LoadingButton
                btnClass={"cursor-pointer"}
                isButton={true}
                type="submit"
                isLoading={isLoading}
                loadingText="Creating..."
                text="Create Branch"
              />
            </div>
          </form>
        </Form>
      </main>
    </>
  );
};

export default AddBranch;
