import { createRoot } from "react-dom/client";

export const orderListRoot = createRoot(
    document.getElementById("client-orders")
);
export const detailsRoot = createRoot(document.getElementById("order-details"));
