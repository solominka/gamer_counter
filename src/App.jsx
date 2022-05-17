import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { ParticipantList } from './pages/ParticipantList';
import { Help } from './components/Help';

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    // console.log('initializeAssistant');
    return createSmartappDebugger({
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1Mjg2MzUwMCwiaWF0IjoxNjUyNzc3MDkwLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiM2Q1MTYzNGUtYTJiOS00N2VjLTkwMDMtZDE3Mzg2N2Q0NDRkIiwic2lkIjoiNWQ2MDVlMjgtMzBiZC00ZDAyLTg4M2ItNmViNTQxMTExMWE0In0.Ecggr20V-jGkJLvgtUrjiWrJHODRPYaT7o1UrmYFN3zbNYoFk9Vh3VLGkY4LTassj2dHGjeVrcZ6MN3rPOS9lj_nWaRheLXYFpGtyWYRi3AyW7hwsfsdPMP6OXXLtBJmbdq21rY6GL57KpddROxzSwGBun6KzQBZXWVAVbgPVarM7C8OfTgUvYqsYCeFGLyHkN37n74glIacE-utsDD1MlLAgbXFJ2w3YlCQmaIWLlcjXr46M6c5CxqWgZBIV2Mcp1QwRTONDjP6Ug1YG4cFRLerbfmHErq3K4DJJ_M2vdzmM4WVqyjehpkvCNlIshj9kw9WITokleqs2Gk0p5ceYxRYhVKZp_URDoQYbWJ-0qUTFCZNWANa3XpZ4TDKxJ1SJJrKNycjdRkhQiJJ9l9gYj_U_bbkU1ApJ0ijKevwPWjTBYex5sZZRF1JOTBUfa3RlNGblUW6Vfph62YQLjMSlQJHoOIedlzAP3pWDVfNmgMyyiNOjVInyOPomo_EJW3LdEQfS4saGRoYTqWdkTk58SU6DdmqHetiF-I_4pf-uZDQalIIf4UtB-xUKikCAuZPZIUNV6n6Nh1Kt1MnTr--unQzkmNHKmmrnzzu4fXC1P3fyhw6TvytHPvn9x1CahNl1IlL0Bo7j7nKO2O7GfOzEGWVAb0-wz-S0xwig8qnAOg",
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
      help_text: ""
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
          return this.show_help();
        default:
          throw new Error();
      }
    }
  }

  helpText(action) {
    this.setState((state) => {
      return {
        participants: state.participants,
        last_update: state.last_update,
        help_text: action.text
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
        help_text: state.help_text
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
        help_text: state.help_text
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
        help_text: state.help_text
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
          help_text: help_text
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
            help_text: state.help_text
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

  render() {
    console.log('render, ', this.state);
    if (this.state.participants.length > 0)
      return (
          <ParticipantList
              items   = {this.state.participants}
              lastUpdate = {this.state.last_update}
              onClickPlus = {this.onClickAdd(1)}
              onClickMinus = {this.onClickAdd(-1)}
              onChangeName = {this.onChangeName()}
          />
      )

    return <Help text = {this.state.help_text} />
  }
}

// доделки по модерации
// TODO Добавить поднятие списка имен. Когда их много, клавиатура закрывает нижние, и не видно, что вводишь
// TODO сделать сообщение помощи текстом
// TODO сократить текст на старте

// Перед выкаткой
// TODO потестить на фронте
// TODO выключить возможность запуска на сбербокс
// TODO билд на хостинге

// После публикации
// TODO можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp


// DONE
// TODO При попытке добавить очки голосом, ассистент отвечает, что очки добавлены, но количество очков на экране не меняется

