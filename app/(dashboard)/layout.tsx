// app/(dashboard)/layout.tsx
"use client";
import React from "react";
import CollapsibleSideBar from "../components/CollapsibleSideBar";
import Footer from "../components/Footer";

/**
 * DashboardLayout:
 * - Fixed sidebar on the left
 * - Main content area with fixed left padding
 * - Content doesn't shift when sidebar expands/collapses
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      {/* Collapsible Sidebar positioned absolutely */}
      <CollapsibleSideBar />

      {/* The main content area with fixed left padding */}
      <div className="ml-2 flex flex-col">
        {/* Main content grows in the middle */}
        <main className="flex-grow p-4">
          {children}
        </main>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </div>
  );
}