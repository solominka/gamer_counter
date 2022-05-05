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

  let placeholder = name.length === 0 ? "Участник " + (participantId+1) : name;

  return (
      <li
          key       = { participantId }
          className = "ParticipantCard"
      >
          <input
              id={"name"+index}
              // onChange={f}
              onFocus={() => {placeholder = "";}}
              onBlur={() => {f(); placeholder = "Участник " + (participantId+1);}}
              placeholder={placeholder}
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
