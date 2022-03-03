import React from 'react';
import Session from "./Session";
import {SessionData} from "./interface/SessionData";
import {SessionCallbacks} from "./interface/SessionCallbacks";

interface SessionsTableProps {
    showMobileEditSession: boolean;
    callbacks: SessionCallbacks
    sessions: SessionData[];
}

interface SessionsTableState {
}

export class SessionsTable extends React.Component<SessionsTableProps, SessionsTableState> {

    render() {
        const {sessions, callbacks} = this.props;
        let locations = [];
        new Set(sessions.map((data) => data.location)).forEach((uniqueLocation) => locations.push(uniqueLocation));
        const locationOptions = locations.map((location) => <option key={location} value={location}/>);
        const sessionElements = sessions
            .sort((sessionA, sessionB) => new Date(sessionB.date).getTime() - new Date(sessionA.date).getTime())
            .map((sessionData) =>
                <Session
                    showMobileEditSession={this.props.showMobileEditSession}
                    key={sessionData.id}
                    data={sessionData}
                    locationOptions={locationOptions}
                    callbacks={callbacks}
                />);

        return (
            <div id={"sessions-table-wrapper"} className={"table-responsive"}>
                <table id="sessions-table" className="table">
                    <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Location</th>
                        <th className="cash-col" scope="col">Small Blind</th>
                        <th className="cash-col" scope="col">Big Blind</th>
                        <th className="cash-col" scope="col">Straddle</th>
                        <th className="cash-col" scope="col">Buy In</th>
                        <th className="cash-col" scope="col">Cash Out</th>
                        <th className="cash-col" scope="col">Profit/Loss</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                        {sessionElements}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default SessionsTable;