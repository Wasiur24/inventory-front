

// import React from "react";
// import { format } from "date-fns";

// interface Product {
//   sku: string;
//   name: string;
//   quantitySold: number;
//   sellingPrice: number;
//   mrpprice: number;
//   totalAmount: number;
//   gstnumber: number;
// }

// interface TemplateReciptProps {
//   componentref: React.RefObject<HTMLDivElement>;
//   saleDetails: {
//     products: Product[];
//     customerName: string;
//     customerContact: string;
//     paymentMethod: string;
//     totalSaleAmount: number;
//     billNo?: number;
//     cgstAmount?: number;
//     sgstAmount?: number;
//     savedAmount?: number;
//     saleDate?: Date;
//   };
// }

// const TemplateRecipt: React.FC<TemplateReciptProps> = ({
//   componentref,
//   saleDetails,
// }) => {
//   const shopDetails = {
//     name: "Society Store",
//     address: "House No 313/92-B Shop No PVT -2 PLOT NO 6 TULSI NAGAR INDERLOK ",
//     mobile: "+91-9555162980",
//     gstin: "09ABZFA5370M1ZJ",
//   };

//   // Use existing bill number or generate new one
//   const billNo = saleDetails.billNo || Math.floor(Math.random() * 10000);
//   const saleDate = saleDetails.saleDate
//     ? new Date(saleDetails.saleDate)
//     : new Date();

//   // Calculate GST amounts
//   const calculateGSTAmounts = () => {
//     let totalCGST = 0;
//     let totalSGST = 0;

//     saleDetails.products.forEach((product) => {
//       if (product.gstnumber) {
//         const gstRate = product.gstnumber / 2; // Split into CGST and SGST
//         const gstAmount = (product.totalAmount * gstRate) / 100;
//         totalCGST += gstAmount;
//         totalSGST += gstAmount;
//       }
//     });

//     return { totalCGST, totalSGST };
//   };

//   // Use stored GST amounts if available, otherwise calculate
//   const { totalCGST, totalSGST } =
//     saleDetails.cgstAmount && saleDetails.sgstAmount
//       ? { totalCGST: saleDetails.cgstAmount, totalSGST: saleDetails.sgstAmount }
//       : calculateGSTAmounts();

//   // Calculate saved amount
//   const calculateSavedAmount = () => {
//     return (
//       saleDetails.savedAmount ||
//       saleDetails.products.reduce((total, product) => {
//         const savedPerItem =
//           (product.mrpprice - product.sellingPrice) * product.quantitySold;
//         return total + savedPerItem;
//       }, 0)
//     );
//   };

//   const savedAmount = calculateSavedAmount();

//   return (
//     <div
//       ref={componentref}
//       className="max-w-[80mm] mx-auto p-2 bg-white font-mono text-sm"
//     >
//       <div className="text-center mb-4">
//         <h1 className="text-xl font-bold">{shopDetails.name}</h1>
//         <p className="text-xs">{shopDetails.address}</p>
//         <p className="text-xs">Mob.: {shopDetails.mobile}</p>
//         <p className="text-xs">GSTIN: {shopDetails.gstin}</p>
//       </div>

//       <div className="border-t border-b border-black py-2">
//         <div className="flex justify-between text-xs">
//           <span>BILL No: {billNo}</span>
//           <span>DATE: {format(saleDate, "dd/MM/yyyy")}</span>
//         </div>
//         <div className="flex justify-between text-xs">
//           <span>TIME: {format(saleDate, "HH:mm:ss")}</span>
//         </div>
//       </div>

//       <table className="w-full text-xs mt-2">
//         <thead>
//           <tr className="border-b border-black">
//             <th className="text-left">ITEM</th>
//             <th className="text-right">QTY</th>
//             <th className="text-right">MRP</th>
//             <th className="text-right">RATE</th>
//             <th className="text-right">DIS%</th>
//             {/* <th className="text-right">GST%</th> */}
//             <th className="text-right">AMT</th>
//           </tr>
//         </thead>
//         <tbody>
//           {saleDetails.products.map((product, index) => (
//             <tr key={index} className="border-b border-dotted text-[11px]">
//               <td className="text-left">{product.name}</td>
//               <td className="text-right">{product.quantitySold}</td>
//               <td className="text-right">
//                 ₹{product.mrpprice?.toFixed(2) || "0.00"}
//               </td>
//               <td className="text-right">
//                 ₹{product.sellingPrice?.toFixed(2) || "0.00"}
//               </td>
//               <td className="text-right">
//                 {product?.discountPercentage || "0"}%
//               </td>
//               {/* <td className="text-right">{product.gstnumber || 0}%</td> */}
//               <td className="text-right">
//                 ₹
//                 {typeof product.totalAmount === "number"
//                   ? product.totalAmount.toFixed(2)
//                   : "0.00"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-2 border-t border-black">
//         <div className="flex justify-between border-b border-black">
//           <div className="flex justify-between">
//             <span className="text-[14px] pr-4 py-1 font-bold">
//               No of Items:
//             </span>
//             <span className="text-[14px] pr-4 py-1 font-bold">
//               {saleDetails.products.reduce(
//                 (total, product) => total + product.quantitySold,
//                 0
//               )}
//             </span>
//           </div>
//         </div>
//         <div className="flex justify-between font-bold">
//           <span>NET PAYABLE AMT:</span>
//           <span>₹{saleDetails.totalSaleAmount.toFixed(2)}</span>
//         </div>
//         <div className="text-xs mt-2 border-t border-black">
//           <div className="flex justify-between">
//             <span>CGST AMT:</span>
//             <span>₹{totalCGST.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>SGST AMT:</span>
//             <span>₹{totalSGST.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between font-bold mt-1">
//             <span>GRAND TOTAL:</span>
//             <span>₹{saleDetails?.totalSaleAmount?.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 text-xs border-t border-black">
//         <p className="font-bold">Terms & Conditions:</p>
//         <ol className="list-decimal list-inside">
//           <li>Prices are inclusive of all taxes</li>
//           <li>No refund on fresh products</li>
//           <li>Free Home Delivery</li>
//         </ol>
//       </div>

//       <div className="mt-4 text-center text-sm font-bold">
//         <p>THANKS FOR SHOPPING WITH US</p>
//         <p>PLEASE VISIT AGAIN</p>
//       </div>

//       <div className="mt-4 text-xs border-t border-black pt-2">
//         <p>NAME: {saleDetails.customerName}</p>
//         <p>MOB.: {saleDetails.customerContact}</p>
//       </div>
//       <div className="mt-1 text-xs border-t border-black pt-2">
//         <div className="flex justify-center">
//           <span className="text-sm pr-1 py-1 font-bold">* * Saved Rs. </span>
//           <span className="text-sm py-1 font-bold">
//             {savedAmount.toFixed(2)}
//           </span>
//           <span className="text-sm pr-4 py-1 font-bold">/- On MRP * * </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TemplateRecipt;

import React from "react";
import { format } from "date-fns";

interface Product {
  sku: string;
  name: string;
  quantitySold: number;
  sellingPrice: number;
  mrpprice: number;
  totalAmount: number;
  gstnumber: number;
}

interface TemplateReciptProps {
  componentref: React.RefObject<HTMLDivElement>;
  saleDetails: {
    products: Product[];
    customerName: string;
    customerContact: string;
    paymentMethod: string;
    totalSaleAmount: number;
    billNo?: number;
    cgstAmount?: number;
    sgstAmount?: number;
    savedAmount?: number;
    saleDate?: Date;
  };
}

const TemplateRecipt: React.FC<TemplateReciptProps> = ({
  componentref,
  saleDetails,
}) => {
  const shopDetails = {
    name: "Society Store",
    address: "House No 313/92-B Shop No PVT -2 PLOT NO 6 TULSI NAGAR INDERLOK ",
    mobile: "+91-9555162980",
    gstin: "09ABZFA5370M1ZJ",
  };

  // Use existing bill number or generate new one
  const billNo = saleDetails.billNo || Math.floor(Math.random() * 10000);
  const saleDate = saleDetails.saleDate
    ? new Date(saleDetails.saleDate)
    : new Date();

  // Calculate GST amounts
  const calculateGSTAmounts = () => {
    let totalCGST = 0;
    let totalSGST = 0;

    saleDetails.products.forEach((product) => {
      if (product.gstnumber) {
        const gstRate = product.gstnumber / 2; // Split into CGST and SGST
        const gstAmount = (product.totalAmount * gstRate) / 100;
        totalCGST += gstAmount;
        totalSGST += gstAmount;
      }
    });

    return { totalCGST, totalSGST };
  };

  // Use stored GST amounts if available, otherwise calculate
  const { totalCGST, totalSGST } =
    saleDetails.cgstAmount && saleDetails.sgstAmount
      ? { totalCGST: saleDetails.cgstAmount, totalSGST: saleDetails.sgstAmount }
      : calculateGSTAmounts();

  // Calculate saved amount
  const calculateSavedAmount = () => {
    return (
      saleDetails.savedAmount ||
      saleDetails.products.reduce((total, product) => {
        const savedPerItem =
          (product.mrpprice - product.sellingPrice) * product.quantitySold;
        return total + savedPerItem;
      }, 0)
    );
  };

  const savedAmount = calculateSavedAmount();

  return (
    <div
      ref={componentref}
      className="max-w-[80mm] mx-auto p-2 bg-white font-mono text-sm"
    >
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{shopDetails.name}</h1>
        <p className="text-xs">{shopDetails.address}</p>
        <p className="text-xs">Mob.: {shopDetails.mobile}</p>
        <p className="text-xs">GSTIN: {shopDetails.gstin}</p>
      </div>

      <div className="border-t border-b border-black py-2">
        <div className="flex justify-between text-xs">
          <span>BILL No: {billNo}</span>
          <span>DATE: {format(saleDate, "dd/MM/yyyy")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>TIME: {format(saleDate, "HH:mm:ss")}</span>
        </div>
      </div>

      <table className="w-full text-xs mt-2">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left">ITEM</th>
            <th className="text-right">QTY</th>
            <th className="text-right">MRP</th>
            <th className="text-right">RATE</th>
            <th className="text-right">DIS%</th>
            <th className="text-right">AMT</th>
          </tr>
        </thead>
        <tbody>
          {saleDetails.products
            .filter((product) => product.name) // Only include products with a name
            .map((product, index) => (
              <tr key={index} className="border-b border-dotted text-[11px]">
                <td className="text-left">{product.name}</td>
                <td className="text-right">{product.quantitySold}</td>
                <td className="text-right">
                  {/* ₹{product.mrpprice?.toFixed(2) || "0.00"} */}
                  ₹{product.mrpprice || "0.00"}
                </td>
                <td className="text-right">
                  {/* ₹{product.sellingPrice?.toFixed(2) || "0.00"} */}
                  ₹{product.sellingPrice || "0.00"}
                </td>
                <td className="text-right">
                  {product?.discountPercentage || "0"}%
                </td>
                <td className="text-right">
                  ₹
                  {typeof product.totalAmount === "number"
                    // ? product.totalAmount.toFixed(2)
                    ? product.totalAmount
                    : "0.00"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-2 border-t border-black">
        <div className="flex justify-between border-b border-black">
          <div className="flex justify-between">
            <span className="text-[14px] pr-4 py-1 font-bold">
              No of Items:
            </span>
            <span className="text-[14px] pr-4 py-1 font-bold">
              {saleDetails.products
                .filter((product) => product.name) // Only count products with a name
                .reduce(
                  (total, product) => total + product.quantitySold,
                  0
                )}
            </span>
          </div>
        </div>
        <div className="flex justify-between font-bold">
          <span>NET PAYABLE AMT:</span>
          <span>₹{saleDetails.totalSaleAmount.toFixed(2)}</span>
        </div>
        <div className="text-xs mt-2 border-t border-black">
          <div className="flex justify-between">
            <span>CGST AMT:</span>
            <span>₹{totalCGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST AMT:</span>
            <span>₹{totalSGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mt-1">
            <span>GRAND TOTAL:</span>
            <span>₹{saleDetails?.totalSaleAmount?.toFixed(2)}</span>
           
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs border-t border-black">
        <p className="font-bold">Terms & Conditions:</p>
        <ol className="list-decimal list-inside">
          <li>Prices are inclusive of all taxes</li>
          <li>No refund on fresh products</li>
          <li>Free Home Delivery</li>
        </ol>
      </div>

      <div className="mt-4 text-center text-sm font-bold">
        <p>THANKS FOR SHOPPING WITH US</p>
        <p>PLEASE VISIT AGAIN</p>
      </div>

      <div className="mt-4 text-xs border-t border-black pt-2">
        <p>NAME: {saleDetails.customerName}</p>
        <p>MOB.: {saleDetails.customerContact}</p>
      </div>
      <div className="mt-1 text-xs border-t border-black pt-2">
        <div className="flex justify-center">
          <span className="text-sm pr-1 py-1 font-bold">* * Saved Rs. </span>
          <span className="text-sm py-1 font-bold">
            {savedAmount.toFixed(2)}
          </span>
          <span className="text-sm pr-4 py-1 font-bold">/- On MRP * * </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateRecipt;
