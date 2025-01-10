// import React from "react";
// import Barcode from "react-barcode";
// export default function Templatesellrecipt({ componentref, products }: any) {
//   return (
//     <div ref={componentref}>
//       {console.log(saleDetails)}
//       {saleDetails?.map((saleDetails: any) => (
//         <div key={product.id}>
//           {/* <Barcode value={product.sku} /> */}
//           <h1 className="text-center">{product.name}</h1>

//         </div>
//       ))}
//     </div>
//   );
// }
import React from "react";
import { format } from "date-fns";

interface TemplateReciptProps {
  componentref: React.RefObject<HTMLDivElement>;
  saleDetails: {
    products: Array<{
      sku: string;
      name: string;
      quantitySold: number;
      sellingPrice: number;
      totalAmount: number;
    }>;
    customerName: string;
    customerContact: string;
    paymentMethod: string;
    totalSaleAmount: number;
  };
}

const TemplateRecipt: React.FC<TemplateReciptProps> = ({ componentref, saleDetails }) => {
  return (
    <div ref={componentref} className="max-w-md mx-auto p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">SALES RECEIPT</h1>
        <p className="text-gray-600">{format(new Date(), "MMMM dd, yyyy HH:mm:ss")}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-bold mb-2">Customer Details:</h2>
        <p>Name: {saleDetails.customerName}</p>
        <p>Contact: {saleDetails.customerContact}</p>
        <p>Payment Method: {saleDetails.paymentMethod}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-bold mb-2">Items:</h2>
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {saleDetails.products.map((product, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{product.name}</td>
                <td className="text-right py-2">{product.quantitySold}</td>
                <td className="text-right py-2">${product.sellingPrice.toFixed(2)}</td>
                <td className="text-right py-2">${product.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total Amount:</span>
          <span>${saleDetails.totalSaleAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 mt-8">
        <p>Thank you for your purchase!</p>
        <p>Please visit again</p>
      </div>
    </div>
  );
};

export default TemplateRecipt;