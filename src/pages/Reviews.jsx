import { ChevronRight, Star } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";
import renderStars from "../util/renderStars";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ReviewsSkeleton from "../components/skeleton/ReviewsSkeleton";

const Reviews = () => {
  const [date, setDate] = useState();
  const location = useLocation();
  const condition = location.pathname.endsWith("delivery-employee-reviews");

  return (
    <main className=" text-(--primaryFont) p-5 sm:p-10 ">
      <header className="flex items-center justify-between   font-bold mb-5">
        <span className="text-sm text-center sm:text-2xl ">Reviews</span>
        <div className="flex items-center text-sm text-center sm:text-base  sm:gap-2 font-medium">
          <NavLink
            to={"/reviews"}
            className={({ isActive }) =>
              `transition-all ${
                isActive ? "text-(--primary)" : "text-(--primaryFont)"
              }`
            }
            end
          >
            Customers Reviews
          </NavLink>
          <ChevronRight size={20} />
          <NavLink
            to={"delivery-employee-reviews"}
            className={({ isActive }) =>
              `transition-all ${
                isActive ? "text-(--primary)" : "text-(--primaryFont)"
              }`
            }
          >
            Delivery Employee Reviews{" "}
          </NavLink>
        </div>
      </header>
      {!condition ? (
        isLoading ? (
          <ReviewsSkeleton />
        ) : (
          <>
            <div className="sm:text-end  mt-10">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="basis-1/2 w-full sm:w-fit min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                  >
                    {date ? format(date, "PPP") : <span>Sale Start On</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    className="text-(--primaryFont)"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <section className="flex text-sm sm:text-lg my-10 flex-col md:flex-row items-center gap-10  md:justify-evenly md:gap-5 text-(--primaryText)">
              <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-(--border-color)  border-b-2 md:border-b-0 pb-5  md:pr-20">
                <p>Total Reviews</p>
                <span className="font-bold">{reviewInfo.total}</span>
              </div>
              <div className="space-y-5 text-center w-full md:w-fit md:border-r-2 border-(--border-color) border-b-2 md:border-b-0 pb-5 md:pr-20">
                <p>Average Rating</p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="font-bold">{reviewInfo.average}</span>
                  {renderStars(reviewInfo.average ? reviewInfo.average : 0, 30)}
                </div>
              </div>
              <div className="w-full  md:w-fit">
                <ul className=" space-y-1">
                  <li>
                    <div className="flex gap-1 justify-center md:justify-start items-center text-sm font-bold">
                      <Star size={15} stroke="none" fill="#e2e8f0" />5{" "}
                      <span className="w-40 h-[4px] rounded-3xl bg-[#22c55e] " />{" "}
                      {reviewInfo.ratingsDistribution[5]}
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-1  justify-center md:justify-start items-center text-sm font-bold">
                      <Star size={15} stroke="none" fill="#e2e8f0" />4{" "}
                      <span className="w-35 h-[4px] rounded-3xl bg-[#df83ff] " />{" "}
                      {reviewInfo.ratingsDistribution[4]}
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-1  justify-center md:justify-start items-center text-sm font-bold">
                      <Star size={15} stroke="none" fill="#e2e8f0" />3{" "}
                      <span className="w-30 h-[4px] rounded-3xl bg-[#df83ff] " />{" "}
                      {reviewInfo.ratingsDistribution[3]}
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-1  justify-center md:justify-start items-center text-sm font-bold">
                      <Star size={15} stroke="none" fill="#e2e8f0" />2{" "}
                      <span className="w-25 h-[4px] rounded-3xl bg-[#31c4fb] " />{" "}
                      {reviewInfo.ratingsDistribution[2]}
                    </div>
                  </li>
                  <li>
                    <div className="flex gap-1  justify-center md:justify-start items-center text-sm font-bold">
                      <Star size={15} stroke="none" fill="#e2e8f0" />1{" "}
                      <span className="w-20 h-[4px] rounded-3xl bg-[#f37f23] " />{" "}
                      {reviewInfo.ratingsDistribution[1]}
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="text-sm sm:text-base border-t-2 border-(--border-color)">
              <div className=" mt-10  py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-40  border-b-2 border-(--border-color)">
                <div className="flex items-center lg:items-start  gap-5 ">
                  <img
                    src="/person.png"
                    className="rounded-full w-20 h-20 sm:w-30 sm:h-30"
                    alt=""
                  />
                  <div className="text-(--primaryText) font-bold space-y-4 min-w-[200px]">
                    <h1 className="text-2xl">Hollie Bruggen</h1>
                    <p>
                      <span className="text-(--secondaryFont) text-sm">
                        Total Reviews :{" "}
                      </span>
                      400
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <span className="flex  text-(--secondaryFont) font-bold gap-3">
                    {renderStars(5)} 24-10-2025
                  </span>
                  <p className="text-(--secondaryFont) tracking-wider mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Suscipit similique, architecto quo accusantium libero
                    corrupti voluptatibus maxime eveniet fuga alias, soluta
                    dolor dolorum aliquid, impedit error blanditiis praesentium
                    inventore nesciunt!
                  </p>
                  <div className="text-end">
                    <Button
                      type="submit"
                      className="px-30 py-6 mt-10   text-md w-[300px] gap-5 sm:w-44  h-10 cursor-pointer"
                    >
                      Send Notification{" "}
                    </Button>
                  </div>
                </div>
              </div>
              <div className=" mt-10  py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-40  border-b-2 border-(--border-color)">
                <div className="flex items-center lg:items-start  gap-5 ">
                  <img
                    src="/person.png"
                    className="rounded-full w-20 h-20 sm:w-30 sm:h-30"
                    alt=""
                  />
                  <div className="text-(--primaryText) font-bold space-y-4 min-w-[200px]">
                    <h1 className="text-2xl">Hollie Bruggen</h1>
                    <p>
                      <span className="text-(--secondaryFont) text-sm">
                        Total Reviews :{" "}
                      </span>
                      14
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <span className="flex  text-(--secondaryFont) font-bold gap-3">
                    {renderStars(5)} 24-10-2025
                  </span>
                  <p className="text-(--secondaryFont) tracking-wider mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Suscipit similique, architecto quo accusantium libero
                    corrupti voluptatibus maxime eveniet fuga alias, soluta
                    dolor dolorum aliquid, impedit error blanditiis praesentium
                    inventore nesciunt!
                  </p>
                  <div className="text-end">
                    <Button
                      type="submit"
                      className="px-30 py-6 mt-10   text-md  gap-5 w-[300px] sm:w-44  h-10 cursor-pointer"
                    >
                      Send Notification{" "}
                    </Button>
                  </div>
                </div>
              </div>
              <div className=" mt-10  py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-40  border-b-2 border-(--border-color)">
                <div className="flex items-center lg:items-start  gap-5 ">
                  <img
                    src="/person.png"
                    className="rounded-full w-20 h-20 sm:w-30 sm:h-30"
                    alt=""
                  />
                  <div className="text-(--primaryText) font-bold space-y-4 min-w-[200px]">
                    <h1 className="text-2xl">Hollie Bruggen</h1>
                    <p>
                      <span className="text-(--secondaryFont) text-sm">
                        Total Reviews :{" "}
                      </span>
                      14
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <span className="flex  text-(--secondaryFont) font-bold gap-3">
                    {renderStars(5)} 24-10-2025
                  </span>
                  <p className="text-(--secondaryFont) tracking-wider mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Suscipit similique, architecto quo accusantium libero
                    corrupti voluptatibus maxime eveniet fuga alias, soluta
                    dolor dolorum aliquid, impedit error blanditiis praesentium
                    inventore nesciunt!
                  </p>
                  <div className="text-end">
                    <Button
                      type="submit"
                      className="px-30 py-6 mt-10   text-md  gap-5 w-[300px] sm:w-44  h-10 cursor-pointer"
                    >
                      Send Notification{" "}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
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
        )
      ) : (
        <Outlet />
      )}
    </main>
  );
};

export default Reviews;
