import React from "react";

interface FloatingInputProps {
    id: String;
    placeholder: String;
    password?: boolean;
}

interface FloatingInputState {
    isSelected: boolean;
}


export class FloatingInput extends React.Component<FloatingInputProps, FloatingInputState> {

    constructor(props) {
        super(props);
        this.state = {isSelected: false};
    }

    focusInput() {
        const id = this.props.id.toString();
        this.setState({isSelected: true});
        setTimeout(() => document.getElementById(id).focus(), 500);
    }

    unFocusInput() {
        const id = this.props.id.toString();
        const inputField = document.getElementById(id) as HTMLInputElement;
        if (inputField.value.length == 0) {
            this.setState({isSelected: false});
        }
    }

    render() {
        const { placeholder, password } = this.props;
        const id = this.props.id.toString();
        const placeholderClassName = this.state.isSelected ? "placeholder-selected floating-input-placeholder" : "floating-input-placeholder";
        const inputClassName = this.state.isSelected ? "floating-input-field" : "hidden-input-field";

        return (
            <div className={`mb-3 floating-input`}>
                <div className={placeholderClassName} onClick={() => this.focusInput()}>{placeholder}</div>
                <input type={password ? "password" : "text"} id={id} className={inputClassName} onBlur={() => this.unFocusInput()}/>
            </div>
        );
    }
}
export default FloatingInput;