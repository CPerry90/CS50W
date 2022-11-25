import { createRoot } from "react-dom/client";
import React from "react";
import { ClientSearch, CallHandlerDetails } from "./clientSearch";
import { detailsRoot, orderListRoot } from "../components/roots";
export { detailsRoot, orderListRoot };
export const navRoot1 = createRoot(document.getElementById("nav-1"));
export const navRoot2 = createRoot(document.getElementById("nav-2"));
export const root = createRoot(document.getElementById("client-search"));
export const userRoot = createRoot(document.getElementById("user-details"));
export const clientRoot = createRoot(document.getElementById("client-details"));
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("search-main").style.display = "block";
    document.getElementById("main").style.display = "none";
    document.getElementById("order-details").style.display = "none";
    root.render(<ClientSearch />);
    userRoot.render(<CallHandlerDetails ch="True" />);
});
