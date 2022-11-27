import { orderListRoot, detailsRoot } from "./roots";
import React from "react";
import { Orders } from "./clientOrders";
import { EditDeliveryForm } from "./editForm";
import { DetailsClose } from "./buttons";
import { DeleteModal } from "../components/modal";
import { cta } from "../main";

export function OrderDetails(props, isEdit) {
    cta();
    document.getElementById("client-details").classList.add("hide-m");
    document.getElementById("info-pannel").classList.add("hide-m");
    orderListRoot.render(<Orders isShow="False" />);
    fetch(`api/order_details/${props}`, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("client-orders").style.display = "none";
            detailsRoot.render(
                <OrderView order={props} data={data} isEdit={isEdit} />
            );
            document.getElementById("order-details").style.display = "block";
        });
}

export function OrderDetailDiv(props) {
    if (props.pharmacy == "") {
        return (
            <div className="col-md-8" id="detail-container">
                <EditOrder client={props.client} details={props.details} />
                <p id="order-details">{props.orderDetails}</p>
            </div>
        );
    } else {
        return (
            <div className="col-md-8" id="detail-container">
                <EditOrder client={props.client} details={props.details} />
                <p id="order-details">{props.orderDetails}</p>
                <br></br>
                <p id="order-details">
                    <strong>Pharamacy: </strong>
                    {props.pharmacy}
                </p>
            </div>
        );
    }
}

function Button(props) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                window.location.href = `api/pdf/${props.order}`;
            }}
            className="float-right pointer text-center download">
            <i className="fa-solid fa-2x fa-file-arrow-down"></i>
            <strong>
                <p>PDF</p>
            </strong>
        </div>
    );
}

function EditOrder(props) {
    function clickHandler(props) {
        OrderDetails(props.details.order_number, "True");
    }
    return (
        <div id="edit_btn">
            <i
                onClick={(e) => {
                    e.preventDefault();
                    clickHandler(props);
                }}
                className="pointer hover fa-regular fa-pen-to-square"></i>
        </div>
    );
}
function Empty() {
    return <></>;
}
export function DeleteOrder(props) {
    function deleteOrder() {
        scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(cta, 750);
        detailsRoot.render(<Empty />);
        fetch(`api/delete_order`, {
            method: "POST",
            body: JSON.stringify({
                id: props.order,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                document
                    .getElementById("info-pannel")
                    .classList.remove("hide-m");

                document
                    .getElementById("client-details")
                    .classList.remove("hide-m");

                document.getElementById("order-details").style.display = "none";
                document.getElementById("client-orders").style.display = "none";
                orderListRoot.render(
                    <Orders isShow="True" user={props.user} />
                );
            });
    }
    return (
        <i
            onClick={deleteOrder}
            className="ml-2 green fa-solid fa-2x fa-check pointer"></i>
    );
}

function OrderView(props) {
    return (
        <div className="order-details">
            <div className="row">
                <div className="col-md-1 d-sm-none">
                    {" "}
                    <DetailsClose client={props.data.client.id} />
                </div>

                <div className="col-md-4">
                    <h3>Order:</h3>
                    <h3>#{props.data.details.order_number}</h3>
                </div>
                <div className="col-md-2 d-none d-md-block"></div>
                <div className="col-md-5 order-card-info">
                    <p className="cap">
                        <strong>Date Due: </strong>
                        {props.data.details.date_due}
                        <br></br>
                        <strong>Status: </strong>
                        {props.data.details.status}
                    </p>
                </div>
                <div className="col-md-1 d-none d-md-block">
                    {" "}
                    <DetailsClose client={props.data.client.id} />
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-12">
                    <h4>Details:</h4>
                </div>
            </div>
            <div className="row details">
                <div className="col-md-2"></div>
                {(() => {
                    if (props.isEdit == "False") {
                        return (() => {
                            if (props.data.details.order) {
                                return (
                                    <OrderDetailDiv
                                        orderDetails={props.data.details.order}
                                        client={props.data.client}
                                        details={props.data.details}
                                        pharmacy={""}
                                    />
                                );
                            } else if (props.data.details.order_details) {
                                return (
                                    <OrderDetailDiv
                                        orderDetails={
                                            props.data.details.order_details
                                        }
                                        client={props.data.client}
                                        details={props.data.details}
                                        pharmacy={props.data.details.pharmacy}
                                    />
                                );
                            } else if (props.data.details.notes) {
                                return (
                                    <OrderDetailDiv
                                        orderDetails={props.data.details.notes}
                                        client={props.data.client}
                                        details={props.data.details}
                                        pharmacy={""}
                                    />
                                );
                            }
                        })();
                    } else {
                        return (() => {
                            if (props.data.details.order) {
                                return (
                                    <EditDeliveryForm
                                        date={props.data.details.date_due}
                                        orderDetails={props.data.details.order}
                                        order={props.data.details.order_number}
                                        type={"delivery"}
                                        pharmacy={""}
                                    />
                                );
                            } else if (props.data.details.order_details) {
                                return (
                                    <EditDeliveryForm
                                        date={props.data.details.date_due}
                                        orderDetails={
                                            props.data.details.order_details
                                        }
                                        order={props.data.details.order_number}
                                        type={"pharmacy"}
                                        pharmacy={props.data.details.pharmacy}
                                    />
                                );
                            } else if (props.data.details.notes) {
                                return (
                                    <EditDeliveryForm
                                        date={props.data.details.date_due}
                                        orderDetails={props.data.details.notes}
                                        order={props.data.details.order_number}
                                        type={"welfare"}
                                        pharmacy={""}
                                    />
                                );
                            }
                        })();
                    }
                })()}
            </div>
            <hr></hr>
            <div className="row">
                <div className="col-md-6">
                    <p>
                        <strong>Created on: </strong>
                        {props.data.details.date_created}
                        <br></br>
                        <strong>Due: </strong>
                        {props.data.details.date_due}
                    </p>
                </div>
                <div className="col-md-6 order-card-info">
                    <p>
                        <strong>Assigned to: </strong>
                        {props.data.operator.username}
                    </p>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <Button order={props.order} />
                    <DeleteModal
                        order={props.order}
                        user={props.data.client.id}
                    />
                </div>
            </div>
        </div>
    );
}
