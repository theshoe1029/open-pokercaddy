import React from 'react';
import dayjs from "dayjs";
import {SessionData} from "./interface/SessionData";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faEdit, faTimes, faTrash} from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import Cookies from "js-cookie";
import {EditSessionStateEnum} from './enum/EditSessionStateEnum';
import {SessionCallbacks} from "./interface/SessionCallbacks";
import {isMobile} from "react-device-detect";
import {displaySessionErrors} from "./util/SessionErrorHandler";

var utc = require('dayjs/plugin/utc');

interface SessionProps {
    showMobileEditSession: boolean;
    callbacks: SessionCallbacks
    data: SessionData;
    locationOptions: JSX.Element[];
}

interface SessionState {
    editSessionData: SessionData;
    editState: EditSessionStateEnum;
}

export class Session extends React.Component<SessionProps, SessionState> {

    constructor(props) {
        super(props);

        this.state = {editSessionData: this.props.data, editState: EditSessionStateEnum.NONE};
    }

    componentDidUpdate(prevProps: Readonly<SessionProps>) {
        if (prevProps.showMobileEditSession && !this.props.showMobileEditSession) {
            this.setState({editState: EditSessionStateEnum.NONE});
        }
    }

    deleteSession(data: SessionData) {
        const {updateSessionsCallback, displaySuccessCallback, displayErrorCallback} = this.props.callbacks;

        axios.post("/session/delete", {userSessionId: Cookies.get("sessionId"), sessionId: data.id})
            .then((res: any) => {
                if (res.data) {
                    updateSessionsCallback(res.data.sessions);
                    displaySuccessCallback("Successfully deleted session");
                } else {
                    displayErrorCallback("could not get response from server");
                }
            }).catch((err) => {
                displayErrorCallback("internal server error");
            });
    }

    saveSession() {
        const {id, date, location, smallBlind, bigBlind, straddle, moneyIn, moneyOut} = this.state.editSessionData;
        const {updateSessionsCallback, displaySuccessCallback, displayErrorCallback} = this.props.callbacks;

        if (date && location.length > 0 && smallBlind > 0 && bigBlind > 0 && moneyIn > 0 && moneyOut >= 0) {
            axios.post("/session/edit",
                {
                    userSessionId: Cookies.get("sessionId"),
                    sessionId: id,
                    date: new Date(date).getTime(),
                    location,
                    smallBlind,
                    bigBlind,
                    straddle: straddle || straddle > 0 ? straddle : -1,
                    moneyIn,
                    moneyOut
                })
                .then((res: any) => {
                    if (res.data) {
                        updateSessionsCallback(res.data.sessions);
                        this.setState({editSessionData: this.props.data, editState: EditSessionStateEnum.NONE});
                        displaySuccessCallback("Successfully edited session");
                    } else {
                        displayErrorCallback("could not get response from server");
                    }
                }).catch((err) => {
                    displayErrorCallback("internal server error");
                });
        } else {
            displaySessionErrors(this.state.editSessionData, displayErrorCallback);
        }
    }

    updateSessionData(field, value) {
        const updatedData = Object.assign({}, this.state.editSessionData);
        updatedData[field] = value;
        this.setState({editSessionData: updatedData});
    }

    renderCol(editState, editCol, dataCol) {
        if (isMobile) {
            return editState == EditSessionStateEnum.EDIT ? '-' : dataCol;
        } else {
            return editState == EditSessionStateEnum.EDIT ? editCol : dataCol;
        }
    }

    render() {
        const {editState} = this.state;
        const {data, locationOptions} = this.props;

        const hasMandatoryStraddle = data.straddle != -1;

        let profitLoss;
        let profitLossClassName = "cash-col";
        if (data.moneyOut == data.moneyIn) {
            profitLoss = "+/-$0";
        } else if (data.moneyOut > data.moneyIn) {
            profitLoss = "+$" + Math.abs(data.moneyOut - data.moneyIn);
            profitLossClassName = "cash-col win-color";
        } else {
            profitLoss = "-$" + Math.abs(data.moneyOut - data.moneyIn);
            profitLossClassName = "cash-col loss-color";
        }

        const editButton = (
            <td className="btn-col">
                <button className={"btn btn-primary"} onClick={() => {
                    if (isMobile) this.props.callbacks.displayEditMobileSessionCallback(data);
                    this.setState({editState: EditSessionStateEnum.EDIT});
                }}>
                    <FontAwesomeIcon icon={faEdit} size={"sm"}/>
                </button>
            </td>
        );

        const saveButton = (
            <td className="btn-col">
                <button className={"btn btn-primary"} onClick={() => this.saveSession()}>
                    <FontAwesomeIcon icon={faCheck} size={"sm"}/>
                </button>
            </td>
        );

        const deleteButton = (
            <td className="btn-col">
                <button className={"btn btn-danger"} onClick={() => this.setState({editState: EditSessionStateEnum.DELETE})}>
                    <FontAwesomeIcon icon={faTrash} size={"sm"}/>
                </button>
            </td>
        );

        const confirmButton = (
            <td className="btn-col">
                <button className={"btn btn-danger"} onClick={() => this.deleteSession(data)}>
                    <FontAwesomeIcon icon={faCheck} size={"sm"}/>
                </button>
            </td>
        );

        const cancelButton = (
            <td className="btn-col">
                <button className={"btn btn-warning"} onClick={() => {this.setState({editState: EditSessionStateEnum.NONE})}}>
                    <FontAwesomeIcon icon={faTimes} size={"sm"}/>
                </button>
            </td>
        );

        dayjs.extend(utc);
        // @ts-ignore
        const displayTime = dayjs(data.date).utc().format("MM/DD/YYYY");
        const editTime = (
            // @ts-ignore
            <input type="date" className="form-control" defaultValue={dayjs(this.state.editSessionData.date).utc().format( "YYYY-MM-DD")}
                   onChange={(ev) => this.updateSessionData("date", ev.target.valueAsNumber)}/>

        );

        const displayLocation = data.location;
        const editLocation = (
            <>
                <input className="form-control" list="locationOptions" id="exampleDataList" placeholder="Location" value={this.state.editSessionData.location}
                       onChange={(ev) => this.updateSessionData("location", ev.target.value)}/>
                <datalist id="locationOptions">
                    {locationOptions}
                </datalist>
            </>
        );

        const displaySmallBlind = `\$${data.smallBlind}`;
        const editSmallBlind = (
            <input type="number" className="cash-input form-control" placeholder="Small Blind" value={this.state.editSessionData.smallBlind}
                   onChange={(ev) => this.updateSessionData("smallBlind", ev.target.value ? parseFloat(ev.target.value) : "")}/>
        );

        const displayBigBlind = `\$${data.bigBlind}`;
        const editBigBlind = (
            <input type="number" className="cash-input form-control" placeholder="Big Blind" value={this.state.editSessionData.bigBlind}
                   onChange={(ev) => this.updateSessionData("bigBlind", ev.target.value ? parseFloat(ev.target.value) : "")}/>
        );

        const displayStraddle = hasMandatoryStraddle ? `\$${data.straddle}` : "-";
        const editStraddle = (
            <input type="number" className="cash-input form-control" placeholder="Straddle" value={this.state.editSessionData.straddle > -1 ? this.state.editSessionData.straddle : ""}
                   onChange={(ev) => this.updateSessionData("straddle", ev.target.value ? parseFloat(ev.target.value) : "")}/>
        );

        const displayMoneyIn = `\$${data.moneyIn}`;
        const editMoneyIn = (
            <input type="number" className="cash-input form-control" placeholder="Buy In" value={this.state.editSessionData.moneyIn}
                   onChange={(ev) => this.updateSessionData("moneyIn", ev.target.value ? parseFloat(ev.target.value) : "")}/>
        );

        const displayMoneyOut = `\$${data.moneyOut}`;
        const editMoneyOut = (
            <input type="number" className="cash-input form-control" placeholder="Cash Out" value={this.state.editSessionData.moneyOut}
                   onChange={(ev) => this.updateSessionData("moneyOut", ev.target.value ? parseFloat(ev.target.value) : "")}/>
        );

        let lButton, rButton;
        switch (this.state.editState) {
            case EditSessionStateEnum.NONE:
                lButton = editButton;
                rButton = deleteButton;
                break;
            case EditSessionStateEnum.DELETE:
                lButton = confirmButton;
                rButton = cancelButton;
                break;
            case EditSessionStateEnum.EDIT:
                if (isMobile) {
                    lButton = <td>Editing...</td>;
                    rButton = <td></td>;
                } else {
                    lButton = saveButton;
                    rButton = cancelButton;
                }
                break;
        }

        return (
            <tr>
                <td>{this.renderCol(editState, editTime, displayTime)}</td>
                <td>{this.renderCol(editState, editLocation, displayLocation)}</td>
                <td className="cash-col">{this.renderCol(editState, editSmallBlind, displaySmallBlind)}</td>
                <td className="cash-col">{this.renderCol(editState, editBigBlind, displayBigBlind)}</td>
                <td className={hasMandatoryStraddle ? "cash-col" : "cash-col no-straddle"}>{this.renderCol(editState, editStraddle, displayStraddle)}</td>
                <td className="cash-col">{this.renderCol(editState, editMoneyIn, displayMoneyIn)}</td>
                <td className="cash-col">{this.renderCol(editState, editMoneyOut, displayMoneyOut)}</td>
                <td className={profitLossClassName}>{this.renderCol(editState, <></>, profitLoss)}</td>
                {lButton}
                {rButton}
            </tr>
        );
    }
}
export default Session;