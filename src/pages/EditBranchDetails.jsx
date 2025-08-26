import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import {
  useBranchDetailsQuery,
  useManagersQuery,
  useUpdateBranchMutation,
  useGetDeliveryRegionsQuery,
} from "../store/apiSlice/apiSlice";
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
const governorate = [
  { id: 1, name: "Damascus" },
  { id: 2, name: "Rural Damascus" },
  { id: 3, name: "Tartus" },
  { id: 4, name: "Aleppo" },
  { id: 5, name: "Hama" },
  { id: 6, name: "Homs" },
  { id: 7, name: "Latakia" },
  { id: 8, name: "Raqqa" },
  { id: 9, name: "Deir ez-Zor" },
  { id: 10, name: "Al-Hasakah" },
  { id: 11, name: "Daraa" },
  { id: 12, name: "Al-Suwayda" },
  { id: 13, name: "Idlib" },
  { id: 14, name: "Quneitra" },
];
const governorateIdMap = new Map(governorate.map((g) => [g.name, g.id]));

const inputClass =
  "focus-visible:ring-(--primary) focus:border-0 placeholder-(--secondaryFont) text-(--secondaryFont)";

const EditBranch = () => {
  const { branchID } = useParams();
  const navigate = useNavigate();
  const [governorateName, setGovernorateName] = useState("");

  const { data: branchData, isLoading: isFetchingDetails } =
    useBranchDetailsQuery(branchID);
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const { data: managersResponse } = useManagersQuery();
  const {
    data: deliveryRegionsResponse,
    isFetching: deliveryRegionsIsLoading,
  } = useGetDeliveryRegionsQuery(governorateName, {
    skip: !governorateName,
  });

  const [locationStatus, setLocationStatus] = useState({
    loading: false,
    error: null,
  });

  const managers = managersResponse?.allManager?.map((manager) => ({
    value: String(manager.id),
    label: manager.name,
  }));

  const form = useForm({
    resolver: zodResolver(branchSchema),
    mode: "onTouched",
    defaultValues: {
      description: "",
      location_note: "",
      governorate_id: "",
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
    const existingBranch = branchData?.branch;

    if (existingBranch) {
      const initialGovernorate = existingBranch.city?.name || "";

      if (governorateName !== initialGovernorate) {
        setGovernorateName(initialGovernorate);
      }

      if (form.getValues("description") !== existingBranch.description) {
        form.reset({
          description: existingBranch.description || "",
          location_note: existingBranch.location_note || "",
          governorate_id: initialGovernorate,
          latitude: existingBranch.latitude || "",
          longitude: existingBranch.longitude || "",
          manager_id: String(existingBranch.manager_id || ""),
          categories: (existingBranch.categories || []).map((cat) => cat.name),
          services: (existingBranch.branch_service_types || []).map((item) => ({
            name: item.service_type.name,
            price: parseFloat(item.custom_price) || 0,
            description: item.service_type.description || "",
          })),
          working_hours: (existingBranch.working_days || []).map((day) => ({
            day: day.day_of_week,
            open_time: day.open_time ? day.open_time.slice(0, 5) : "",
            close_time: day.close_time ? day.close_time.slice(0, 5) : "",
          })),
          delivery_regions: [],
        });
      }

      const allGovernorateDistricts =
        deliveryRegionsResponse?.results?.[0]?.districts;

      if (allGovernorateDistricts) {
        const existingAreasMap = new Map(
          (existingBranch.delivery_areas || []).map((area) => [
            area.district?.id,
            {
              governorate_id: area.city?.name,
              cityName: area.district?.name,
              city_id: area.district?.city_id,
              district_id: area.district?.id,
              delivery_price: area?.delivery_price,
            },
          ])
        );

        const mergedDeliveryRegions = allGovernorateDistricts.map(
          (district) => {
            if (existingAreasMap.has(district.id)) {
              return existingAreasMap.get(district.id);
            }
            return {
              governorate_id: governorateName,
              cityName: district.name,
              city_id: district.city_id,
              district_id: district.id,
              delivery_price: 0,
            };
          }
        );

        form.setValue("delivery_regions", mergedDeliveryRegions, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [
    branchData,
    deliveryRegionsResponse,
    form,
    governorateName,
    setGovernorateName,
  ]);

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

  // --- Form Submission ---
  const onSubmit = async (data) => {
    const selectedGovernorateId = governorateIdMap.get(data.governorate_id);
    const apiPayload = {
      ...data,
      city_id: selectedGovernorateId,
      delivery_regions: form.getValues("delivery_regions").map((d) => ({
        city_id: d.city_id,
        district_id: d.district_id,
        delivery_price: +d.delivery_price,
      })),
    };

    try {
      const response = await updateBranch({
        branchID,
        body: apiPayload,
      }).unwrap();
      console.log(response);
      toast.success(response.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      navigate("/branches");
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
                            <Input {...field} className={inputClass} />
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
                            <Textarea {...field} className={inputClass} />
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
                          <FormLabel className="text-(--primaryFont) font-medium">
                            Manager
                          </FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={`${inputClass} w-full`}>
                                <SelectValue placeholder="Select a manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="text-(--secondaryFont)">
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
                        <FormLabel className="text-(--primaryFont) font-medium">
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
                              <FormLabel className="text-(--primaryFont) font-medium">
                                Latitude
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  className={inputClass}
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
                                  className={inputClass}
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

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="governorate_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-(--primaryFont) font-medium">
                          Governorate Name
                        </FormLabel>
                        <Select
                          key={field.value}
                          onValueChange={(selectedValue) => {
                            field.onChange(selectedValue);
                            setGovernorateName(selectedValue);
                            form.setValue("delivery_regions", []);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={`${inputClass} w-full`}>
                              <SelectValue placeholder="Select a Governorate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-(--secondaryFont)">
                            {governorate?.map((gov) => (
                              <SelectItem key={gov.id} value={gov.name}>
                                {gov.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <EditableTag
                      field={field}
                      title="Categories"
                      inputClass={inputClass}
                    />
                  )}
                />

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
                  inputClass={inputClass}
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
                  inputClass={inputClass}
                />

                <EditableTable
                  loading={deliveryRegionsIsLoading}
                  control={form.control}
                  name="delivery_regions"
                  title="Delivery Regions"
                  columns={[
                    {
                      header: "Governorate Name",
                      key: "governorate_id",
                      type: "string",
                    },
                    { header: "Region Name", key: "cityName", type: "string" },
                    { header: "Price", key: "delivery_price", type: "number" },
                  ]}
                  inputClass={inputClass}
                />

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate("/branches");
                    }}
                    className="text-(--secondaryFont) hover:text-(--primary) cursor-pointer "
                  >
                    Cacnel
                  </Button>
                  <LoadingButton
                    btnClass={"cursor-pointer"}
                    isButton={true}
                    type="submit"
                    disabled={isUpdating}
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
