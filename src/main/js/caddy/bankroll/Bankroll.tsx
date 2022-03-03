import React from 'react';
import {SessionData} from "../session/interface/SessionData";
import Logo from "../../login/Logo";

interface BankrollProps {
    sessions: SessionData[];
    bankroll: number;
}

interface BankrollState {
}

export class Bankroll extends React.Component<BankrollProps, BankrollState> {

    render() {
        const { bankroll, sessions } = this.props;
        const profitLoss = sessions.reduce((prevSum, data) => prevSum + (data.moneyOut-data.moneyIn), 0);
        const currentBankroll = bankroll + profitLoss;

        let profitLossSymbol = "+/-";
        let profitLossClassName = "";
        if (profitLoss > 0) {
            profitLossSymbol = "+";
            profitLossClassName = "etch-success-color";
        } else if (profitLoss < 0) {
            profitLossSymbol = "-";
            profitLossClassName = "etch-error-color";
        }

        return (
            <div id="bankroll" className="etched-text container">
                <span id="starting-bankroll">Starting bankroll: ${bankroll}</span>
                <div className="w-100 d-block d-sm-none"></div>
                <span id="starting-bankroll">Current bankroll: ${currentBankroll}</span>
                <span className={profitLossClassName} id="performance">({profitLossSymbol}${Math.abs(profitLoss)})</span>
            </div>
        );
    }
}
export default Bankroll;