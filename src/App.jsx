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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MjA4NDM1MiwiaWF0IjoxNjUxOTk3OTQyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiM2U5Zjc2ODUtZGQ3My00ZGJkLTkzNjktZmFkMjBiYTA3ZmJkIiwic2lkIjoiYjFlOTBlNzItM2Y3OS00NjBlLWI4NGUtYzhkNWZmN2ZkMGU0In0.QqfJy3ue-O2PaUcXA54P7liT-kgJ_U3E2iw-Xi2HUaTZT7seeVpicbFb1JwBZQVEX3S5AVgvhW2oQIoIgWnEmURWNIO74IDCWYpoHX4Ho3klUQK-aJTHw_RpMdpOILO4CstWOKzOcXAwG6HSGLEBMmhQxFbao4U6foxi2csCLLay9rmcRq2jBI77EwD2f3dErrUPEc_YmCNBs0W-OR1R3U8xl1UHtC5YHNEdOp_Y_4VCFRa-xBO0n7k43J9nyKFx_0GfAePkJgq8OTMSghjEk1HXTYDtGp5-0d5ff3QLp9SQ1a322y2TI2r7ZTgv9097A4UfwRCFRLuWZJmFALQSheEGA_eC8lty-FJeWVguBYRSa5-SmoI8s-GaSlT5aAMnceYuob0ZLuVQxMexpZ0xWxglNNS6moLRpyYdVutfhO5aXkQqS1RtQ4PwlwfX_BmjKmatTcEQvG4WM8JzLJ__QRiC0ypEy592Gsb7qn0CDgm2uBhjLBmcOwX4GJSXmyHeb6us813FmI1wRt4QGQpmFSNwvFGMNqhihWisxtb9YiCqJxfEbwp_HSe1vexvqeoePsaLz0cvzgIrTlZWBxpj8K15uQZhL09qbTVdGy0NMpTa7eV1TvzuPxZZPdk4wnCpeWSQqIAetLYWeRhRKuheuEnulEh87HwW2MQt0nHPkqY",
      initPhrase: `Запусти счетчик очков`,
      surface: "COMPANION",
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
          return this.add_points(action, 1);
        case 'add_points_by_name':
          return this.add_points_by_name(action, 1);
        case 'subtract_points_by_name':
          return this.add_points_by_name(action, -1);
        case 'subtract_points':
          return this.add_points(action, -1);
        default:
          // TODO change this before deploy
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
    })
  }

  add_points(action, sign) {
    let arr = this.state.participants;
    let changed_id;
    arr.forEach(item => {
      if (item.id + 1 === parseInt(action.participant)) {
        item.score += parseInt(action.points) * sign;
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

  add_points_by_name(action, sign) {
    let arr = this.state.participants;
    let changed_id;
    arr.forEach(item => {
      if (item.name.toLowerCase() === action.name.toLowerCase()) {
        item.score += parseInt(action.points) * sign;
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
// TODO закрыть приложение (мб уже работает)
// TODO начать сначала (reset)

// Перед выкаткой
// TODO билд на хостинге
// TODO описание тестирования
// TODO скриншоты для описания

// После публикации
// можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp
