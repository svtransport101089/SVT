import React from 'react';
import { Page } from '../../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  label: string;
  // FIX: Changed type from JSX.Element to React.ReactNode for better compatibility.
  icon: React.ReactNode;
  currentPage: Page;
  onClick: (page: Page) => void;
}> = ({ page, label, icon, currentPage, onClick }) => {
  const isActive = currentPage === page;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(page);
      }}
      className={`flex items-center px-4 py-3 transition-colors duration-200 transform ${
        isActive
          ? 'text-white bg-blue-600'
          : 'text-gray-200 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="mx-4 font-medium">{label}</span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { page: Page.DASHBOARD, label: "Dashboard", icon: <DashboardIcon /> },
        { page: Page.NEW_TRIP, label: "New Trip", icon: <NewTripIcon /> },
        { page: Page.INVOICE, label: "Create Invoice", icon: <InvoiceIcon /> },
        { page: Page.UPDATE_TRIP, label: "Update Trip", icon: <UpdateTripIcon /> },
        { page: Page.ADD_CUSTOMER, label: "Add Customer", icon: <AddCustomerIcon /> },
        { page: Page.VIEW_ALL_SERVICES, label: "View All Services", icon: <AddLocationIcon /> },
        { page: Page.MANAGE_AREAS, label: "Manage Areas", icon: <MapIcon /> },
        { page: Page.MANAGE_CALCULATIONS, label: "Manage Calculations", icon: <CalculatorIcon /> },
    ];

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">SVS Transport</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
            <NavLink
                key={item.page}
                page={item.page}
                label={item.label}
                icon={item.icon}
                currentPage={currentPage}
                onClick={setCurrentPage}
            />
        ))}
      </nav>
    </div>
  );
};


// SVG Icons
const DashboardIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const NewTripIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const UpdateTripIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
);
const AddCustomerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
);
const AddLocationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const InvoiceIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const MapIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 0l6-3m-6 3l6 3m-6-3v-6m6 3l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3v6m6-3v6"></path></svg>
);
const CalculatorIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m-6 4h6m-6 4h6m2-8a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10z"></path></svg>
);


export default Sidebar;
