import React, { useEffect } from "react";
import { cta } from "../main";
import { OrderDetails } from "./orderDetails";

function OpDetails(props) {
    if (props.operation.length > 0) {
        return (
            <div className="my-3 detail-list col-md-12 d-block">
                <h1 id="client">{props.name}</h1>
                <hr></hr>
                {props.operation.map((item) => (
                    <div
                        className={item.status}
                        onClick={() => OrderDetails(item.order_number, "False")}
                        key={item.id}
                        id="info">
                        <div className="row no-margin">
                            <div className="col-md-8">
                                <h3 key={item.order_number}>
                                    Order #{item.order_number}
                                </h3>
                            </div>
                            <div className="col-md-4">
                                <div className="status">
                                    <h5>Status: </h5>
                                    <p className="cap">{item.status}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row no-margin">
                            {(() => {
                                if (props.name == "Deliveries") {
                                    return (
                                        <div className="col-md-6">
                                            <p className="el" key={item.order}>
                                                {item.order}
                                            </p>
                                        </div>
                                    );
                                } else if (props.name == "Prescriptions") {
                                    return (
                                        <div className="col-md-6">
                                            <p
                                                className="el"
                                                key={item.order_details}>
                                                {item.order_details}
                                            </p>
                                            <p
                                                className="el"
                                                key={item.pharmacy}>
                                                <strong>Pharmacy: </strong>
                                                {item.pharmacy}
                                            </p>
                                        </div>
                                    );
                                } else if (props.name == "Welfare") {
                                    return (
                                        <div className="col-md-6">
                                            <p className="el" key={item.notes}>
                                                {item.notes}
                                            </p>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="my-3 detail-list col-md-12 d-block">
                <h1 id="client">{props.name}</h1>
                <hr></hr>
                <h4>No Orders</h4>
            </div>
        );
    }
}

export function Orders(props) {
    cta();
    if (props.isShow == "True") {
        document.getElementById("client-orders").style.display = "block";
        const [deliveries, setDeliveries] = React.useState([]);
        const [prescriptions, setPresscriptions] = React.useState([]);
        const [welfares, setWelfares] = React.useState([]);

        useEffect(() => {
            fetch(`api/client_details/${props.user}`, {
                method: "POST",
                id: "",
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.msg) {
                        console.log(data.msg);
                    } else {
                        if (data.data.delivery) {
                            setDeliveries(data.data.delivery);
                        }
                        if (data.data.prescription) {
                            setPresscriptions(data.data.prescription);
                        }
                        if (data.data.welfare) {
                            setWelfares(data.data.welfare);
                        }
                    }
                });
        }, []);
        return (
            <div className="row client-row" id="">
                <OpDetails name="Deliveries" operation={deliveries} />
                <OpDetails name="Prescriptions" operation={prescriptions} />
                <OpDetails name="Welfare" operation={welfares} />
            </div>
        );
    }
}
