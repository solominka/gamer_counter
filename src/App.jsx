import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";
import { ParticipantList } from './pages/ParticipantList';


const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    console.log('initializeAssistant');
    return createSmartappDebugger({
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MTU2ODY0OSwiaWF0IjoxNjUxNDgyMjM5LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiYmUzMmYxOTQtMDQwZC00OGYxLWIxNzMtMWQ0YTAyZDcxMGIwIiwic2lkIjoiN2I5YWRjNWYtOTA1ZS00ZTk5LTgyYTItYThmZDM3OTk4MDlmIn0.WT4sr6G3DxYAldiywbeeQbIHQzADHK98x0k9tYxgbu9PfGr6YuKVn5ZtCxfDhgtt_LfVAsUJzZl2YD7cmoJ4D7N0KkY53D5l66-vIRvtFgy8R2IjM2JBdGVMN5tlcYPOsDGB0GNd90pWGZoKxzauhhf7sZeZI26pdDoTlU8HLW_MN94p8zkczJ2tkq3t6ZzGGCGoSd8pGxN76omZZ_s_bqMch8_EfcHEGZYRBLYjYRJR23sPifi0IgBxLw0t1kkgnLmPVinNeTKZbENxjugvMf4Mti5335Spq4I_rWD5fA57qamK4grDY5efkJC7k7445GSrj5LBZe8L4-LwXLvrTuUZdcDZJ_r675THznyFpDXUlwuQxTjH_09nmQCfdCQPV109TfuStDNsIeg1S8LlGsjfeRHhlOCpZP6FODSJivvHwa_MjMtwihN6T0BpJz8RbSk3TClh-mNcJXPVUi2l-IFNp0hsqf_Aj_n8oFgL-QCI5jTciK_mBU0AaFTZUcj6Yp60jo4a9jp4EgVJGEyINOtz7PnZkCAZd-LeYSMFb5LP6TxWPT9pzrtPzPDPd3n1UvnYA129dZgXCSVRwB2Ydwx0q1aOwiihZwKxTEhlWnyWqyKqil8GD22q2h_IIYj6R75rdJLW5NJ6jG_oMp5ieu39U2N6FLjakEINzrxszDk",
      initPhrase: `Запусти счетчик очков`,
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
            id,
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
// ?UX TODO убирать плейсхолдер при фокусе
// TODO сделать добавление игроков

// Сценарии:
// TODO добавить реплики с обратным порядком - добавь 6 баллов сергею
// TODO выяснить как пользоваться assistantState
// TODO добавить сообщения пользователю о неправильных запросах

// MORE
// TODO сделать красивое поднятие имени игрока в рейтинге
// TODO менять направление сортировки
