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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MzQwMTQyNCwiaWF0IjoxNjUzMzE1MDE0LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZjBiNDVjZmUtNWZlYS00YmI4LTk1NjEtMmU1NGYwNWRmNmQ5Iiwic2lkIjoiODY1Nzc5MDctOGU2Ni00ZTlhLTgzYzktY2ZhZmE3YmFjZGE1In0.oE7vCdHsFYyy9F3ItC-g57dlt_dtcLqFkNp1U9VxvbP6jnJkS-aFcGJxIR1URBUOomu0Y8YrFo98ifJR51iygd21QWOhprKAaUvizO3uOe5ONpGPudi3jJqIubIQAb8Q0lfp8u9-xX-cV4j70aikMeJ2UhoCIN7jI_D8ZyhHJ3f-b9paXMrG0LZBj-kJSCN29Hsz-sg1UMYp6fY7nqThPGRsVSvcWDK0LK86XlP6zvP32Kh3wHrnvhpXUCFwGsvQB-42n9E9vlzvzUvVCYquLSOnt5aqbMH-akx7NPtM8IiIcV32SoA2v9M0MB-53gmmPjKENKNTWNyksbB9DorZnvYiJaUyu7MatAMq_GYnkVdEmYVwn3eXQ5FbEMnu2rAmxxSuHqvqMHYdbG5BFRwYCe-xrT1vGzmECYurSL5MUHAZqr1ur7-ZKsO3Bc5k0y-rhtgXNgB_1BhJwmwyT8JDiOOZxQx492AGOADo5VrKatP7W9bu3wlCo83Yzlq5AlyBi9mWP2x548KfdM51xkfymcDXssq9UqAf_3GYKIiQqdKhs7bFoaT4EL8YzxQce5Z_gKIiCQsRnkTzv6bRgqcPUaYU8jKmK9BLC8cEiDFA-pfXOn_9QSKlBSWjLvJcgrBrjF9HB0eGokOnjh4_7pPrQi6yn8Kf13r-hCu64lMGEBg",
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
      },
      help_text: "",
      show_help: true,
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
        case 'get_help':
          return this.helpText(action);
        case "show_help":
          return this.show_help(action.show);
        default:
          throw new Error();
      }
    }
  }

  show_help(flag) {
    this.setState((state) => {
      return {
        participants: state.participants,
        last_update: state.last_update,
        help_text: state.text,
        show_help: flag,
      }
    })
  }

  helpText(action) {
    this.setState((state) => {
      return {
        participants: state.participants,
        last_update: state.last_update,
        help_text: action.text,
        show_help: state.show_help,
      }
    })
  }

  set_user_number(action) {
    let arr = [];
    for (let i = 0; i < action.number; i++)
      arr.push({
        id: i,
        name: "Участник " + (i+1),
        score: 0,
      })
    this.setState((state) => {
      return {
        participants: arr,
        last_update: {
          id: -1,
          type: 2,
        },
        help_text: state.help_text,
        show_help: state.show_help,
      }
    });
  }

  add_points(action) {
    let sign = action.points > 0 ? 1 : -1;
    let arr = this.state.participants;
    let changed_id;
    arr.forEach(item => {
      if (item.id + 1 === action.participant) {
        item.score += parseInt(action.points);
        changed_id = item.id;
      }
    })
    this.setState((state) => {
      return {
        participants: arr,
        last_update: {
          id: changed_id,
          type: sign,
        },
        help_text: state.help_text,
        show_help: state.show_help,
      }
    });
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
    this.setState((state) => {
      return {
        participants: arr,
        last_update: {
          id: changed_id,
          type: sign,
        },
        help_text: state.help_text,
        show_help: state.show_help,
      }
    });
  }

  onClickAdd(x) {
    return (participant_id) => {
      let setSt = (st) => {
        this.setState(st);
      }
      let help_text = this.state.help_text;
      let part = this.state.participants;
      let sh_help = this.state.show_help;
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
          },
          help_text: help_text,
          show_help: sh_help,
        })
      }
    }
  }

  onChangeName() {
    return (participant_id) => {
      let setSt = (arr) => {
        this.setState((state) => {
          return {
            participants: arr,
            last_update: state.last_update,
            help_text: state.help_text,
            show_help: state.show_help,
          }
        });
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

  onClickShowHelp(flag) {
    let setSt = () => {
      this.setState((state) => {
        return {
          participants: state.participants,
          last_update: state.last_update,
          help_text: state.text,
          show_help: flag,
        }
      })
    }
    return () => {
      setSt();
    }
  }

  render() {
    console.log('render, ', this.state);
    return (
        <div>
          <ParticipantList
              items   = {this.state.participants}
              lastUpdate = {this.state.last_update}
              onClickPlus = {this.onClickAdd(1)}
              onClickMinus = {this.onClickAdd(-1)}
              onChangeName = {this.onChangeName()}
              help_text = { this.state.help_text }
              show_help = {this.state.show_help}
              onClickHideHelp = {this.onClickShowHelp(false)}
              onClickShowHelp = {this.onClickShowHelp(true)}
          />
        </div>
    )
  }
}

// доделки по модерации
// Салют (андроид): При вводе имени, клавиатура перекрывает поле ввода у участников, которые находятся внизу экрана

// Перед выкаткой
// TODO потестить на фронте
// TODO выключить возможность запуска на сбербокс
// TODO билд на хостинге

// После публикации
// TODO можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp


// DONE
// Саджест и кнопка "помощь" дублируют себя. Необходимо убрать саджест, т.к есть кнопка помощь и
// привязать голосовые команды по которым этот раздел будет открываться;
// Добавьте в раздел "помощь" фразу: "чтобы начать игру, назови(те) число игроков..."
// На первом превью для Салюта в левом нижнем углу видна синяя полоса;
