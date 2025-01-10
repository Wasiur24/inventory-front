import React from "react";
import Barcode from "react-barcode";
export default function Template({ componentref, products }: any) {
  return (
    <div ref={componentref}   className="mb-5 pb-4 ">
      {console.log(products)}
      {products?.map((product: any) => (
        <div key={product.id}>
          <Barcode value={product.sku} />
          <h1 className="text-center">{product.name}</h1>
        </div>
      ))}
    </div>
  );
}
