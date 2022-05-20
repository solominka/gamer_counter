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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MzA1NzI4MywiaWF0IjoxNjUyOTcwODczLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZDU1Mzc2NWMtMGY4Yi00MGQ0LWI1N2YtMzRkODY4NTQ5OWFjIiwic2lkIjoiMDM2OTBjODUtNzgyMS00NzUxLWFhM2QtNjNiMmRmYjliOWU2In0.iuGoXvkcRQki_7ArS70Vdn9c5kJRpMCClSWVPd4KVvG1jYAsl0dF75gR-m6xHHh2t7LezfMyBFm446o_FMvtPmDWmlvM4RGZup7LquJCfT0wI9oP4pysUIIUrq43dVXe9h9VeDOnoJmslHiqHKV4t-dhdk94clrE9vNn06uPL_yv1Dj7_Vms1oOYgHmdcijXQm-VTmQs28cJuWZxvGDgCvDL18TMlnbpjxZ0L6ndd75bDMVldLxqKEpIScN4MTmt9-UMM8SSMWndwWI4qw_bzqli0JhTqrtblHlx51D_j8j81ASVi1qfOsF6Ce6BBzyOG7KSPq8djzfTTd0edTsI0GzeaQiuoM02Eio3sGmobMr6L5Pp7FrkV3jTVeglF1_DZ62Mm_H9IApOQHRRi7oJzhr7Imzn7kAdumV0WV__H8biUnziEL11443wj7uiWVscymT6um-G3QBYCnlMQzanxGXvRWnCLrqPTARjSDPN4OS8pH-2E9jj6L-GiWIRLdTecrSL_3SSc6x92cV9Xf2FlwtecjruMSOf9YveaP7zOINE4tl9vCGdfCCGTaVRfte51QpPmFgaPyUGbYnQYOYvXcu8SUQ6NMqbNubGRc926ml3Y076H6QODcAFWGVrwwmG_CUrxb0N-VukH-KAZ2RGXL6_1SsJCOA1fWiGd4ccG5c",
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
