import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableComponent from "../components/TableComponent";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { NavLink, Outlet, useLocation } from "react-router";
import {
  useManagersQuery,
  useSearchManagerByDateQuery,
  useSearchManagerByNameQuery,
  useSearchManagerByStatusQuery,
} from "../store/apiSlice/apiSlice";

const tableHeader = [
  { name: "ID", key: "id" },
  { name: "Name", key: "name" },
  { name: "Phone", key: "phone" },
  { name: "Email", key: "email" },
  {
    name: "Gender",
    key: "gender",
    render: (row) => {
      return <div>{row.gender === "m" ? "Male" : "Female"}</div>;
    },
  },

  {
    name: "Status",
    key: "status",
    render: (row) => (
      <div
        className={`flex items-center justify-center py-2 px-3 rounded-md ${
          row.status === "active"
            ? "text-[#22c55e] bg-[#e8f9ef]"
            : "text-[#ef4444] bg-[#fdecec]"
        }`}
      >
        {row.status}
      </div>
    ),
  },
  { name: "Created At", key: "created_at" },
];

const Managers = () => {
  const [searchInput, setSearchInput] = useState("");
  const [date, setDate] = useState(undefined);
  const [selectValue, setSelectValue] = useState("all");
  const { data: managerResponse, isLoading } = useManagersQuery();
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const {
    data: searchManagerByNameResponse,
    isFetching: searchManagerByNameIsFetching,
  } = useSearchManagerByNameQuery(searchInput, {
    skip: searchInput === "",
  });
  const {
    data: searchManagerByStatusResponse,
    isFetching: searchManagerByStatusIsFetching,
  } = useSearchManagerByStatusQuery(selectValue, {
    skip: selectValue === "all",
  });
  const {
    data: searchManagerByDateResponse,
    isFetching: searchManagerByDateIsFetching,
  } = useSearchManagerByDateQuery(formattedDate, {
    skip: !date,
  });

  const location = useLocation();
  const condition = location.pathname.endsWith("add-manager");

  const response = searchInput
    ? searchManagerByNameResponse?.allManager
    : date
    ? searchManagerByDateResponse?.allManager
    : selectValue && selectValue !== "all"
    ? searchManagerByStatusResponse?.allManager
    : managerResponse?.allManager;

  const tableBody = response?.map((manager) => {
    return {
      id: manager?.id,
      name: manager?.name,
      phone: manager?.phone,
      email: manager?.email,
      status: manager?.status,
      gender: manager?.gender,
      created_at: manager?.created_at
        ? format(manager?.created_at, "yyyy-MM-dd")
        : format(manager?.created_at, "yyyy-MM-dd"),
    };
  });

  const searchHandler = (value) => {
    setTimeout(() => {
      setSearchInput(value);
    }, 500);
  };
  return (
    <>
      <main className=" text-(--primaryFont) p-5 ">
        <header className="flex items-center justify-between   font-bold mb-5">
          <span className="text-sm text-center sm:text-2xl ">
            {condition ? " Add Manager" : "Managers List"}
          </span>
          <div className="flex items-center text-(--primaryFont) text-sm text-center sm:text-base  sm:gap-2 font-medium">
            <NavLink
              to={"/managers"}
              className={`transition-all ${
                !condition
                  ? "text-(--primary)"
                  : "text-(--primaryFont) hover:text-(--primary)"
              }`}
            >
              Managers List
            </NavLink>
            <ChevronRight size={20} />
            <NavLink
              to={"add-manager"}
              className={({ isActive }) =>
                `transition-all  hover:text-(--primary) ${
                  isActive ? "text-(--primary)" : "text-(--primaryFont)"
                }`
              }
            >
              Add Manager
            </NavLink>
          </div>
        </header>

        {!condition ? (
          <>
            <div className=" text-(--primaryFont) border-2 border-(--border-color)  rounded-md">
              <header className="text-sm sm:text-lg border-b-2 border-(--border-color) p-5 ">
                Managers
              </header>
              <div className="p-5 ">
                <div className="flex flex-col gap-4 xl:flex-row justify-between mb-10">
                  <div className="relative ">
                    <Input
                      onChange={(input) => searchHandler(input.target.value)}
                      type="text"
                      placeholder="Search"
                      className="pl-8 text-sm sm:text-base focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 w-3xs placeholder-(--secondaryFont) text-(--secondaryFont)"
                    />
                    <Search
                      className="absolute left-1 top-1/2 -translate-y-[60%] text-(--primary)"
                      size={20}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 ">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="basis-1/2  min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                        >
                          {date ? format(date, "PPP") : <span>Created On</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          className="text-(--primaryFont)"
                          selected={date}
                          onSelect={(e) => {
                            setDate(e);
                            // refetch();
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      autoFocus
                      value={selectValue}
                      onValueChange={setSelectValue}
                    >
                      <SelectTrigger className="basis-1/2 min-w-[225px] w-full h-10!  focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2  placeholder-(--secondaryFont) text-(--secondaryFont)">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="text-(--primaryFont)">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="deleted">Not Active</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div
                  className="
          overflow-hidden max-h-[400px]  hover:overflow-y-scroll custom-scrollbar    transition-all"
                >
                  <TableComponent
                    direction={"managers"}
                    tableHeader={tableHeader}
                    tableBody={tableBody}
                    isLoading={
                      searchInput !== ""
                        ? searchManagerByNameIsFetching
                        : selectValue !== "all"
                        ? searchManagerByStatusIsFetching
                        : formattedDate
                        ? searchManagerByDateIsFetching
                        : isLoading
                    }
                  />
                </div>
              </div>
            </div>
            <Pagination className="mt-10 text-(--secondaryFont) ">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="hover:bg-primary hover:text-white "
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="hover:bg-primary hover:text-white "
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive
                    className="hover:bg-primary hover:text-white "
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="hover:bg-primary hover:text-white "
                  >
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="hover:bg-primary hover:text-white "
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
};

export default Managers;
