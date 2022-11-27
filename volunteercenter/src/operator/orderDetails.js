import { createRoot } from "react-dom/client";
import React from "react";
import { orderRoot, assignedRoot } from "./operator";
import { OrderList } from "./orderList";

let root = createRoot(document.getElementById("order-details"));
export function OrderDetails(props, isEdit, isAssigned) {
    document.getElementById("info-pannel").classList.add("hide-m");
    document.getElementById("operator-details").classList.add("hide-m");
    orderRoot.render(
        <OrderList isEdit="False" isAssigned="False" isShow="False" />
    );
    assignedRoot.render(
        <OrderList isEdit="False" isAssigned="True" isShow="False" />
    );
    document.getElementById("operator-orders").style.display = "none";
    document.getElementById("available-orders").style.display = "none";
    document.getElementById("order-details").style.display = "block";
    fetch(`api/order_details/${props}`, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => {
            root.render(
                <OrderView
                    order={props}
                    data={data}
                    isEdit={isEdit}
                    isAssigned={isAssigned}
                />
            );
        });
}

function Button(props) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                window.location.href = `api/pdf/${props.order}`;
            }}
            className={props.float + " mr-3 pointer text-center download"}>
            <i className="fa-solid fa-2x fa-file-arrow-down"></i>
            <strong>
                <p>PDF</p>
            </strong>
        </div>
    );
}

function render() {
    orderRoot.render(
        <OrderList isEdit="False" isAssigned="False" isShow="True" />
    );
    assignedRoot.render(
        <OrderList isEdit="False" isAssigned="True" isShow="True" />
    );
}
function Accept(props) {
    function update(order) {
        render();
        fetch(`api/order_status`, {
            method: "POST",
            body: JSON.stringify({
                id: order,
                detail: "accepted",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                OrderDetails(props.order, "False", "True");
            });
    }
    return (
        <div
            id="detail-button"
            onClick={() => update(props.order)}
            className="fade-in float-right pointer text-center download">
            <i className="fa-solid fa-2x fa-circle-check"></i>
            <strong>
                <p>Accept</p>
            </strong>
        </div>
    );
}

function Complete(props) {
    function update(order) {
        fetch(`api/order_status`, {
            method: "POST",
            body: JSON.stringify({
                id: order,
                detail: "fulfilled",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                OrderDetails(props.order, "False", "True");
            });
    }
    return (
        <div
            id="detail-button"
            onClick={() => update(props.order)}
            className="fade-in float-right pointer text-center download">
            <i className="fa-solid fa-2x fa-circle-check"></i>
            <strong>
                <p>Complete</p>
            </strong>
        </div>
    );
}

function DetailsClose(props) {
    function close() {
        orderRoot.render(
            <OrderList isEdit="False" isAssigned="False" isShow="True" />
        );
        assignedRoot.render(
            <OrderList isEdit="False" isAssigned="True" isShow="True" />
        );

        if (props.isAssigned == "True") {
            document.getElementById("order-details").style.display = "none";
            document.getElementById("available-orders").style.display = "none";
            document.getElementById("operator-orders").style.display = "block";
        } else {
            document.getElementById("order-details").style.display = "none";
            document.getElementById("available-orders").style.display = "block";
            document.getElementById("operator-orders").style.display = "none";
        }
        document.getElementById("operator-details").classList.remove("hide-m");
        document.getElementById("info-pannel").classList.remove("hide-m");
    }
    return (
        <i
            onClick={close}
            className="float-right fa-regular fa-2x fa-circle-xmark pointer"></i>
    );
}

function OrderView(props) {
    return (
        <div className="order-details">
            <div className="row">
                <div className="col-md-12">
                    <DetailsClose isAssigned={props.isAssigned} />
                </div>
                <div className="col-md-4">
                    <h3>#{props.data.details.order_number}</h3>
                    <h4>Client: </h4>
                    <p>
                        <strong>
                            {props.data.client.last_name},{" "}
                            {props.data.client.first_name}
                        </strong>
                        <br></br>
                        {props.data.client.email}
                        <br></br>
                        {props.data.client.phone_number}
                        <br></br>
                        {props.data.client.address_1}
                        <br></br>
                        {props.data.client.city}
                        <br></br>
                        {props.data.client.county}
                        <br></br>
                        {props.data.client.postcode}
                    </p>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-6">
                    <p className="cap">
                        <strong>Date Due: </strong>
                        {props.data.details.date_due}
                        <br></br>
                        <strong>Assigned To: </strong>
                        {props.data.operator.username}
                        <br></br>
                        <strong>Status: </strong>
                        {props.data.details.status}
                    </p>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12">
                    <h4>Details:</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-10">
                    {(() => {
                        if (props.data.details.order) {
                            return <p>{props.data.details.order}</p>;
                        } else if (props.data.details.order_details) {
                            return (
                                <>
                                    <p>{props.data.details.order_details}</p>
                                    <br></br>
                                    <p id="order-details">
                                        <strong>Pharamacy: </strong>
                                        {props.data.details.pharmacy}
                                    </p>
                                </>
                            );
                        } else if (props.data.details.notes) {
                            return <p>{props.data.details.notes}</p>;
                        }
                    })()}
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-6">
                    <p>
                        <strong>Created on: </strong>
                        {props.data.details.date_created}
                    </p>
                    <p>
                        <strong>Due: </strong>
                        {props.data.details.date_due}
                    </p>
                </div>
                <div className="col-md-6 mt-3">
                    {(() => {
                        if (props.data.details.status == "processing") {
                            return (
                                <>
                                    <Accept order={props.order} />
                                </>
                            );
                        } else if (props.data.details.status == "accepted") {
                            return (
                                <>
                                    <Complete order={props.order} />
                                </>
                            );
                        }
                    })()}
                    <div className="d-sm-none">
                        <Button float="float-left" order={props.order} />
                    </div>
                    <div className="d-none d-md-block">
                        <Button float="float-right" order={props.order} />
                    </div>
                </div>
            </div>
        </div>
    );
}
