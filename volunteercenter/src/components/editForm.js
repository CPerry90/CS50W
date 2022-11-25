import React from "react";
import { OrderDetails } from "./orderDetails";
var d = new Date();
var todaysDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
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

export class EditDeliveryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
        };
        var regex = /[,]/g;
        let dateArray = this.props.date.split(" ");
        let day = dateArray[0];
        let year = dateArray[2];
        let month = dateArray[1].replace(regex, "");
        let dateDue = year + "-" + (months.indexOf(month) + 1) + "-" + day;
        this.state = {
            value: props.orderDetails,
            date: dateDue,
            order: props.order,
            pharmacy: props.pharmacy,
            type: props.type,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handlePharm = this.handlePharm.bind(this);
    }
    handlePharm(event) {
        this.setState({ pharmacy: event.target.value });
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handleDate(event) {
        this.setState({ date: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch("api/order_update", {
            method: "POST",
            body: JSON.stringify({
                order: this.state.order,
                content: this.state.value,
                date: this.state.date,
                pharmacy: this.state.pharmacy,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                document.getElementById("order-details").style.display = "none";
                OrderDetails(this.state.order, "False");
            });
    }
    render() {
        return (
            <div className="form-container">
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        value={this.state.value}
                        placeholder="Please fill out the order details."
                        onChange={this.handleChange}
                        className="delivery-form"
                    />
                    {(() => {
                        if (this.state.type == "pharmacy") {
                            return (
                                <input
                                    value={this.state.pharmacy}
                                    onChange={this.handlePharm}
                                />
                            );
                        }
                    })()}
                    <div className="row no-margin">
                        <div className="col-md-6">
                            <strong>Choose a date: </strong>
                            <br></br>
                            <input
                                type="date"
                                id="start"
                                onChange={this.handleDate}
                                name="trip-start"
                                value={this.state.date}
                                min={todaysDate}
                            />
                        </div>
                        <div className="col-md-6">
                            <button
                                type="submit"
                                id="completed-task"
                                className="fabutton">
                                <strong className="mt-2">Submit </strong>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
