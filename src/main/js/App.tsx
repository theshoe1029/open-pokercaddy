import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import User from './login/User';
import Bankroll from './caddy/bankroll/Bankroll';
import axios from "axios";
import {Caddy} from "./caddy/Caddy";
import {SessionData} from "./caddy/session/interface/SessionData";

interface AppProps {
}

interface AppState {
    initialized: boolean;
    sessions: SessionData[];
    bankroll: number;
}

class App extends React.Component<AppProps, AppState> {

    constructor(props) {
        super(props);
        this.state = {initialized: false, sessions: undefined, bankroll: undefined};
        this.initBankroll.bind(this);
        this.logOut.bind(this);
        this.updateSessions.bind(this);
    }

    componentDidMount() {
        if (Cookies.get("sessionId")) {
            this.getBankroll();
            if (!this.state.sessions && !this.state.bankroll) {
                Cookies.remove("sessionId");
            }
        }
        this.setState({initialized: true});
    }

    initBankroll(data) {
        const sessionId = data.sessionId;
        const sessions = data.sessions;
        const bankroll = data.bankroll;
        if (Cookies.get("sessionId") == undefined) {
            Cookies.set("sessionId", sessionId);
        }
        this.setState({sessions, bankroll});
    }

    getBankroll() {
        axios.post("/user/get", {sessionId: Cookies.get("sessionId")})
            .then((res) => {
                if (res.data) {
                    this.initBankroll(res.data);
                } else {
                    this.logOut();
                }
            }).catch((err) => {
                this.logOut();
            });
    }

    logOut() {
        Cookies.remove("sessionId");
        this.setState({sessions: undefined, bankroll: undefined});
    }

    updateSessions(sessions: SessionData[]) {
        this.setState({sessions})
    }

    render() {
        if (this.state.initialized) {
            return this.state.sessions && this.state.bankroll ?
                <Caddy
                    logOutCallback={() => this.logOut()}
                    updateSessionsCallback={(sessions) => this.updateSessions(sessions)}
                    sessions={this.state.sessions}
                    bankroll={this.state.bankroll}
                /> :
                <User initBankrollCallback={(data) => this.initBankroll(data)}/>;
        }
        return <></>;
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);