import React, { useState, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import PageWrapper from './components/layout/PageWrapper';
import NewTripForm from './components/forms/NewTripForm';
import UpdateTripForm from './components/forms/UpdateTripForm';
import AddCustomerForm from './components/forms/AddCustomerForm';
import ViewServices from './components/ViewServices';
import InvoiceForm from './components/forms/InvoiceForm';
import { ToastProvider } from './hooks/useToast';
import { Page } from './types';
import Dashboard from './components/Dashboard';
import AreasCRUD from './components/AreasCRUD';
import CalculationsCRUD from './components/CalculationsCRUD';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const renderPage = useMemo(() => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.NEW_TRIP:
        return <NewTripForm />;
      case Page.INVOICE:
        return <InvoiceForm />;
      case Page.UPDATE_TRIP:
        return <UpdateTripForm />;
      case Page.ADD_CUSTOMER:
        return <AddCustomerForm />;
      case Page.VIEW_ALL_SERVICES:
        return <ViewServices />;
      case Page.MANAGE_AREAS:
        return <AreasCRUD />;
      case Page.MANAGE_CALCULATIONS:
        return <CalculationsCRUD />;
      default:
        return <Dashboard />;
    }
  }, [currentPage]);

  const pageTitle = useMemo(() => {
    const pageName = currentPage.replace(/_/g, ' ');
    return pageName.charAt(0).toUpperCase() + pageName.slice(1).toLowerCase();
  }, [currentPage]);


  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={pageTitle} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <PageWrapper>
              {renderPage}
            </PageWrapper>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
