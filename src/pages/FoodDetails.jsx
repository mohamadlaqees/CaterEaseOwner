import React from "react"; // Import React for useMemo
import {
  ChevronRight,
  Tag,
  Calendar,
  Info,
  Gift,
  Package,
  PlusCircle,
  XCircle,
  Percent,
  ConciergeBell, // A suitable icon for "Services"
} from "lucide-react";
import { NavLink, useParams } from "react-router";
import renderStars from "../util/renderStars";
import { useShowPackaegQuery } from "../store/apiSlice/apiSlice";
import { FoodDetailsSkeleton } from "../components/skeleton/FoodDetailsSkeleton";

const FoodDetails = () => {
  const { food, category, branchID, categoryID } = useParams();
  const { data: packageResponse, isLoading } = useShowPackaegQuery(food);

  const calculateDiscountedPrice = (basePrice, discounts) => {
    if (!basePrice || !discounts || discounts.length === 0) {
      return { newPrice: basePrice || 0, discountValue: 0 };
    }
    const discount = discounts[0];
    const discountNum = +discount.amount;
    const discountValue = parseFloat(discountNum);
    const newPrice = basePrice * (1 - discountValue / 100);

    return { newPrice, discountValue };
  };

  const { newPrice, discountValue } = calculateDiscountedPrice(
    packageResponse?.base_price,
    packageResponse?.discounts
  );

  const services = packageResponse?.branch_service_types.map(
    (service) => service.service_type_name
  );

  const packageDetails = {
    name: packageResponse?.name || "",
    photo: packageResponse?.photo,
    description: packageResponse?.description || "",
    basePrice: packageResponse?.base_price,
    discountedPrice: newPrice,
    discountPercentage: discountValue,
    items: packageResponse?.items || [],
    extras: packageResponse?.extras || [],
    categories: packageResponse?.categories || [],
    occasions: packageResponse?.occasion_types || [],
    serves: packageResponse?.serves_count || 0,
    maxExtraPersons: packageResponse?.max_extra_persons || 0,
    pricePerExtra: packageResponse?.price_per_extra_person,
    cancellationPolicy: packageResponse?.cancellation_policy || "N/A",
    notes: packageResponse?.notes,
    isActive: packageResponse?.is_active || false,
    prepayment: {
      required: packageResponse?.prepayment_required || false,
      amount: packageResponse?.prepayment_amount,
    },
    servicesNames: services,
    rating: packageResponse?.average_rating,
    reviews: packageResponse?.reviews_count,
  };

  // Destructure for cleaner JSX
  const {
    name,
    photo,
    description,
    basePrice,
    discountedPrice,
    discountPercentage,
    items,
    extras,
    categories,
    occasions,
    serves,
    maxExtraPersons,
    pricePerExtra,
    cancellationPolicy,
    notes,
    isActive,
    prepayment,
    servicesNames,
    reviews,
    rating,
  } = packageDetails;

  const categoryNames = categories?.map((ctg) => ctg.name);

  if (isLoading) {
    return <FoodDetailsSkeleton />;
  }

  return (
    <main className="text-(--primaryFont) p-5 sm:p-10">
      <header className="flex justify-between  items-center font-bold mb-5">
        <span className="text-sm sm:text-2xl">{name}</span>
        <div className="flex sm:gap-2 items-center text-sm sm:text-base sm:font-medium">
          <NavLink
            to={`/menu/${branchID}/${category}/${categoryID}`}
            end
            className="hover:text-(--primary)"
          >
            {category}
          </NavLink>
          <ChevronRight size={20} />
          <NavLink
            to={""}
            className={({ isActive }) =>
              `transition-all ${
                isActive ? "text-(--primary)" : "text-(--primaryFont)"
              }`
            }
          >
            {name}
          </NavLink>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Section */}
        <section className="lg:basis-1/2 space-y-8">
          <div className="p-4 flex justify-center items-center border-2 border-(--border-color) rounded-md relative">
            {photo && (
              <img
                src={photo}
                className="w-full max-w-[1000px] h-auto m-auto rounded-md"
                alt={name}
              />
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center">
                <Percent className="w-4 h-4 mr-1" />
                {discountPercentage} OFF
              </div>
            )}
          </div>

          <div className="p-6 border-2 border-(--border-color) rounded-md">
            <h3 className="text-lg font-semibold text-(--primaryFont) mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-(--primary)" /> Package
              Items
            </h3>
            {items.length > 0 ? (
              <ul className="space-y-2 text-(--secondaryFont)">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <span className="text-(--primary) mr-2">&#10003;</span>
                    {item.food_item_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-4">
                <XCircle className="w-8 h-8 mb-2" />
                <p className="font-medium">
                  No items included in this package.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-2 border-(--border-color) rounded-md">
            <h3 className="text-lg font-semibold text-(--primaryFont) mb-4 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-(--primary)" /> Optional
              Extras
            </h3>
            {extras.length > 0 ? (
              <ul className="space-y-2 text-(--secondaryFont)">
                {extras.map((extra) => (
                  <li
                    key={extra.id}
                    className="flex justify-between items-center"
                  >
                    <span>{extra.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-4">
                <XCircle className="w-8 h-8 mb-2" />
                <p className="font-medium">No optional extras available.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Section */}
        <section className="p-5 sm:p-8 lg:basis-1/2 border-2 border-(--border-color) rounded-md">
          <div>
            <div className="flex lg:flex-col xl:flex-row justify-between items-baseline font-bold">
              <p className="text-xl sm:text-4xl text-(--primaryFont) flex-grow">
                {name}
              </p>
              <div className="flex items-baseline gap-3 mt-2 xl:mt-0">
                {discountPercentage > 0 ? (
                  <>
                    <span className="text-gray-400 text-xl sm:text-2xl line-through">
                      ${basePrice}
                    </span>
                    <span className="text-(--primary) text-2xl sm:text-4xl">
                      ${discountedPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-(--primary) text-xl sm:text-3xl">
                    ${basePrice}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="border-r-2 border-(--border-color) pr-3">
                {renderStars(rating)}
              </div>
              <span className="text-(--secondaryFont) font-bold text-xs sm:text-sm">
                {rating} <span className="text-xl">.</span> {reviews} reviews
              </span>
            </div>
          </div>

          <p className="text-sm w-full max-w-lg mt-4 text-(--secondaryFont)">
            {description}
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-(--primaryFont) mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-(--primary)" /> Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full px-4 py-2 bg-gray-100 border border-(--border-color) text-sm text-(--secondaryFont)">
                  {categoryNames?.map((ctg) => ctg)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--primaryFont) mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-(--primary)" /> Suitable
                for
              </h3>
              <div className="flex flex-wrap gap-3">
                {occasions?.map((occasion) => (
                  <span
                    key={occasion.id}
                    className="rounded-full px-4 py-2 bg-gray-100 border border-(--border-color) text-sm text-(--secondaryFont)"
                  >
                    {occasion.name}
                  </span>
                ))}
              </div>
            </div>

            {/* --- NEW: Services Section --- */}
            {servicesNames?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-(--primaryFont) mb-3 flex items-center">
                  <ConciergeBell className="w-5 h-5 mr-2 text-(--primary)" />
                  Available Services
                </h3>
                <div className="flex flex-wrap gap-3">
                  {servicesNames?.map((serviceName, index) => (
                    <span
                      key={index}
                      className="rounded-full px-4 py-2 bg-gray-100 border border-(--border-color) text-sm text-(--secondaryFont)"
                    >
                      {serviceName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full mt-8 bg-white rounded-xl p-6 space-y-4 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-(--primary)" />
              <span className="text-lg font-semibold text-(--primaryFont)">
                Additional Information
              </span>
            </div>
            <div className="text-sm text-(--secondaryFont) space-y-2 pl-7">
              <p>
                <span className="font-medium text-(--primaryFont)">
                  Serves:
                </span>{" "}
                {serves} people
              </p>
              <p>
                <span className="font-medium text-(--primaryFont)">
                  Max Extra Persons:
                </span>{" "}
                {maxExtraPersons}
              </p>
              <p>
                <span className="font-medium text-(--primaryFont)">
                  Price Per Extra:
                </span>{" "}
                ${pricePerExtra}
              </p>
              <p>
                <span className="font-medium text-(--primaryFont)">
                  Cancellation Policy:
                </span>{" "}
                <span className="capitalize">{cancellationPolicy}</span>
              </p>
              {notes && (
                <p>
                  <span className="font-medium text-(--primaryFont)">
                    Notes:
                  </span>{" "}
                  {notes}
                </p>
              )}
              <p>
                <span className="font-medium text-(--primaryFont)">
                  Status:
                </span>
                <span
                  className={
                    isActive
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {isActive ? " Active" : " Not Active"}
                </span>
              </p>
            </div>

            {prepayment.required && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-(--primary)" />
                  <h3 className="text-lg font-semibold text-(--primaryFont)">
                    Prepayment Details
                  </h3>
                </div>
                <div className="text-sm text-(--secondaryFont) pl-7">
                  <span className="font-medium">Amount Required:</span>
                  <span className="text-(--primary) font-semibold">
                    {" "}
                    ${prepayment.amount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default FoodDetails;
