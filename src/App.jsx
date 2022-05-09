import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { ParticipantList } from './pages/ParticipantList';


const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    // console.log('initializeAssistant');
    return createSmartappDebugger({
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MjE4ODkyMiwiaWF0IjoxNjUyMTAyNTEyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNjY3OGVhMTAtNzBmZi00ZGQ1LTg2ZjItYjFlNjExOTZhZGNmIiwic2lkIjoiYjJlZTMzMDktYTYzMC00YjIzLTg0MGQtYTY2MzMyNTg4NjE0In0.EOHBc7jZCx6cbkwRNla3dB6V9yckOF0JxwkdRUBheg0YGKAXlwF61_QibiNndLf7vMvBfmHwS-4Cx7PFmAZcWceK65o1MQnA4jDMBAQQKy4gkOq96gej8Sed0amgd2r77BR6lRM54i0Qe8ByHvqPG5y4uGgH-gwh3FmorhzirACgqXi9JHpD5PS8-YCy4TT6udtM0NFbPoH5vxPBvVEJh8oqmWIYRtEFNa6in9vvgOAmoaFroSyv8UvFH_bohys7VPfyaOJX1eIuQgrHK3hU-dvzZrOkgrGM9EKYh5-Y7tlsuHnjkd0aTwTQdR6p_uvC-EC5Ft_QrGLJIyjeVSOXY1fSicRxI-nxFxT4apfb8A7ssQcf0w7EUQSbHphzp2Wcrvf2yq0IA904hvOfhEh72xo9hBzv1bEocpDunRjIDxKZ2sADzgt0bPteQ297HqhFEKqBo-TQtP3zTtbOhgICuHntS96PW3skwfxEDbm3xt21WpgaZ_niXZ-7Kdfq4WlYI3Y161ARQ7HwNxBKRFHaI80rC_2y0Kd6WRCDnJXlqrH3vSbAqo4XzRkFLnqwSqwV10quiGPvdNGqLGNjpMOt_DQNUplNRr-HvSPe2GV78ALsZmvFkn1spHq_rMHYjiov51oeftYMQNOt8DbkZtdsi2WI6-zQFB9KiyvQC4zN0eY",
      initPhrase: `Запусти Счётчик очков`,
      getState,
    });
  }
  return createAssistant({ getState });
};

export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      participants: [],
      last_update: {
        id: -1,
        type: 0,
      }
    }

    switch(props.name) {
      case 1:
        return -1;
      case 2||3||4:

      default:
    }

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.participants.map(
          ({ id, name, score }, index) => ({
            name,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'set_user_number':
          return this.set_user_number(action);
        case 'add_points':
          return this.add_points(action);
        case 'add_points_by_name':
          return this.add_points_by_name(action);
        default:
          throw new Error();
      }
    }
  }

  set_user_number(action) {
    let arr = [];
    for (let i = 0; i < action.number; i++)
      arr.push({
        id: i,
        name: "Участник " + (i+1),
        score: 0,
      })
    this.setState({
      participants: arr,
      last_update: {
        id: -1,
        type: 0,
      }
    })
  }

  add_points(action) {
    let sign = action.points > 0 ? 1 : -1;
    let arr = this.state.participants;
    let changed_id;
    arr.forEach(item => {
      if (item.id + 1 === parseInt(action.participant)) {
        item.score += parseInt(action.points);
        changed_id = item.id;
      }
    })
    this.setState({
      participants: arr,
      last_update: {
        id: changed_id,
        type: sign,
      }
    })
  }

  add_points_by_name(action) {
    let sign = action.points > 0 ? 1 : -1;
    let arr = this.state.participants;
    let changed_id;
    arr.forEach(item => {
      if (item.name.trim().toLowerCase() === action.name.trim().toLowerCase()) {
        item.score += parseInt(action.points);
        changed_id = item.id;
      }
    })
    this.setState({
      participants: arr,
      last_update: {
        id: changed_id,
        type: sign,
      }
    })
  }

  onClickAdd(x) {
    return (participant_id) => {
      let setSt = (st) => {
        this.setState(st);
      }
      let part = this.state.participants;
      return function() {
        let arr = part;
        arr.forEach(item => {
          if (item.id === participant_id)
            item.score += x;
        })
        setSt({
          participants: arr,
          last_update: {
            id: participant_id,
            type: x,
          }
        })
      }
    }
  }

  onChangeName() {
    return (participant_id) => {
      let setSt = (arr) => {
        this.setState({participants: arr});
      }
      let part = this.state.participants;
      return function (name) {
        return () => {
          if (name === "")
            name = "Участник " + (participant_id+1);
          let arr = part;
          arr.forEach(item => {
            if (item.id === participant_id)
              item.name = name;
          })
          setSt(arr);
        }
      }
    }
  }

  render() {
    console.log('render, ', this.state);
    return (
      <ParticipantList
        items   = {this.state.participants}
        lastUpdate = {this.state.last_update}
        onClickPlus = {this.onClickAdd(1)}
        onClickMinus = {this.onClickAdd(-1)}
        onChangeName = {this.onChangeName()}
      />
    )
  }
}

// фронтенд

// Сценарии:

// Перед выкаткой
// TODO скриншоты для описания
// TODO описание тестирования
// TODO выключить возможность запуска на сбербокс
// TODO билд на хостинге

// После публикации
// TODO можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp
