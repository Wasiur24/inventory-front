import React, { useState, useEffect, useRef } from "react";
import SalesService from "../services/Sales.service";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import TemplateRecipt from "../components/productfrom/TemplateRecipt";
import { useReactToPrint } from "react-to-print";

interface Product {
  productId: {
    _id: string;
    name: string;
    price: number;
    sku: string;
  };
  quantitySold: number;
  totalAmount: number;
  _id: string;
}

interface Transaction {
  _id: string;
  products: Product[];
  totalSaleAmount: number;
  saleDate: string;
  paymentMethod: "Cash" | "Credit Card" | "Debit Card" | "UPI" | "Other";
  customerName: string;
  customerContact: string;
  savedAmount: string;
  sgstAmount: string;
  cgstAmount: string;
}

export default function Sales() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await SalesService.getTotalSales();
      const { sales } = response;

      if (Array.isArray(sales)) {
        setTransactions(sales);
        setFilteredTransactions(sales);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = useReactToPrint({
    contentRef: receiptRef,
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, filterOption, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (filterOption === "Today") {
      filtered = filtered.filter((transaction) => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate.toDateString() === today.toDateString();
      });
    } else if (filterOption === "This Week") {
      filtered = filtered.filter((transaction) => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate >= startOfWeek;
      });
    } else if (filterOption === "This Month") {
      filtered = filtered.filter((transaction) => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate >= startOfMonth;
      });
    }

    setFilteredTransactions(filtered);
  };

  const showToast = (message: string, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  };
  const closeModal = () => {
    setSelectedTransaction(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await SalesService.deleteSale(id);
      showToast("Transaction deleted successfully!");
      fetchTransactions();
    } catch (error) {
      showToast("Failed to delete the transaction.", "error");
    }
  };

  const totalSaleAmount = filteredTransactions.reduce(
    (total, sale) => total + sale.totalSaleAmount,
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/selladd")}
        >
          Sell Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Total Transactions
          </h3>
          <p className="mt-2 text-[20px] font-semibold text-gray-900">
            {filteredTransactions.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Total Sale Amount
          </h3>
          <p className="mt-2 text-[20px] font-semibold text-gray-900">
            ₹ {totalSaleAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex  justify-between items-center mb-6">
        <div className="mb-6">
          <input
            type="text"
            className="px-4 py-2 border rounded-md"
            placeholder="Search by Customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <select
            className="px-4 py-2 border rounded-md"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="All">All Transactions</option>
            <option value="Today">Today's Transactions</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center text-gray-500">
          No transactions available.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Total Sale Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Sale Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {filteredTransactions
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹ {transaction.totalSaleAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.saleDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        View
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 ml-4"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex justify-between w-full mt-4 p-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Prev
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded-md ml-4"
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredTransactions.length / pageSize),
                    currentPage + 1
                  )
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
            <p className="mb-2">
              <strong>Customer Name:</strong> {selectedTransaction.customerName}
            </p>
            <p className="mb-2">
              <strong>Contact:</strong> {selectedTransaction.customerContact}
            </p>
            <p className="mb-2">
              <strong>Sale Amount:</strong>{" "}
              {selectedTransaction.totalSaleAmount.toFixed(2)}
            </p>
            <p className="mb-2">
              <strong>Payment Method:</strong>{" "}
              {selectedTransaction.paymentMethod}
            </p>
            <p className="mb-2">
              <strong>Sale Date:</strong>{" "}
              {new Date(selectedTransaction.saleDate).toLocaleString()}
            </p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Products:</h3>
            <p className="mb-2">
              <strong>Save m</strong>{" "}
              {selectedTransaction.savedAmount}
            </p>
            <ul>
              {selectedTransaction?.products.map((product) => (
                <li key={product._id} className="mb-1">
                  {product?.productId?.name} - {product?.quantitySold} pcs @ ₹
                  {product?.productId?.price} each
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={printReceipt}
            >
              Print
            </button>
          </div>
        </div>
      )}
      {selectedTransaction && (
        <div style={{ display: "none" }}>
          <TemplateRecipt
            componentref={receiptRef}
            saleDetails={selectedTransaction}
          />
        </div>
      )}
    </div>
  );
}
