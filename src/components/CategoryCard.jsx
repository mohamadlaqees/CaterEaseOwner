import renderStars from "../util/renderStars";
import { Eye, TicketPercent, Trash2 } from "lucide-react";

const CategoryCard = ({
  item,
  showHandler,
  deleteHandler,
  discountHandler,
}) => {
  return (
    <div className="p-4 text-sm  sm:text-base text-(--primaryFont) border-2 border-(--border-color) rounded-md">
      <img className="m-auto w-80 h-50" src={item.photo} alt="" />
      <div className="mt-10 border-b-2 border-(--border-color)">
        <p className="font-semibold text-sm sm:text-base ">{item.name}</p>

        <div className="flex items-center gap-3 ">
          <div>{renderStars(1)}</div>
          <span className="text-(--secondaryFont) font-bold text-xs sm:text-sm">
            {item.rating} <span className="text-xl">.</span> {item.reviews}{" "}
            reviews
          </span>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-bold mb-2">{item.category}</h3>
        <div className="flex justify-between">
          <span className="text-(--primary) font-bold text-lg sm:text-xl">
            {item.price}
          </span>{" "}
          <div className="flex  cursor-pointer ">
            <TicketPercent
              className="hover:bg-accent rounded-md transition-all"
              style={{ padding: "5px" }}
              size={34}
              onClick={() => discountHandler(item.id)}
            />
            <Eye
              className="hover:bg-accent rounded-md transition-all"
              style={{ padding: "5px" }}
              size={34}
              onClick={() => showHandler(item.id)}
            />
            <Trash2
              className="hover:bg-accent rounded-md transition-all"
              style={{ padding: "5px" }}
              size={34}
              onClick={() => {
                deleteHandler(item.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
