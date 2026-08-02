import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <>
    <div>Side Bar</div>
    <div>Navbar</div>
    <Outlet />
    </>
  );
};

export default AppLayout;