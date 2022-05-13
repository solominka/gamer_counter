import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { ParticipantList } from './pages/ParticipantList';
import { Help } from './components/Help';

let map = {
  ["пер"]: 1,
  ["вто"]: 2,
  ["тре"]: 3,
  ["чет"]: 4,
  ["пят"]: 5,
  ["шес"]: 6,
  ["сед"]: 7,
  ["вос"]: 8,
  ["дев"]: 9,
  ["дес"]: 10
}

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    // console.log('initializeAssistant');
    return createSmartappDebugger({
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MjQ1NTA2NywiaWF0IjoxNjUyMzY4NjU3LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNmM3OTc3YTctNTAwZC00NmZhLWI5YzctNjgyOTZmMTM1MTEzIiwic2lkIjoiYjM4YzZkM2YtMzE3YS00NzMzLWI5YTMtZWMxMzNmOTg3NWQxIn0.gBx0qO1eyZ7kIbjeGEtld8qE3dqqKUWTurqSLAEzTyuNfuZJhKYXOsvD-tQz20D445viCqPaRkwqX7JHkecjfPUq2I1gS_81n7kgjoc8pxFgOCqjmqB8p_qplsXK1QRaZr-8WnveK54-sOYD7ZFpjERNrrda10wT9Yi0LqZXfcRuwjE6QNiPjUwMKTSEjBx1ovArZ1k0o3cWR_ozySHsTYmd6xfHTHb1KwEhmZBJqutCLsHHvNY_vuZSJI7G3at8ls8Z1MupNgTfc-GmGGxy69_BAQIL9Fegg3_ukodPJGb0mJt3DQ9kybOLMDH1pa69vdtTC3FU95aVY-ij4-4YUls1hTHGSzMf2TKPzXR-eEvKBpHc_f7_02Gv-kd-Eq-ip4VSnyJerQ0ScsrTFv85GpMzwUyT8OT8RHDJnOqMxfcVfbn0VI07Oro-S4IHOEePCXLP1KqNsHk1w2R1FtYZaGpakjuiaUU6BiM6l_ufka_06DNZZf6ZVG0_O7qZ5Z44IyUtmWrVSFoIA6BJUfi4diy6isfCleTPmXBSRVNeHqpJw63MTeYTJ4kTaVQVTcKIIFvj8_iloAqsZHJVJ8VFwfkfru-l9Wj19JCbmwa0JAnEx4SUeSz67pmI406F3Ag7gaZHtSc_H9C8rSBgjUAdFOZUlo9OfNhBtZLywJDeQzo",
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
    let part = map[action.participant.slice(0, 3)];
    arr.forEach(item => {
      if (item.id + 1 === part) {
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

// сложно

// Перед выкаткой
// TODO потестить на фронте
// TODO выключить возможность запуска на сбербокс
// TODO билд на хостинге

// После публикации
// TODO можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp


// DONE
// поменять возрастную категорию на 6+
// Ассистентам Сбер и Афина характерен более деловой стиль в общении, поэтому они не могут говорить "Привет"
// добавить интент "заново"
// На превью смартапа не должно быть видно панели ассистента
// На голосовой запрос вне контекста ассистент отвечает "Я не понимаю". На такие запросы ассистент должен подсказывать как вернуться к сценарию;

// добавить текст с описанием смартапа при запуске
// отправлять текст помощи из сценария на фронт

// расширить список голосовых команд, которыми можно прибавлять/удалять очки у участников, чтобы пользователь мог по разному строить фразу и ассистент его понимал (добавь/прибавь/плюс)
// заменить шаблоны на интенты в добавлении/вычитании очков
// сделать сущность на первого/второго/...



