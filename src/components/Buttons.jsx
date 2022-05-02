import React from "react";

import "../App.css";


export const PlusButton = (props) => {
    const { onClick } = props;
    return (
        <button
            className = "plus_button"
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
            className = "minus_button"
            onClick = {onClick}
        >
            -
        </button>
    )
}
