import React from "react";
import { BrowserView, MobileView } from "react-device-detect";

interface BankrollInputProps {
    id: String;
}

interface BankrollInputState {
    isSelected: boolean;
}


export class BankrollInput extends React.Component<BankrollInputProps, BankrollInputState> {

    constructor(props) {
        super(props);
        this.state = {isSelected: false};
    }

    render() {
        const id = this.props.id.toString();

        return (
            <>
                <BrowserView>
                    <div className={`row mb-3 floating-input`}>
                        <div className="col-7 floating-input-placeholder">Bankroll</div>
                        <div className={"col-1 floating-input-placeholder"}>$</div>
                        <input className="col-4 bankroll-input-field" type="number" id={id} defaultValue={1000}/>
                    </div>
                </BrowserView>
                <MobileView>
                    <div className={`row mb-3 floating-input`}>
                        <div id='bankroll-label' className="col-7 floating-input-placeholder">Bankroll $</div>
                        <input className="col bankroll-input-field" type="number" id={id} defaultValue={1000}/>
                    </div>
                </MobileView>
            </>
        );
    }
}
export default BankrollInput;