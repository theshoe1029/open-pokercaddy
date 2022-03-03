import React from 'react';
import Logo from './Logo';
import {FloatingInput} from "./FloatingInput";
import axios from "axios";
import BankrollInput from "../caddy/bankroll/BankrollInput";
import { BrowserView, MobileView } from 'react-device-detect';

interface UserProps {
    initBankrollCallback: Function;
}

interface UserState {
    isLogin: boolean;
    loginError: string;
    signUpError: string;
}

export class User extends React.Component<UserProps, UserState> {
    constructor(props: UserProps) {
        super(props);
        this.state = {isLogin: true, loginError: "", signUpError: ""};
    }

    logInButtonHandler() {
        if (this.state.isLogin) {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;
            axios.post("/user/login", {username, password})
                .then((res) => {
                    if (res.data) {
                        this.props.initBankrollCallback(res.data);
                    } else {
                        this.setState({isLogin: this.state.isLogin, loginError: "Error: invalid username or password"});
                    }
                }).catch((err) => {
                    this.setState({isLogin: this.state.isLogin, loginError: "Error: invalid username or password"});
                });
        } else {
            this.setState({isLogin: true, loginError: this.state.loginError})
        }
    }

    signUpButtonHandler() {
        if (!this.state.isLogin) {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;
            const bankroll = parseFloat((document.getElementById("bankroll") as HTMLInputElement).value);

            if (username.length == 0) {
                this.setState({isLogin: this.state.isLogin, signUpError: "Error: username cannot be blank"});
            } else if (password.length == 0) {
                this.setState({isLogin: this.state.isLogin, signUpError: "Error: password cannot be blank"});
            } else if (bankroll == NaN) {
                this.setState({isLogin: this.state.isLogin, signUpError: "Error: bankroll cannot be blank"});
            } else if (bankroll <= 0) {
                this.setState({isLogin: this.state.isLogin, signUpError: "Error: bankroll must be greater than 0"});
            } else {
                axios.post("/user/create", {username, password, initBankroll: bankroll})
                    .then((res) => {
                        if (res.data) {
                            this.props.initBankrollCallback(res.data);
                        } else {
                            this.setState({isLogin: this.state.isLogin, signUpError: "Error: server returned an invalid response"});
                        }
                    }).catch((err) => {
                    this.setState({isLogin: this.state.isLogin, signUpError: "Error: a user with that name already exists"});
                });
            }
        } else {
            this.setState({isLogin: false, signUpError: this.state.signUpError});
        }
    }

    render() {
        const logIn = (
            <div className="user-container">
                <div className="row user-inputs">
                    <FloatingInput id="username" placeholder="Username"/>
                    <FloatingInput id="password" placeholder="Password" password/>
                    <div className="login-error mb-3 link-danger">{this.state.loginError}</div>
                </div>
                <div className="row user-buttons align-items-start text-center">
                    <span className="col-5 user-button" onClick={() => this.logInButtonHandler()}>Log in</span>
                    <span className="col-2">or</span>
                    <span className="col-5 user-button" onClick={() => this.signUpButtonHandler()}>Sign up</span>
                </div>
            </div>
        );

        const signUp = (
            <div className="user-container">
                <div className="row user-inputs">
                    <FloatingInput id="username" placeholder="Username"/>
                    <FloatingInput id="password" placeholder="Password" password/>
                    <BankrollInput id="bankroll"/>
                    <div className="login-error mb-3 link-danger">{this.state.signUpError}</div>
                </div>
                <div className="row user-buttons align-items-start text-center">
                    <span className="col-5 user-button" onClick={() => this.signUpButtonHandler()}>Sign up</span>
                    <span className="col-2">or</span>
                    <span className="col-5 user-button" onClick={() => this.logInButtonHandler()}>Back to login</span>
                </div>
            </div>
        );

        return <div className="user-container">
            <BrowserView>
                <Logo width={250} height={200}/>
            </BrowserView>
            <MobileView>
                <Logo width={250} height={200}/>
            </MobileView>
            {this.state.isLogin ? logIn : signUp}
        </div>
    }
}
export default User;