import React from 'react';
import {SessionData} from "./session/interface/SessionData";
import AddSession from "./session/AddSession";
import SessionsTable from "./session/SessionsTable";
import Bankroll from "./bankroll/Bankroll";
import Stats from "./Stats";
import AlertMessage, {AlertStyleEnum} from "./AlertMessage";

interface CaddyProps {
    logOutCallback: Function;
    updateSessionsCallback: Function;
    sessions: SessionData[];
    bankroll: number;
}

interface CaddyState {
    mobileEditSession: SessionData;
    showMobileEditSession: boolean;
    showAddSession: boolean;
    alertStyle: AlertStyleEnum;
    alertMessage: string;

}

export class Caddy extends React.Component<CaddyProps, CaddyState> {

    constructor(props) {
        super(props);
        this.state = {mobileEditSession: null, showMobileEditSession: false, showAddSession: false, alertStyle: AlertStyleEnum.NONE, alertMessage: ""};
        this.hideAlertCallback.bind(this);
        this.hideEditMobileSessionCallback.bind(this);
        this.displayEditMobileSessionCallback.bind(this);
        this.displaySuccessCallback.bind(this);
        this.displayErrorCallback.bind(this);
    }

    hideAlertCallback() {
        this.setState({alertStyle: AlertStyleEnum.NONE});
    }

    hideEditMobileSessionCallback() {
        this.setState({showMobileEditSession: false});
    }

    displayEditMobileSessionCallback(session) {
        this.setState({mobileEditSession: session, showMobileEditSession: true});
    }

    displaySuccessCallback(message) {
        this.setState({alertStyle: AlertStyleEnum.SUCCESS, alertMessage: message});
    }

    displayErrorCallback(message) {
        this.setState({alertStyle: AlertStyleEnum.ERROR, alertMessage: message});
    }

    render() {
        const { bankroll, sessions, logOutCallback, updateSessionsCallback } = this.props;
        const callbacks = {
            updateSessionsCallback: updateSessionsCallback,
            cancelAddSessionCallback: () => this.setState({showAddSession: false}),
            hideAlertCallback: () => this.hideAlertCallback(),
            hideEditMobileSessionCallback: () => this.hideEditMobileSessionCallback(),
            displayEditMobileSessionCallback: (session) => this.displayEditMobileSessionCallback(session),
            editMobileSessionCallback: () => console.log('edit mobile session callback has not been set'),
            displaySuccessCallback: (message) => this.displaySuccessCallback(message),
            displayErrorCallback: (message) => this.displayErrorCallback(message)
        }
        const addSessionElement = this.state.showAddSession || this.state.showMobileEditSession ?
            <AddSession
                mobileEditSession={this.state.mobileEditSession}
                sessions={sessions}
                callbacks={callbacks}
            /> :
            <button id="add-session-button" type="button" className="btn btn-success" onClick={() => this.setState({showAddSession: true})}>Add session</button>;
        if (this.state.alertStyle == AlertStyleEnum.SUCCESS) {
            setTimeout(() => document.getElementById("alert-success").style.opacity = "0", 1000);
        }
        return (
            <div className="container">
                <Bankroll bankroll={bankroll} sessions={sessions}/>
                <AlertMessage style={this.state.alertStyle} message={this.state.alertMessage}/>
                <SessionsTable
                    showMobileEditSession={this.state.showMobileEditSession}
                    sessions={sessions}
                    callbacks={callbacks}
                />
                <Stats sessions={sessions}/>
                {addSessionElement}
                <div className="col-5 log-out-button" onClick={() => logOutCallback()}>Log out</div>
            </div>
        );
    }
}
export default Caddy;