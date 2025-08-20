import { Outlet } from "react-router";
import HeaderBar from "../components/HeaderBar";
import LeftSideBar from "../components/LeftSideBar";
import { useEffect, useRef } from "react";
import { useBranchInfoQuery } from "../store/apiSlice/apiSlice";
import { useDispatch } from "react-redux";
import { setBranchInfo } from "../store/restaurantSlice";

const Layout = () => {
  const { data: branchInfoResponse } = useBranchInfoQuery();
  const burgerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBranchInfo(branchInfoResponse?.restaurant));
  }, [branchInfoResponse]);

  return (
    <>
      <main>
        <LeftSideBar sidebarRef={burgerRef} />
        <section>
          <HeaderBar sidebarRef={burgerRef} />
          <main className="  lg:pl-56 pt-[65px] ">
            <Outlet />
          </main>
        </section>
      </main>
    </>
  );
};

export default Layout;
