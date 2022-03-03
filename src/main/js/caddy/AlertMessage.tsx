import React from 'react';

export enum AlertStyleEnum {
    NONE, ERROR, SUCCESS
}

interface AlertMessageProps {
    style: AlertStyleEnum;
    message: string;
}

interface AlertMessageState {
}

export class AlertMessage extends React.Component<AlertMessageProps, AlertMessageState> {

    render() {
        const {style, message} = this.props;

        switch (style) {
            case AlertStyleEnum.NONE:
                return <div></div>;
            case AlertStyleEnum.ERROR:
                return <div id="alert-error" className={"alert-message etch-error-color"}>Error: {message}</div>;
            case AlertStyleEnum.SUCCESS:
                return <div id="alert-success" className={"alert-message etch-success-color"}>{message}</div>;
        }
    }
}
export default AlertMessage;