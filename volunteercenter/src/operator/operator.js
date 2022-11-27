import { createRoot } from "react-dom/client";
import React from "react";
import { OperatorDetails } from "./operatorDetails";
import { OrderList } from "./orderList";
import { UnasignedDisplayButton, OrderDisplayButton } from "./orderList";
let navRoot1 = createRoot(document.getElementById("nav-1"));
let navRoot2 = createRoot(document.getElementById("nav-2"));
navRoot1.render(<UnasignedDisplayButton />);
navRoot2.render(<OrderDisplayButton />);

export const operatorRoot = createRoot(
    document.getElementById("operator-details")
);
export const orderRoot = createRoot(
    document.getElementById("available-orders")
);
export const assignedRoot = createRoot(
    document.getElementById("operator-orders")
);
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("operator-orders").style.display = "block";
    document.getElementById("order-details").style.display = "none";
    document.getElementById("available-orders").style.display = "none";
    operatorRoot.render(<OperatorDetails />);
    orderRoot.render(
        <OrderList isEdit="False" isAssigned="False" isShow="True" />
    );
    assignedRoot.render(
        <OrderList isEdit="False" isAssigned="True" isShow="True" />
    );
});
