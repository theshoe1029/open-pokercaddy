import React from 'react';
import {SessionData} from "./session/interface/SessionData";

interface StatsProps {
    sessions: SessionData[];
}

interface StatsState {
}

export class Stats extends React.Component<StatsProps, StatsState> {

    render() {
        const { sessions } = this.props;
        let profitLossSymbol = "+/-";
        let avgSessionClassName = "";
        let avgSession = "0";
        let avgSessionBB = "0";

        const profitLoss = sessions.reduce((prevSum, data) => prevSum + (data.moneyOut-data.moneyIn), 0);
        const profitLossBB = sessions
            .reduce((prevSum, data) => prevSum + Math.round((data.moneyOut-data.moneyIn) / (data.straddle > -1 ? data.straddle : data.bigBlind)), 0);
        if (sessions.length > 0) {
            avgSession = Math.abs((profitLoss/sessions.length)).toFixed(2);
            avgSessionBB = String(Math.abs(Math.round(profitLossBB/sessions.length)));
            if (profitLoss > 0) {
                profitLossSymbol = "+";
                avgSessionClassName = "etch-success-color";
            } else if (profitLoss < 0) {
                profitLossSymbol = "-";
                avgSessionClassName = "etch-error-color";
            }
        }

        return (
            <div id="stats" className={"etched-text"}>
                <span>Total sessions {sessions.length}</span>
                <div className="w-100 d-block d-sm-none"></div>
                <span className={"ms-4"}>Avg session <span className={avgSessionClassName}>{profitLossSymbol}${avgSession} <span className={"small-text"}>or</span> {profitLossSymbol}{avgSessionBB}BB</span></span>
            </div>
        );
    }
}
export default Stats;