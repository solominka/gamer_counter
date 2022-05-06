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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MTkwNjM4MSwiaWF0IjoxNjUxODE5OTcxLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNDkyNjYwZWUtOWY2Yy00YmQwLWJlMDMtNGE5ZWE3OGRlMjIyIiwic2lkIjoiZmEzM2Y4MjgtYTU2Mi00MDNmLTgyMGEtN2EzYjMyNmRjMDBmIn0.lL4DkfBszH7xjUP0_jq7V0QfUfmiHz59M7H0S8zfyHxoOZOunqgHJgFU1XGtALXuFe1G9aQHHzgr60Ukutmda46_NkoH7dMlNY3_CIao7wYCqwYgKYq4pRHkKjxRV38HZHkWaFiOub7cZfK0wnJb5sa2yV3zbqkKpybDvWPCOhIq5BBsST9A8-5VIuO16Ei3Xdha1eTH5-gtUfLYl-gLoG8W6jvQTPINHZH2cv7K6-q3d_sbPrDQiD0388UzLSOsIUmZ5wjpGkzcYr82gif7FBKQVlx4IAPDS7yRBtdp2oDQSDIrYPumCbEAJGC8TV1JGVHvekbEHRTKlmjTADjMHWUDMhPla4R9ukux2gkb3yqA050-QwWfLQE8sLwE2YPZK8rHC0ogfqv9RZjUtUWwsOrN6SKv16nN-dkhJWGGBnJHHRZe2Tr-rgJ2N2qm4KYgP2z25jx_aS_YGtDpLdP74XkJ8UUGpdyAye92t5gbSff49Mx7cCyR7MlrjF0FMO33XLzKJgQNhAI4InmTmA_kOjsR7z1P9BWb5J_VEWTVeYuoH2GGVLgHfiJYq8M9aB_tuulQ01L7VbI4siYjLkh9bZM-p0uVp5s31X7yaK7s76-K_tAnBJYyN6jKvYJqSVJGjHmGk6UDpzpxD-_QvwR0QjliEKotXoTiDxadfqjSztg",
      initPhrase: `Запусти счетчик очков`,
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
// TODO добавление игроков
// TODO сделать красивое поднятие имени игрока в рейтинге
// TODO сделать размеры для смартфона

// Сценарии:
// Пользователь: «Включи виртуального баристу».
// Ассистент: «Я виртуальный бариста. Могу рассказать как приготовить кофе. Чтобы узнать, скажите «Дальше». Чтобы выйти из навыка, скажите «Выход».
// TODO смартап корректно отвечает на базовые вопросы: привет, что ты умеешь, помощь
// TODO закрытие смартапа https://developers.sber.ru/docs/ru/va/how-to/start-stop/close-app
// TODO изменение персонажа ассистента, и реплик в соответствии с персонажем
// TODO жесты пользователя (свайп влево/вправо/вверх/вниз) https://developers.sber.ru/docs/ru/va/background/app-design/canvasapp/sberportal
// TODO больше инструкций/подсказок пользователю

// TODO 0 баллов, 1 балл, 2-4 балла, 5-9 баллов
// TODO добавление игроков

// Перед выкаткой
// TODO в описании написать про ограничение на число игроков (до 10)
// TODO билд на хостинге
// TODO тестирование
// TODO скриншоты для описания

// После публикации
// можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp
