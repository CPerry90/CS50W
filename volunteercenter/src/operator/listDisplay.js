import React from "react";
import { OrderDetails } from "./orderDetails";
var today = new Date();
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function Order(props) {
    function overdue(date) {
        var regex = /[,]/g;
        let dateArray = date.split(" ");
        let day = dateArray[0];
        let year = dateArray[2];
        let month = dateArray[1].replace(regex, "");
        let dateDue = year + "-" + (months.indexOf(month) + 1) + "-" + day;
        var date_due = Date.parse(dateDue);
        if (date_due < today) {
            return "overdue";
        } else {
            return;
        }
    }
    return (
        <>
            {props.order.map((order) => (
                <div
                    onClick={() =>
                        OrderDetails(
                            order.order_number,
                            "False",
                            props.isAssigned
                        )
                    }
                    className={`${overdue(order.date_due)} ${order.status}`}
                    key={order.id}
                    id="info">
                    {(() => {
                        if (order.delivery_client) {
                            return (
                                <>
                                    <div className="col-md-3">
                                        <h3 key={order.order_number}>
                                            #{order.order_number}
                                        </h3>
                                        <p className="cap">
                                            <strong>Status: </strong>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="col-md-5">
                                        <p className="el">{order.order}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p>
                                            <strong>Client: </strong>
                                            {order.delivery_client.first_name}
                                        </p>
                                        <p className="m-0">
                                            <strong>Due: </strong>
                                            {order.date_due}
                                        </p>
                                    </div>
                                </>
                            );
                        }
                        if (order.prescription_client) {
                            return (
                                <>
                                    <div className="col-md-3">
                                        <h3 key={order.order_number}>
                                            #{order.order_number}
                                        </h3>
                                        <p>
                                            <strong>Status: </strong>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="col-md-5">
                                        <p className="el">
                                            {order.order_details}
                                        </p>
                                        <p>
                                            <strong>Pharmacy: </strong>
                                            {order.pharmacy}
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <p>
                                            <strong>Client: </strong>
                                            {
                                                order.prescription_client
                                                    .first_name
                                            }
                                        </p>
                                        <p>
                                            <strong>Due: </strong>
                                            {order.date_due}
                                        </p>
                                    </div>
                                </>
                            );
                        } else if (order.welfare_client) {
                            return (
                                <>
                                    <div className="col-md-3">
                                        <h3 key={order.order_number}>
                                            #{order.order_number}
                                        </h3>
                                        <p>
                                            <strong>Status: </strong>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="col-md-5">
                                        <p className="el">{order.notes}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p>
                                            <strong>Client: </strong>
                                            {order.welfare_client.first_name}
                                        </p>
                                        <p>
                                            <strong>Due: </strong>
                                            {order.date_due}
                                        </p>
                                    </div>
                                </>
                            );
                        }
                    })()}
                </div>
            ))}
        </>
    );
}
