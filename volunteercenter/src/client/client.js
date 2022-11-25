import React from "react";
import { createRoot } from "react-dom/client";
import { ClientDetails } from "./clientDetails";
import { Orders } from "../components/clientOrders";
import { detailsRoot, orderListRoot } from "../components/roots";
import { NewOrderButton } from "./clientDetails";
export const navRoot1 = createRoot(document.getElementById("nav-1"));
export const navRoot2 = createRoot(document.getElementById("nav-2"));
export const clientRoot = createRoot(document.getElementById("client-details"));
export { detailsRoot, orderListRoot };

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("client-orders").style.display = "block";
    document.getElementById("client-orders").classList.add("fade-in");
    document.getElementById("client-details").classList.add("fade-in");
    document.getElementById("order-details").style.display = "none";
    navRoot1.render(<NewOrderButton />);
    clientRoot.render(<ClientDetails />);
    orderListRoot.render(<Orders isShow="True" user={0} />);
});
