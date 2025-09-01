import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { NotificationContainer } from "../ui/NotificationContainer";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  );
};
