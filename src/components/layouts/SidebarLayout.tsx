"use client";
import { X, Menu } from "lucide-react";
import SidebarContent from "../ui/SidebarContent";
import useSidebarHook from "@/hooks/useSidebarHook";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const {activeSection, isOpen, setIsOpen} = useSidebarHook();

  return (
    <>
      <div>
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-gray-200 shadow-sm">
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            {/* Left Content */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsOpen(!isOpen)} className="rounded-md p-2 hover:bg-gray-100 lg:hidden">
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <div className="flex items-center gap-x-2">
                <div className="flex flex-col">
                  <section className="w-10 h-3 bg-red-500" />
                  <section className="w-10 h-3 bg-white" />
                </div>

                <h1 className="text-xl font-medium text-gray-800">
                  My Website
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar Layout */}
        <div className="flex pt-16">
          {/* Sidebar Dekstop Menu */}
          <aside className="hidden w-64 border-r lg:block">
            <SidebarContent activeSection={activeSection} />
          </aside>

          {/* Sidebar Mobile Menu */}
          {isOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
              <aside className="h-full w-64 bg-gray-200 shadow-lg">
                <SidebarContent activeSection={activeSection} />
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto h-[calc(100vh-64px)]">
            <div className="p-2">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}