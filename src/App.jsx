import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { ParticipantList } from './pages/ParticipantList';


const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    console.log('initializeAssistant');
    return createSmartappDebugger({
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MTg2MDY2OCwiaWF0IjoxNjUxNzc0MjU4LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiYjY3MzFjYzAtMWFmZC00YjVhLWIzZDQtMTE2ZjhjNmJkMDY3Iiwic2lkIjoiNzdiZjIwYzctNjZmNS00MjAwLThhNDYtMDE5YmMyMDk5MTk5In0.nAJdZ0C_dm2zsnfMwpMGIwnbcvQvvkmtrdXnN3-WGKQijRdZlqB1YOKTJ2dcZQWOVbg7CVVSw-N1rdM0xvePklr8K7lZa5WsTiW7j3vUbWITaAbGGYwlbg--5FxLu175tD7KH_Qa7xkQdag9MoDF8I3OQ66A0NG5sD9UZHfsfKIKI12A0EU6aFfcQ5ZcvSXfPp5mrJGG79Xxke1AtIXNycqansMBCezUmDlSF9dr0s24NhWz0VSn1Zqpob4m9JigCp-e64vrXgvRSFYM6DM0IDG0-3YJ3AHTe7b3xpyW1mf-zKXOsRyOVfwXsezl2F1iGghy45yFVkYEO0ASV3MKxE0s80JiztPEeICt3W13CP_oVP-UWh-wig-WPWJEBgEHkry-G1mYJPZTusrk4lHEFEpru6lWyv0lJbVakaVCsz8mln74v5b-9tA5cufduW7MuYmbrRgSq_6KLarpIYfMy2IE7ce4kFarR1y6arMY66CnIJXBPt-_1d0OkCAqnDMxeJ2aELtMfSM6EyDBtGiaFinxzyx_n8Gsv0IaN9CMTGAL1SbzQq7vD-eYvyi8ioIrIuHLQHkTzlF6vtqIAQ5xPtFL9H380BI0PdWBwqy9z0ui-_U0w0eZ4YNuxsoOsY4jZlnYSKvWDo_11gGMCAJkiWXJpo8T0ajsmTzEhJ-2Mzs",
      initPhrase: `Запусти Счетчик очков`,
      getState,
    });
  }
  return createAssistant({ getState });
};

export class App extends React.Component {

  constructor(props) {
    super(props);
    console.log('constructor');

    this.state = {
      participants: [],
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
    arr.forEach(item => {
      if (item.id + 1 === parseInt(action.participant)) {
        item.score += parseInt(action.points) * sign;
      }
    })
    this.setState({
      participants: arr,
    })
  }

  add_points_by_name(action, sign) {
    let arr = this.state.participants;
    arr.forEach(item => {
      if (item.name.toLowerCase() === action.name.toLowerCase()) {
        item.score += parseInt(action.points) * sign;
      }
    })
    this.setState({
      participants: arr,
    })
  }

  onClickAdd(x) {
    return (participant_id) => {
      let setSt = (arr) => {
        this.setState({participants: arr});
      }
      let part = this.state.participants;
      return function() {
        let arr = part;
        arr.forEach(item => {
          if (item.id === participant_id)
            item.score += x;
        })
        setSt(arr);
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

        onClickPlus = {this.onClickAdd(1)}
        onClickMinus = {this.onClickAdd(-1)}
        onChangeName = {this.onChangeName()}
      />
    )
  }
}

// фронтенд
// TODO добавление игроков

// Сценарии:
// Пользователь: «Включи виртуального баристу».
// Ассистент: «Я виртуальный бариста. Могу рассказать как приготовить кофе. Чтобы узнать, скажите «Дальше». Чтобы выйти из навыка, скажите «Выход».
// TODO смартап корректно отвечает на базовые вопросы: привет, что ты умеешь, помощь
// TODO закрытие смартапа https://developers.sber.ru/docs/ru/va/how-to/start-stop/close-app
// TODO изменение персонажа ассистента, и реплик в соответствии с персонажем
// TODO жесты пользователя (свайп влево/вправо/вверх/вниз) https://developers.sber.ru/docs/ru/va/background/app-design/canvasapp/sberportal
// TODO больше инструкций/подсказок пользователю

// TODO 0 баллов, 1 балл, 2-4 балла, 5-9 баллов
// TODO сообщения пользователю о неправильных запросах добавления по номеру
// TODO добавление игроков

// MORE
// TODO сделать красивое поднятие имени игрока в рейтинге

// Перед выкаткой
// в описании написать про ограничение на число игроков (до 10)
// TODO тестирование
// TODO разобраться с полем Хостинг Canvas App (https://developers.sber.ru/docs/ru/va/how-to/publication/main-settings#%D1%85%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B3-canvas-app)
// TODO скриншоты для описания

// После публикации
// можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp
