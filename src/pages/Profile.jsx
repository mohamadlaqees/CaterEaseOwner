import { useSelector } from "react-redux";
import { GitBranch, User, Mail, Phone } from "lucide-react";
import TableComponent from "../components/TableComponent";

// Refined table header for better clarity and spacing
const tableHeader = [
  {
    name: "Branch",
    key: "name",
    render: (row) => (
      <div className="flex items-center gap-4">
        <img
          src={row.photo}
          alt={row.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <p className="font-bold text-(--primaryFont)">{row.name}</p>
          <p className="text-sm text-(--secondaryFont)">{row.city}</p>
        </div>
      </div>
    ),
  },
  {
    name: "Manager",
    key: "manager",
    class: "text-(--secondaryFont)",
  },
  {
    name: "Address",
    key: "address",
    class: "text-(--secondaryFont) max-w-xs truncate", // Truncate long addresses
  },
];

// Helper component for displaying details in the "About" card
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-(--primary) mt-1">{icon}</div>
    <div>
      <p className="text-sm text-(--secondaryFont)">{label}</p>
      <p className="font-semibold text-(--primaryFont)">{value || "N/A"}</p>
    </div>
  </div>
);

const Profile = () => {
  const { branchInfo } = useSelector((state) => state.restaurant);

  // Safely access nested data with optional chaining
  const basicInfo = branchInfo?.basic_info;
  const branches = branchInfo?.branches;
  const mainBranch = branches?.[0]?.branch_info;

  // Process data with fallbacks
  const restaurantPhoto =
    mainBranch?.photo?.replace(/\\\//g, "/") || "./default-restaurant.png";
  const coverPhoto = "./profile.png"; // Placeholder for a dynamic cover photo

  const tableBody =
    branches?.map((branch) => ({
      name: branch.branch_info.description || "Unnamed Branch",
      manager: branch.branch_info.manager || "N/A",
      photo:
        branch.branch_info.photo?.replace(/\\\//g, "/") ||
        "./default-branch.png",
      city: branch.branch_info.city || "N/A",
      address: branch.branch_info.location_note || "No address note.",
    })) || [];

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- Profile Banner --- */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="relative">
            <img
              src={coverPhoto}
              className="h-48 w-full object-cover rounded-t-xl"
              alt="Profile background"
            />
            <div className="absolute -bottom-16 left-8">
              <img
                className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white bg-white"
                src={restaurantPhoto}
                alt={basicInfo?.name}
              />
            </div>
          </div>
          {/* Banner content with proper spacing */}
          <div className="pt-20 pb-6 px-8">
            <h1 className="text-3xl font-bold text-(--primaryFont)">
              {basicInfo?.name || "Restaurant Name"}
            </h1>
            <p className="text-md text-(--secondaryFont) mt-1">
              {basicInfo?.description ||
                "Restaurant description not available."}
            </p>
          </div>
        </div>

        {/* --- Main Details Grid --- */}
        {/* Right Column: Branches Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-(--primaryFont) mb-4 flex items-center">
              <GitBranch className="inline-block mr-3 h-6 w-6" />
              Our Branches ({tableBody.length})
            </h2>
            <div className="overflow-x-auto">
              <TableComponent tableHeader={tableHeader} tableBody={tableBody} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
