import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/yguard/Sidebar";
import { Header } from "@/components/yguard/Header";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDark(localStorage.getItem("yguard-theme") === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("yguard-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMenu(true)} dark={dark} onToggleDark={() => setDark((d) => !d)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-left" richColors closeButton />
    </div>
  );
}