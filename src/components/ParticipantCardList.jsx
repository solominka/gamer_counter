import React from "react";

import {ParticipantCard} from './ParticipantCard';
import "../App.css";

export class ParticipantCardList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.items && this.props.items.length !== 0)
      console.log('animation starts here');
    swap2(0, 1);
  }

  render() {
    console.log("render", this.props.items);
    if (this.props.items === undefined)
      return "";

    return (
        <div id = "cards_container" className="cards">
          {
            this.props.items.map((item, index) => (
                <ParticipantCard
                    index           = { index }
                    participantId   = { item.id }
                    name            = { item.name }
                    score           = { item.score }
                    onClickPlus     = { this.props.onClickPlus(item.id) }
                    onClickMinus    = { this.props.onClickMinus(item.id) }
                    onChangeName    = { this.props.onChangeName(item.id) }
                />
            ))
          }
        </div>
    )
  }
}

function swap2(up_id, down_id) {
  const childA = document.getElementById(up_id);
  const childB = document.getElementById(down_id);
  const finalChildAStyle = {
    x: null,
    y: null,
  };
  const finalChildBStyle = {
    x: null,
    y: null,
  };

  childA.classList.add('transition');
  childB.classList.add('transition');
  finalChildAStyle.x = childA.getBoundingClientRect().left - childB.getBoundingClientRect().left;
  finalChildAStyle.y = childB.getBoundingClientRect().top - childA.getBoundingClientRect().top;
  finalChildBStyle.x = childB.getBoundingClientRect().left - childA.getBoundingClientRect().left;
  finalChildBStyle.y = childA.getBoundingClientRect().top - childB.getBoundingClientRect().top;
  childA.style.transform = `translate(${finalChildAStyle.x}px, ${finalChildAStyle.y}px)`;
  childB.style.transform = `translate(${finalChildBStyle.x}px, ${finalChildBStyle.y}px)`;

  setTimeout(() => {
    document.getElementById('cards_container').insertBefore(childB, childA);
    childA.classList.remove('transition');
    childB.classList.remove('transition');
    childB.removeAttribute('style');
    childA.removeAttribute('style');
  }, 1000);
}
