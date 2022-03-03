import React from 'react';
import dayjs from "dayjs";
import axios from "axios";
import Cookies from "js-cookie";
import {SessionData} from "./interface/SessionData";
import {isMobile} from 'react-device-detect';
import { SessionCallbacks } from './interface/SessionCallbacks';
import {displaySessionErrors} from "./util/SessionErrorHandler";
import {EditSessionStateEnum} from "./enum/EditSessionStateEnum";

interface AddSessionProps {
    mobileEditSession?: SessionData;
    callbacks: SessionCallbacks;
    sessions: SessionData[];
}

interface AddSessionState {
    session: SessionData;
}

export class AddSession extends React.Component<AddSessionProps, AddSessionState> {

    defaultState = {
        session: {
            id: undefined,
            date: Date.now(),
            location: "",
            smallBlind: -1,
            bigBlind: -1,
            straddle: undefined,
            moneyIn: -1,
            moneyOut: -1
        }
    };

    constructor(props) {
        super(props);

        if (props.mobileEditSession) {
            this.state = {session: props.mobileEditSession};
        } else {
            this.state = this.defaultState;
        }
    }

    createSession() {
        const {date, location, smallBlind, bigBlind, straddle, moneyIn, moneyOut} = this.state.session;
        const {updateSessionsCallback, cancelAddSessionCallback, displaySuccessCallback, displayErrorCallback} = this.props.callbacks;

        if (date && location.length > 0 && smallBlind > 0 && bigBlind > 0 && moneyIn > 0 && moneyOut >= 0) {
            axios.post("/session/create",
                {
                    userSessionId: Cookies.get("sessionId"),
                    date: date,
                    location: location,
                    smallBlind: smallBlind,
                    bigBlind: bigBlind,
                    straddle: straddle || straddle > 0 ? straddle : -1,
                    moneyIn: moneyIn,
                    moneyOut: moneyOut
                })
                .then((res: any) => {
                    if (res.data) {
                        updateSessionsCallback(res.data.sessions);
                        this.setState(this.defaultState);
                        cancelAddSessionCallback();
                        displaySuccessCallback("Successfully added session");
                    } else {
                        displayErrorCallback("could not get response from server");
                    }
                }).catch((err) => {
                    displayErrorCallback("internal server error");
                });
        } else {
            displaySessionErrors(this.state.session, displayErrorCallback);
        }
    }

    saveSession(data: SessionData) {
        const {id, date, location, smallBlind, bigBlind, straddle, moneyIn, moneyOut} = data;
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
                        displaySuccessCallback("Successfully edited session");
                    } else {
                        displayErrorCallback("could not get response from server");
                    }
                }).catch((err) => {
                    displayErrorCallback("internal server error");
                });
        } else {
            displaySessionErrors(data, displayErrorCallback);
        }
    }

    render() {
        const {mobileEditSession, sessions} = this.props;
        const {session} = this.state;
        let locations = [];
        new Set(sessions.map((data) => data.location)).forEach((uniqueLocation) => locations.push(uniqueLocation));
        const locationOptions = locations.map((location) => <option key={location} value={location}/>);
        const containerClassName = isMobile ? "mb-3" : "input-group mb-3";
        const saveButton = <button type="button" className="btn btn-primary" onClick={() => {
            if (isMobile && mobileEditSession) {
                this.saveSession(this.state.session)
                this.props.callbacks.hideEditMobileSessionCallback();
                this.props.callbacks.cancelAddSessionCallback();
            }
            else this.createSession()
        }}>Save</button>;
        const cancelButton = <button type="button" className="btn btn-danger" onClick={() => {
            if (isMobile) this.props.callbacks.hideEditMobileSessionCallback();
            this.props.callbacks.cancelAddSessionCallback();
        }}>Cancel</button>;

        return (
            <div>
                <div className={containerClassName}>
                    <input type="date" className="form-control" defaultValue={dayjs(session.date).format( "YYYY-MM-DD")}
                           onChange={(ev) => this.setState({session: {...session, date: ev.target.valueAsNumber}})}/>
                    <input className="form-control" list="locationOptions" id="exampleDataList" placeholder="Location" defaultValue={session.location}
                           onChange={(ev) => this.setState({session: {...session, location: ev.target.value}})}/>
                    <datalist id="locationOptions">
                        {locationOptions}
                    </datalist>
                    <input type="number" className="cash-input form-control" placeholder="Small Blind" defaultValue={session.smallBlind >= 0 ? session.smallBlind : undefined}
                           onChange={(ev) => this.setState({session: {...session, smallBlind: ev.target.value ? parseFloat(ev.target.value) : undefined}})}/>
                    <input type="number" className="cash-input form-control" placeholder="Big Blind" defaultValue={session.bigBlind >= 0 ? session.bigBlind : undefined}
                           onChange={(ev) => this.setState({session: {...session, bigBlind: ev.target.value ? parseFloat(ev.target.value) : undefined}})}/>
                    <input type="number" className="cash-input form-control" placeholder="Straddle" defaultValue={session.straddle >= 0 ? session.straddle : undefined}
                           onChange={(ev) => this.setState({session: {...session, straddle: ev.target.value ? parseFloat(ev.target.value) : undefined}})}/>
                    <input type="number" className="cash-input form-control" placeholder="Buy In" defaultValue={session.moneyIn >= 0 ? session.moneyIn : undefined}
                           onChange={(ev) => this.setState({session: {...session, moneyIn: ev.target.value ? parseFloat(ev.target.value) : undefined}})}/>
                    <input type="number" className="cash-input form-control" placeholder="Cash Out" defaultValue={session.moneyOut >= 0 ? session.moneyOut : undefined}
                           onChange={(ev) => this.setState({session: {...session, moneyOut: ev.target.value ? parseFloat(ev.target.value) : undefined}})}/>
                    {
                        isMobile ?
                            <div className={"add-session-buttons"}>
                                {saveButton}
                                {cancelButton}
                            </div> :
                            <>{saveButton}{cancelButton}</>
                    }
                </div>
            </div>
        );
    }
}
export default AddSession;