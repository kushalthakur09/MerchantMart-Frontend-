import { Outlet } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";
import PageContainer from "@/components/layout/PageContainer";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <Sidebar />

      <SidebarInset>
        <Navbar />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
