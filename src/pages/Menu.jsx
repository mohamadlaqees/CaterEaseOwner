import { useCategoriesQuery } from "../store/apiSlice/apiSlice";
import { Link } from "react-router";
import { BookOpen, Store } from "lucide-react";

import EmptyState from "../components/EmptyState";
import MenuSkeleton from "../components/skeleton/ManuSkeleton";

const Menu = () => {
  const { data: responseData, isLoading, isError } = useCategoriesQuery();

  const renderContent = () => {
    if (isLoading) {
      return <MenuSkeleton />;
    }

    if (isError) {
      return (
        <EmptyState
          icon={BookOpen}
          title="Could Not Load Menu"
          description="There was an error fetching the menu data. Please try again later."
        />
      );
    }

    const branches = responseData?.branches;
    if (!branches || branches.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title="No Branches Found"
          description="There are no branches with categories to display yet."
        />
      );
    }

    return (
      <div className="space-y-8">
        {branches.map((branch) => (
          <div
            key={`branch-${branch.id}`}
            className="border border-gray-200 rounded-lg shadow-sm"
          >
            <header className="p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-bold text-(--primaryFont) flex items-center">
                <Store className="mr-3 text-(--primary)" />
                {branch.description}
              </h2>
              <p className="text-sm text-(--secondaryFont) mt-1">
                {branch.location_note}
              </p>
            </header>

            <div className="p-4">
              {branch.categories && branch.categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {branch.categories.map((category) => (
                    <Link
                      key={`category-${category.id}`}
                      to={`${branch.id}/${category.name}/${category.id}`}
                      className="block cursor-pointer hover:bg-gray-100 transition-all text-center space-y-2 border-2 border-gray-200 rounded-md p-3"
                    >
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto"
                        src={`/${category.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.png`}
                        alt={category.name}
                      />
                      <p className="text-sm sm:text-base font-semibold text-(--primaryFont)">
                        {category.name}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-(--secondaryFont) text-center py-4">
                  This branch has no categories.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="p-4 sm:p-6 md:p-10">
      <header className="flex justify-between items-center font-bold mb-6">
        <span className="text-xl sm:text-2xl text-(--primaryFont)">
          Menu by Branch
        </span>
      </header>
      {renderContent()}
    </main>
  );
};

export default Menu;
