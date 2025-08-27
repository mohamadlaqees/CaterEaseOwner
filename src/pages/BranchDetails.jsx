import { useParams, NavLink } from "react-router";
import { useBranchDetailsQuery } from "../store/apiSlice/apiSlice";

// Import UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { ChevronRight, User, Phone, Home, Mail, Calendar } from "lucide-react";
import BranchDetailsSkeleton from "../components/skeleton/BranchDetailsSkeleton";
import TableComponent from "../components/TableComponent"; // Ensure this path is correct
import { useEffect } from "react";

// A small helper component for displaying info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 text-(--secondaryFont) pt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-(--secondaryFont)">{label}</p>
      <p className="text-base font-semibold text-(--primaryFont)">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

// --- 1. DEFINE ALL TABLE HEADERS ---

const workingHoursHeader = [
  { name: "Day", key: "day" },
  { name: "Open Time", key: "open_time" },
  { name: "Close Time", key: "close_time" },
];

const servicesHeader = [
  { name: "Service", key: "serviceName" },
  { name: "Description", key: "description" },
  { name: "Price", key: "price", align: "right" }, // Add alignment for consistency
];

const deliveryAreasHeader = [
  { name: "Area", key: "areaName" },
  { name: "Delivery Fee", key: "fee", align: "right" }, // Add alignment
];

const BranchDetails = () => {
  const { branchID } = useParams();
  const { data, error, isLoading, refetch } = useBranchDetailsQuery(branchID);

  useEffect(() => {
    refetch();
  }, []);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Failed to load branch details. Please try again later.
        </p>
      </div>
    );
  }

  const { branch } = data || {};

  // --- 2. MAP ALL TABLE BODY DATA ---

  const workingHoursBody = branch?.working_days?.map((day) => ({
    day: day.day_of_week,
    open_time: day.open_time,
    close_time: day.close_time,
  }));

  const servicesBody = branch?.branch_service_types?.map((item) => ({
    serviceName: item.service_type.name,
    description: item.service_type.description,
    price: `$${parseFloat(item.custom_price).toFixed(2)}`,
  }));

  const deliveryAreasBody = branch?.delivery_areas?.map((area) => ({
    areaName: area.district?.name,
    fee: `$${parseFloat(area.delivery_price).toFixed(2)}`,
  }));

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg sm:text-3xl font-bold text-(--primaryFont)">
              {branch?.description}
            </h1>
            <p className="text-sm sm:text-lg text-(--secondaryFont)">
              Branch Details
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
            <NavLink
              to="/branches"
              className="text-(--secondaryFont) hover:text-(--primary)"
            >
              Branches
            </NavLink>
            <ChevronRight className="text-(--secondaryFont)" size={20} />
            <span className="text-(--primary)">Details</span>
          </div>
        </header>

        {isLoading ? (
          <BranchDetailsSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* --- Main Information, Manager Details ... no changes here --- */}
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Branch Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InfoItem
                      icon={<Home size={20} />}
                      label="City"
                      value={branch?.city?.name}
                    />
                    <InfoItem
                      icon={<Calendar size={20} />}
                      label="Created On"
                      value={formatDate(branch?.created_at)}
                    />
                    <div>
                      <p className="text-sm font-medium text-(--secondaryFont)">
                        Location Note
                      </p>
                      <p className="text-base text-(--primaryFont) mt-1">
                        {branch?.location_note || "No note provided."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Manager Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<User size={20} />}
                      label="Name"
                      value={branch?.manager?.name}
                    />
                    <InfoItem
                      icon={<Phone size={20} />}
                      label="Phone"
                      value={branch?.manager?.phone}
                    />
                    <InfoItem
                      icon={<Mail size={20} />}
                      label="Email"
                      value={branch?.manager?.email}
                    />
                  </CardContent>
                </Card>

                {/* --- Working Hours Table --- */}
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Working Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableComponent
                      tableHeader={workingHoursHeader}
                      tableBody={workingHoursBody}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column ... no changes here --- */}
              <div className="lg:col-span-1 space-y-8">
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Branch Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {branch?.photo ? (
                      <img
                        src={branch?.photo}
                        alt={branch?.description}
                        className="w-full h-auto rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-(--secondaryFont)">
                          No photo available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {branch?.categories?.length > 0 ? (
                      branch?.categories.map((cat) => (
                        <Badge
                          key={cat.id}
                          variant="secondary"
                          className="text-(--secondaryFont) px-5 py-3 rounded-md text-md"
                        >
                          {cat.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-(--secondaryFont)">
                        No categories assigned.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Full-width tables at the bottom */}
            <div className="space-y-8">
              {/* --- 3. REPLACE THE SERVICES TABLE --- */}
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg text-(--primaryFont)">
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TableComponent
                    tableHeader={servicesHeader}
                    tableBody={servicesBody}
                    emptyMessage="No services available for this branch."
                  />
                </CardContent>
              </Card>

              {/* --- 4. REPLACE THE DELIVERY AREAS TABLE --- */}
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg text-(--primaryFont)">
                    Delivery Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TableComponent
                    tableHeader={deliveryAreasHeader}
                    tableBody={deliveryAreasBody}
                    emptyMessage="No delivery areas defined."
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default BranchDetails;
