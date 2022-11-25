import React from "react";
import { detailsRoot, orderListRoot } from "./roots";
import { Orders } from "./clientOrders";
import { DeliveryForm, PrescForm } from "./forms";
import { SelectClose } from "./buttons";

export function NewOrderDiv(props) {
    console.log(props);
    return (
        <div className="row client-row fade-in" id="">
            <div className="col-md-12" id="form">
                <TypeSelect client={props.props.client} root={props.root} />
            </div>
        </div>
    );
}

function OrderFormLoader(props) {
    if (props.type == "delivery" || props.type == "welfare") {
        return (
            <div>
                <DeliveryForm type={props.type} client={props.client} />
            </div>
        );
    } else if (props.type == "prescription") {
        return (
            <div>
                <PrescForm type={props.type} client={props.client} />
            </div>
        );
    }
}

function OrderForm(props, client) {
    detailsRoot.render(<OrderFormLoader type={props} client={client} />);
}

class TypeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "", client: this.props.client };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.root.unmount();
        orderListRoot.render(<Orders isShow="False" />);
        document.getElementById("client-orders").style.display = "none";
        document.getElementById("client-details").classList.add("hide-m");
        OrderForm(event.target.value, this.props.client);
        event.preventDefault();
    }

    render() {
        return (
            <div className="select-form">
                <h5 className="mb-3">Order Type</h5>
                <form onSubmit={this.handleSubmit}>
                    <select
                        name="order-select"
                        id="order-select"
                        value={this.state.value}
                        onChange={this.handleChange}>
                        <option value="">Select Type</option>
                        <option value="delivery">Delivery</option>
                        <option value="prescription">Prescription</option>
                        <option value="welfare">Welfare</option>
                    </select>
                </form>
                <SelectClose root={this.props.root} />
            </div>
        );
    }
}
