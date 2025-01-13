import React, { useState, useEffect } from "react";
import SalesService from "../services/Sales.service";
import { useNavigate } from "react-router-dom";

interface Product {
  productId: {
    _id: string;
    name: string;
    price: number;
    sku: string;
  };
  sku: string;
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
}

export default function Sales() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sales data from the API
        const response = await SalesService.getTotalSales();
        const { sales } = response; // Extract `sales` from the API response

        if (Array.isArray(sales)) {
          setTransactions(sales); // Set the sales data to `transactions`
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

    fetchTransactions();
  }, []);

  const closeModal = () => {
    setSelectedTransaction(null);
  };

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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Total Transactions
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {transactions.length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500">
          No transactions available.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sale Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.totalSaleAmount.toFixed(2)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          </div>
        </div>
      )}
    </div>
  );
}
