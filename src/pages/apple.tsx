import React, { useState, useEffect } from "react";
import SalesService from "../services/Sales.service";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [filterOption, setFilterOption] = useState<string>("All");
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sales data from the API
      const response = await SalesService.getTotalSales();
      const { sales } = response; // Extract `sales` from the API response

      if (Array.isArray(sales)) {
        setTransactions(sales); // Set the sales data to `transactions`
        filterTransactions(sales);
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

  const filterTransactions = (sales: Transaction[]) => {
    let filtered = sales;

    // Filter based on search query
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter based on date
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (filterOption === "Today") {
      filtered = filtered.filter(transaction => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate.toDateString() === today.toDateString();
      });
    } else if (filterOption === "This Week") {
      filtered = filtered.filter(transaction => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate >= startOfWeek;
      });
    } else if (filterOption === "This Month") {
      filtered = filtered.filter(transaction => {
        const saleDate = new Date(transaction.saleDate);
        return saleDate >= startOfMonth;
      });
    }

    setFilteredTransactions(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalSaleAmount = filteredTransactions.reduce((total, sale) => total + sale.totalSaleAmount, 0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions(transactions); // Reapply filter when transactions or filterOption change
  }, [searchQuery, filterOption, transactions]);

  const showToast = (message: string, type = "success") => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top", // 'top' or 'bottom'
      position: "right", // 'left', 'center' or 'right'
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  };

  const handleDelete = async (id: string) => {
    try {
      await SalesService.deleteSale(id); // Call the deleteSale method
      showToast("Transaction deleted successfully!");
      fetchTransactions(); // Refetch transactions after deletion
    } catch (error) {
      showToast("Failed to delete the transaction.", "error");
    }
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

    

     
  );
}
