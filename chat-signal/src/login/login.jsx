import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import logoImg from "../chatsignal.png"
import { message } from 'antd';

//TODO: implement authentication.
export const Login = () => {
    const [username, getUsername] = useState(0); // react hooks
    const [password, getPassword] = useState(0); // react hooks

    let history = useHistory();
    // NOTE: Will navigate to chatroom screen once isLoginVerified is set to true;
    let isLoginVerified = false;


    //TODO: implement authentication in authLoginInfo() below
    const authLoginInfo = () => {

        //if auth succeed
        isLoginVerified = true;
        //else{
        //     isLoginVerified = false;
        // }
    }

    function handleUsername(event) {
        getUsername(event.target.value);
    }

    function handlePassword(event) {
        getPassword(event.target.value);
    }

    const onLoginPressed = () => {
        var JSONpackage = {username : username, password : password}
        console.log(JSONpackage); // here's the information in JSON format
        authLoginInfo();

        if (isLoginVerified) {
            history.push('/chatroom');
            message.success('Logged in successfully. Start chatting!')
        } else {
            message.error('Login failed. Please try again.');
        }
    }
    return (
        <div className="base-container">
            <div className="content">
                <div className="image">
                    <img src={logoImg} alt="Logo" />
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" placeholder="username" onChange = {handleUsername}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" placeholder="password" onChange = {handlePassword}/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button onClick={onLoginPressed} type="button" className="btn">
                    Login
                </button>
            </div>
        </div>
    )
};
