import React from "react";

import "../App.css";


export const PlusButton = (props) => {
    const { onClick } = props;
    return (
        <button
            className = {window.innerWidth > 650 ? "button_big" : "button_small"}
            onClick = {onClick}
        >
            +
        </button>
    )
}

export const MinusButton = (props) => {
    const { onClick } = props;
    return (
        <button
            className = {window.innerWidth > 650 ? "button_big" : "button_small minus"}
            onClick = {onClick}
        >
            -
        </button>
    )
}
