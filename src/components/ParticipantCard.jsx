import React from "react";

import "../App.css";
import { PlusButton, MinusButton } from "./Buttons";

export const ParticipantCard = (props) => {
  let { index, participantId, name, score, onClickPlus, onClickMinus, onChangeName } = props;
  let f = () => {
      let input = document.getElementById("name"+index);
      if (input !== null)
          onChangeName(input.value)();
  }

  return (
      <li
          key       = { participantId }
          className = "ParticipantCard"
      >
          <input
              id={"name"+index}
              onChange={f}
              placeholder={name}
              className = "ParticipantName"
          />

          <span>
              {score}
              <PlusButton onClick={onClickPlus}/>
              <MinusButton onClick={onClickMinus}/>
          </span>
      </li>
  )
}
