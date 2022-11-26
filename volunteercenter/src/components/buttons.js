import React from "react";
import { detailsRoot, orderListRoot } from "./roots";
import { Orders } from "./clientOrders";

export function Exit() {
    function clickHandler() {
        window.location.reload();
    }
    return (
        <div onClick={clickHandler} className="hover pointer my-3">
            <h3>
                Close Client
                <i className="ml-2 fa-regular fa-circle-xmark"></i>
            </h3>
        </div>
    );
}
function Empty() {
    return <></>;
}
export function DetailsClose(props) {
    function close() {
        detailsRoot.render(<Empty />);
        document.getElementById("info-pannel").classList.remove("hide-m");
        document.getElementById("client-details").classList.remove("hide-m");
        document.getElementById("order-details").style.display = "none";
        document.getElementById("client-orders").style.display = "none";
        orderListRoot.render(<Orders isShow="True" user={props.client} />);
    }
    return (
        <i
            onClick={close}
            className="float-right fa-regular fa-2x fa-circle-xmark pointer"></i>
    );
}

export function SelectClose(props) {
    function close() {
        props.root.unmount();
        document.getElementById("order-details").style.display = "none";
        document.getElementById("client-orders").style.display = "none";
        orderListRoot.render(<Orders isShow="True" />);
    }
    return (
        <div>
            <i
                onClick={close}
                className="mt-3 fa-regular fa-2x fa-circle-xmark pointer"></i>
        </div>
    );
}
