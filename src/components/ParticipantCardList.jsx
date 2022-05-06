import React from "react";

import {ParticipantCard} from './ParticipantCard';
import "../App.css";

export class ParticipantCardList extends React.Component {
  constructor(props) {
    super(props);
    let ids = [], places = [], sum = [];
    this.props.items.forEach((value, i) => {
      ids[i] = value.id;
      places[value.id] = i;
      sum[value.id] = 0;
    })
    this.state = {
      ids: ids,
      places: places,
      sum: sum,
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.ids.length === 0) {
      let ids = [], places = [], sum = this.state.sum;
      this.props.items.forEach((value, i) => {
        ids[i] = value.id;
        places[value.id] = i;
        sum[value.id] = 0;
      })
      this.setState({
        ids: ids,
        places: places,
        sum: sum,
      });
      return;
    }
    console.log("last update", this.props.lastUpdate);
    if (this.props.lastUpdate.type === 1) {
      let curID = this.props.lastUpdate.id, curPlace = this.state.places[curID];
      let upperPlace = curPlace-1, upperID = this.state.ids[upperPlace];
      if (curPlace > 0 && this.props.items[curID].score > this.props.items[upperID].score) {
        this.swap(upperID, curID);
        let {ids, places, sum} = this.state;
        ids[curPlace] = upperID; ids[upperPlace] = curID;
        places[curID] = upperPlace; places[upperID] = curPlace;
        this.setState({
          ids: ids,
          places: places,
          sum: sum,
        });
        console.log("changed list state", this.state);
      }
    } else if (this.props.lastUpdate.type === -1) {
      // todo
    }
  }

  swap(up_id, down_id) {
    const childA = document.getElementById(up_id);
    const childB = document.getElementById(down_id);
    const finalChildAStyle = {
      y: null,
    };
    const finalChildBStyle = {
      y: null,
    };

    childA.classList.add('transition');
    childB.classList.add('transition');
    finalChildAStyle.y = 134 + this.state.sum[up_id];
    finalChildBStyle.y = -134 + this.state.sum[down_id];
    childA.style.transform = `translateY(${finalChildAStyle.y}px)`;
    childB.style.transform = `translateY(${finalChildBStyle.y}px)`;

    let {ids, places, sum} = this.state;
    sum[up_id] = finalChildAStyle.y;
    sum[down_id] = finalChildBStyle.y;
    this.setState({
      ids: ids,
      places: places,
      sum: sum,
    });
  }


  render() {
    // TODO update state with props
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
