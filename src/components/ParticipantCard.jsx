import React from "react";

import "../App.css";
import { PlusButton, MinusButton } from "./Buttons";

export const ParticipantCard = (props) => {
  let { index, participantId, name, score, onClickPlus, onClickMinus, onChangeName } = props;
  let f = () => {
      let input = document.getElementById("name"+index);
      if (input !== null && input.value.length > 0) {
          onChangeName(input.value)();
          input.value = "";
      }
  }

  let placeholder = name.length === 0 ? "Участник " + (participantId+1) : name;

  return (
      <div
          key       = { participantId }
          id        = { participantId }
          className = {window.innerWidth > 650 ? "ParticipantCardBig transition" : "ParticipantCardSmall transition"}
      >
          <input
              id={"name"+index}
              onFocus={() => {
                  placeholder = "";
                  if (window.innerWidth < 600) {
                      document.getElementById(participantId).scrollIntoView({block: "start", behavior: "smooth"});
                  }
              }}
              onBlur={() => {
                  f();
                  placeholder = "Участник " + (participantId+1);
              }}
              placeholder={placeholder}
              className = {window.innerWidth > 650 ? "ParticipantNameBig" : "ParticipantNameSmall"}
          />

          <span
            className={window.innerWidth > 650 ? "" : "span_small"}
          >
              {score}
              <PlusButton onClick={onClickPlus}/>
              <MinusButton onClick={onClickMinus}/>
          </span>
      </div>
  )
}
