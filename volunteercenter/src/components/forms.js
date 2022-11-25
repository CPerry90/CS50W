import React from "react";
import { detailsRoot, orderListRoot } from "./roots";
import { Orders } from "./clientOrders";
import { DetailsClose } from "./buttons";
var d = new Date();
var todaysDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

export class DeliveryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            date: todaysDate,
            client: this.props.client.id,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handleDate(event) {
        this.setState({ date: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch("api/new_order", {
            method: "POST",
            body: JSON.stringify({
                type: this.props.type,
                client: this.props.client.id,
                details: this.state.value,
                date: this.state.date,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                detailsRoot.render(<Empty />);
                document
                    .getElementById("client-details")
                    .classList.remove("hide-m");
                document.getElementById("order-details").style.display = "none";
                document.getElementById("client-orders").style.display = "none";
                orderListRoot.render(
                    <Orders isShow="True" user={this.state.client} />
                );
            });
    }
    render() {
        return (
            <div className="form-container fade-in">
                <DetailsClose client={this.state.client} />
                <h3>Fill out details below</h3>
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        value={this.state.value}
                        placeholder="Please fill out the order details."
                        onChange={this.handleChange}
                        className="delivery-form"
                    />
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
function Empty() {
    return <></>;
}
export class PrescForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            pharm: "",
            date: todaysDate,
            client: this.props.client.id,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePharm = this.handlePharm.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handlePharm(event) {
        this.setState({ pharm: event.target.value });
    }
    handleDate(event) {
        this.setState({ date: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        fetch("api/new_order", {
            method: "POST",
            body: JSON.stringify({
                type: this.props.type,
                client: this.props.client.id,
                details: this.state.value,
                pharm: this.state.pharm,
                date: this.state.date,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                detailsRoot.render(<Empty />);
                document
                    .getElementById("client-details")
                    .classList.remove("hide-m");
                document.getElementById("order-details").style.display = "none";
                document.getElementById("client-orders").style.display = "none";
                orderListRoot.render(
                    <Orders isShow="True" user={this.state.client} />
                );
            });
    }
    render() {
        return (
            <div className="form-container fade-in">
                <h3>Fill out details below</h3>
                <DetailsClose client={this.state.client} />
                <form onSubmit={this.handleSubmit}>
                    <textarea
                        value={this.state.value}
                        placeholder="Please fill out the order details."
                        onChange={this.handleChange}
                        className="delivery-form"
                    />
                    <input
                        value={this.state.pharm}
                        onChange={this.handlePharm}
                        placeholder="Which pharamacy?"
                    />
                    <div className="row no-margin mt-4">
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
