import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";

// Import your RTK Query hooks
import {
  useBranchDetailsQuery,
  useManagersQuery,
  useUpdateBranchMutation,
} from "../store/apiSlice/apiSlice";

// Import UI Components
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
import EditBranchDetailsSkeleton from "../components/skeleton/EditBranchDetailsSkeleton";

import { branchSchema } from "../validation/BranchValidations";
import EditableTable from "../components/EditableTable";
import EditableTag from "../components/EditableTag";

// Icons
import { ChevronRight, MapPin } from "lucide-react";

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
  { value: 1, label: "Damascus" },
  { value: 2, label: "Aleppo" },
  { value: 3, label: "Latakia" },
];

const EditBranch = () => {
  const { branchID } = useParams();
  const navigate = useNavigate();

  const { data: branchData, isLoading: isFetchingDetails } =
    useBranchDetailsQuery(branchID);
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const { data: managersResponse } = useManagersQuery();

  const managers = managersResponse?.allManager?.map((manager) => {
    return {
      value: String(manager.id),
      label: manager.name,
    };
  });

  const [locationStatus, setLocationStatus] = useState({
    loading: false,
    error: null,
  });

  const form = useForm({
    resolver: zodResolver(branchSchema),
    mode: "onTouched",
    defaultValues: {
      description: "",
      location_note: "",
      city_id: null,
      latitude: "",
      longitude: "",
      manager_id: "",
      categories: [],
      services: [],
      working_hours: [],
      delivery_regions: [],
    },
  });

  useEffect(() => {
    if (branchData?.branch) {
      const branch = branchData.branch;
      const transformedData = {
        description: branch.description || "",
        location_note: branch.location_note || "",
        city_id: branch.city.id || "",
        latitude: branch.latitude || "",
        longitude: branch.longitude || "",
        manager_id: String(branch.manager?.id || ""),
        categories: (branch.categories || []).map((cat) => cat.name),
        services: (branch.branch_service_types || []).map((item) => ({
          name: item.service_type.name,
          price: parseFloat(item.custom_price) || 0,
          description: item.service_type.description || "",
        })),
        working_hours: (branch.working_days || []).map((day) => ({
          day: day.day_of_week,
          // Use slice(0, 5) to convert "HH:MM:SS" to "HH:MM"
          open_time: day.open_time ? day.open_time.slice(0, 5) : "",
          close_time: day.close_time ? day.close_time.slice(0, 5) : "",
        })),
        delivery_regions: (branch.delivery_areas || []).map((area) => ({
          city_id: area.city_id,
          delivery_price: parseFloat(area.delivery_price) || 0,
        })),
      };
      form.reset(transformedData);
    }
  }, [branchData, form]);

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
    console.log("Submitting updated branch data:", data);
    try {
      const response = await updateBranch({ branchID, body: data }).unwrap();
      toast.success(response?.data?.message || "Branch updated successfully!");
      navigate("/branches");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update branch.");
      console.error("Update failed:", error);
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
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-lg sm:text-3xl font-bold text-(--primaryFont)">
                Edit Branch
              </h1>
              <div className="flex text-(--primaryFont) items-center gap-2 text-sm sm:text-base font-medium">
                <NavLink
                  to="/branches"
                  className="text-(--primaryFont) hover:text-(--primary) transition-all"
                >
                  Branches
                </NavLink>
                <ChevronRight size={20} />
                <span className="text-(--primary)">Edit Branch</span>
              </div>
            </header>

            {isFetchingDetails ? (
              <EditBranchDetailsSkeleton />
            ) : (
              <>
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
                          <FormLabel className="text-(--primaryFont)">
                            Branch description
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
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
                          <FormLabel className="text-(--primaryFont)">
                            Location Note
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="manager_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Manager
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            key={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-(--secondaryFont)">
                                <SelectValue placeholder="Select a manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {managers?.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="font-medium text-(--primaryFont)">
                          Branch Coordinates
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleFetchLocation}
                          disabled={locationStatus.loading}
                        >
                          <MapPin size={16} className="mr-2" />
                          {locationStatus.loading
                            ? "Fetching..."
                            : "Get Location"}
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-(--primaryFont)">
                                Latitude
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
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
                              <FormLabel className="text-(--primaryFont)">
                                Longitude
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  className="text-(--secondaryFont)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
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
                          <FormLabel className="text-(--primaryFont)">
                            City
                          </FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-(--secondaryFont)">
                                <SelectValue placeholder="Select a City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
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

                {/* --- Categories --- */}
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <EditableTag field={field} title="Categories" />
                  )}
                />

                {/* --- Editable Tables --- */}
                <EditableTable
                  control={form.control}
                  name="services"
                  title="Services"
                  columns={[
                    { header: "Service Name", key: "name", type: "string" },
                    { header: "Price", key: "price", type: "number" },
                    {
                      header: "Description",
                      key: "description",
                      type: "string",
                    },
                  ]}
                  newRowObject={{ name: "", price: 0, description: "" }}
                />
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
                />
                <EditableTable
                  control={form.control}
                  name="delivery_regions"
                  title="Delivery Regions"
                  columns={[
                    { header: "Region Name", key: "city_id", type: "string" },
                    { header: "Price", key: "delivery_price", type: "number" },
                  ]}
                  newRowObject={{ city_id: "", delivery_price: 0 }}
                />

                {/* --- Form Actions --- */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/branches")}
                    className="text-(--secondaryFont) cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    btnClass={"cursor-pointer"}
                    isButton={true}
                    type="submit"
                    isLoading={isUpdating}
                    loadingText="Updating..."
                    text="Update Branch"
                  />
                </div>
              </>
            )}
          </form>
        </Form>
      </main>
    </>
  );
};

export default EditBranch;
