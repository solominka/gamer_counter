import React from "react";

import {ParticipantCard} from './ParticipantCard';
import "../App.css";

export const ParticipantCardList = (props) => {
  const {items, onClickPlus, onClickMinus, onChangeName } = props
  if (items === undefined)
    return "";

  return (
      <ul className="notes">
        {
          items.sort((l, r) => r.score - l.score).map((item, index) => (
              <ParticipantCard
                  index           = { index }
                  participantId   = { item.id }
                  name            = { item.name }
                  score           = { item.score }
                  onClickPlus     = { onClickPlus(item.id) }
                  onClickMinus    = { onClickMinus(item.id) }
                  onChangeName    = { onChangeName(item.id) }
              />
          ))
        }
      </ul>
  )
}


