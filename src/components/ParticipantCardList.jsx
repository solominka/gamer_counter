import React from "react";

import {ParticipantCard} from './ParticipantCard';
import "../App.css";

let x = 0;

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
    this.doAnimation();
  }

  componentDidMount() {
    if (this.state.ids === null || this.props.lastUpdate.id >= this.state.ids.length)
      return;
    this.doAnimation();
  }

  doAnimation() {
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
    let curID = this.props.lastUpdate.id, curPlace = this.state.places[curID];
    let {ids, places, sum} = this.state;

    if (this.props.lastUpdate.type === 1) {
      if (curPlace === 0) return;

      let upperPlace = curPlace-1, upperID = this.state.ids[upperPlace];
      if (this.props.items[curID] && this.props.items[upperID] && this.props.items[curID].score > this.props.items[upperID].score) {
        this.swap(upperID, curID);
        ids[curPlace] = upperID; ids[upperPlace] = curID;
        places[curID] = upperPlace; places[upperID] = curPlace;
        this.setState({
          ids: ids,
          places: places,
          sum: sum,
        });
      }
    } else if (this.props.lastUpdate.type === -1) {
      if (curPlace+1 >= this.state.ids.length) return;

      let downPlace = curPlace+1, downID = this.state.ids[downPlace];
      if (this.props.items[curID].score < this.props.items[downID].score) {
        this.swap(curID, downID);
        ids[curPlace] = downID;
        ids[downPlace] = curID;
        places[curID] = downPlace;
        places[downID] = curPlace;
        this.setState({
          ids: ids,
          places: places,
          sum: sum,
        });
      }
    }
  }

  swap(up_id, down_id) {
    const up = document.getElementById(up_id);
    const down = document.getElementById(down_id);
    const finalChildAStyle = {
      y: null,
    };
    const finalChildBStyle = {
      y: null,
    };

    up.classList.add('transition');
    down.classList.add('transition');

    if (x === 0) {
      x = up.getBoundingClientRect().top - down.getBoundingClientRect().top;
      console.log(x);
    }
    console.log(up.getBoundingClientRect().left - down.getBoundingClientRect().left);
    finalChildAStyle.y = -x + this.state.sum[up_id];
    finalChildBStyle.y = x + this.state.sum[down_id];
    up.style.transform = `translateY(${finalChildAStyle.y}px)`;
    down.style.transform = `translateY(${finalChildBStyle.y}px)`;

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
