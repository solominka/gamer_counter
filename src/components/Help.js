import React from "react";

import "../App.css";


export const Help = (props) => {
    let {text} = props;
    return (
        <div
            className = {window.innerWidth > 650 ? "helpBig" : "helpSmall"}
        >
            {text}
        </div>
    )
}
