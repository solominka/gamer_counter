import React from "react";

import "../App.css";


export const Help = (props) => {
    let {text, onClick} = props;
    return (
        <div className = {window.innerWidth > 650 ? "ParticipantCardBig help" : "ParticipantCardSmall help"}>
            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
                <span style={{"margin-right": "38%"}}><u>Помощь</u></span>
                <button
                    className = {window.innerWidth > 650 ? "button_exit_big" : "button_exit_small"}
                    onClick = {onClick}
                >x</button>
            </div>
            <div>{text}</div>
        </div>
    )
}
