import { createHashRouter } from 'react-router-dom'
import CategoriesTable from '../modules/table/components/category-table'
import CustomersTable from '../modules/table/components/customer-table'
import TransfersTable from '../modules/table/components/salesman-transfer-table'
import InvoiceTable from '../modules/table/components/invoice-table'
import AddInvoice from '../modules/table/components/invoice-table/add'
import ItemsTable from '../modules/table/components/item-table'
import SalesmanClosingStocksTable from '../modules/table/components/salesman-table/closing-stocks'
import AddTransferSalesman from '../modules/table/components/salesman-transfer-table/add'
import SuppliersTable from '../modules/table/components/supplier-table'
import SupplyTable from '../modules/table/components/supply-table'
import AddSupply from '../modules/table/components/supply-table/add'
import UsersTable from '../modules/table/components/user-table'
import WarehouseClosingStocksTable from '../modules/table/components/warehouse-table/closing-stocks'
import WarehouseInStocksTable from '../modules/table/components/warehouse-table/in-stocks'
import ErrorPage from '../pages/error'
import Layout from '../pages/layout'
import LoginPage from '../pages/login'
import Root from '../pages/root'
import CustomerTransfersTable from '../modules/table/components/customer-transfer-table'
import AddTransferCustomer from '../modules/table/components/customer-transfer-table/add'
import WarehouseOutStocksTable from '../modules/table/components/warehouse-table/out-stocks'
import SalesmanInStocksTable from '../modules/table/components/salesman-table/in-stocks'
import ViewInvoice from '../modules/table/components/invoice-table/view'
import SalesmanOutStocksTable from '../modules/table/components/salesman-table/out-stocks'
import CreditInvoiceTable from '../modules/table/components/invoice-table/credit'
import ViewSupply from '../modules/table/components/supply-table/view'
import CustomerClosingStocksTable from '../modules/table/components/customer-stock-table/closing-stocks'
import CustomerInStocksTable from '../modules/table/components/customer-stock-table/in-stocks'
import CustomerOutStocksTable from '../modules/table/components/customer-stock-table/out-stocks'
import WarehouseInvoiceRecordsTable from '../modules/table/components/warehouse-table/invoice-records'
import ExpensesTable from '../modules/table/components/expense-table'
import SummaryTable from '../modules/table/components/summary-table'
import CreditSupplyTable from '../modules/table/components/supply-table/credit'

export const router = createHashRouter([
   {
      path: '/login',
      element: <LoginPage />,
   },
   {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/',
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [
               { index: true, element: <InvoiceTable /> },
               { path: '/invoice/credit', element: <CreditInvoiceTable /> },
               { path: '/supplies', element: <SupplyTable /> },
               { path: '/supply/credit', element: <CreditSupplyTable /> },

               { path: '/customers', element: <CustomersTable /> },
               { path: '/suppliers', element: <SuppliersTable /> },
               { path: '/categories', element: <CategoriesTable /> },
               { path: '/items', element: <ItemsTable /> },
               { path: '/users', element: <UsersTable /> },
               { path: '/expenses', element: <ExpensesTable /> },
               { path: '/vansales/transfers', element: <TransfersTable /> },
               { path: '/customer/transfers', element: <CustomerTransfersTable /> },

               { path: '/vansales/closing-stocks', element: <SalesmanClosingStocksTable /> },
               { path: '/vansales/transfer-records', element: <SalesmanInStocksTable /> },
               { path: '/vansales/invoice-records', element: <SalesmanOutStocksTable /> },

               { path: '/customer/closing-stocks', element: <CustomerClosingStocksTable /> },
               { path: '/customer/in-records', element: <CustomerInStocksTable /> },
               { path: '/customer/out-records', element: <CustomerOutStocksTable /> },

               { path: '/warehouse/closing-stocks', element: <WarehouseClosingStocksTable /> },
               { path: '/warehouse/supply-records', element: <WarehouseInStocksTable /> },
               { path: '/warehouse/transfer-records', element: <WarehouseOutStocksTable /> },
               { path: '/warehouse/invoice-records', element: <WarehouseInvoiceRecordsTable /> },
               { path: '/summary', element: <SummaryTable /> },
            ],
         },
         {
            path: '/invoices/add',
            element: <AddInvoice />,
         },
         {
            path: '/invoices/view/:invoiceId',
            element: <ViewInvoice />,
         },
         {
            path: '/supplies/view/:supplyId',
            element: <ViewSupply />,
         },
         {
            path: '/supplies/add',
            element: <AddSupply />,
         },
         {
            path: '/salesman/transfers/add',
            element: <AddTransferSalesman />,
         },
         {
            path: '/customer/transfers/add',
            element: <AddTransferCustomer />,
         },
      ],
   },
])
