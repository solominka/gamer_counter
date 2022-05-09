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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MjE4MzgyNiwiaWF0IjoxNjUyMDk3NDE2LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZmFiZTQ2MzYtZGFlYy00N2JhLWE0ZWItODk2NzcyZTQxOGRhIiwic2lkIjoiMmJkN2ZlNjItZTc1NS00YTQwLTk2MGEtNzY1NGFmYjJjY2ZiIn0.f72V8ksp4sb9khT4WLXhgdy9025NbD5uLF4VG37dba_kkByfcIJuLbgLLfwF1r1ny85ure34HHIHqTYDeZgCTImVSnNieVTOoEzPSHB4UAlb-7sjpJ1pjhmqGBfBw5cp6ovgOVa9Hg7zTEmYg6d6l_L0IaAJAuXh79qkAAUrIedwZVdS14fEDHZxz_i434wgwIqRE1sVt2A39OUlGKW87Nu7l8c2LuhJkRDBC_u5U24mEJ_EDoibJrNNj0o0MfL36qUMg9eXvkJkCY178zx-ZSigXLP1dFQviN8B5a1AWc0rtkskAvBjF3tmIYDHoE7BFMESUd0M_LyjBDel67DBx-E67v9NXgoMBkNVnVIwyA9bTIcccl99NSd8iWjwADkdY7Iz_OP_TQckp52A9LYhvWXRi8nQ2SLLTV1XqwonuGNggpqxHPdp9udcQgSaublimrepYMGv93MTGdRd0BUNltNkl0Qn26bGIVK9EDUt4HtXxe6uE75il5QMdtoZuczdNWvCNYgH42K0gK_xMYiXQykxQkrzfjSMNvSFEuF04VSVH3b9k-NnAy2D934WHY_msM3OIh8UAzQ_Rp3VEP9M4SWnqeYo_VUrZUOX9GFosO7wk2ChK6a0xVOr98s2SoH5qf2PR2soVIhqFS_totT9em_EBT_2-1kszKLv3swyiN8",
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
      if (item.name.trim().toLowerCase() === action.name.trim().toLowerCase()) {
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

// Перед выкаткой
// TODO билд на хостинге
// TODO описание тестирования
// TODO скриншоты для описания

// После публикации
// можно получить сбербокс(?) https://developers.sber.ru/portal/virtual-assistants-salute/sberbox-smartapp
