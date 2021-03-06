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
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZWQxZDJlODc4YTI3MWUyM2JmYTMzZGFlODc3MmZlNDRmYzU1YmUwN2U4ODhmNTllZmE2MTFiM2I5NGZmMTRmOGUzMzUwNjk0MTAxYmRkNCIsImF1ZCI6IlZQUyIsImV4cCI6MTY1MzY0MTA3NCwiaWF0IjoxNjUzNTU0NjY0LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiMzg1NDdlZmMtYmRhNi00YmIwLWFlY2MtYjA5ODk3NzBhZDc0Iiwic2lkIjoiNjU0YzBjODItZWU2OC00NDJmLWJiNzktODNjZDdiMWMxZTUwIn0.efibcdmZNVODSazpQ10iD_M0s5FnIaG7c_ZewO0LXSIGUAlrB5JXU6f3fJpJvozEa0OhWDfj7IHAQBRHSZYKojms_rQgyDAALZtz2VeLD4mrsC8BPlTFs0jsuNoqCbjR4MGPW4kfcyxnxEgWS_trnkARUv3FXjGVP12wRSlm7e4_AGJZYMmULwT31_dgo4ft39JgvQlleqp12hmT82gy3PFCpjNslD9JP6TrGb_rHNW77z9W72d36ulenCUxKFwjkTvCBJrnhflX39ZKK8PVNkr46Ej_r2yiBpRzy3IhWYYoEpuS7xMxQCCZ2wQvUSOtjRjpVACLFSiMMnedtDspF-xZDCMtZe5FJMb1DK-7-ByjvvQH3mbSP--8ocuIYKKCh0x7Ex6HBYWnW2jVecmFPagD8BSGm0HY0BHIvihsggnJD2iZ-XVceuwr4JZBboDduK6gMqi3hpJx5cxj-6Ax-pv6olPX4PcntpTjzrnh0LKtcth25KgKzxZ1NZjcH1I-oZd9zm4R3FNLcbrQjaNvkINGdYjlUt3XZGfvYGAwG8gIKyv0YEu2s4Sc08kXTFG1YEaI0f315APDAxwnY8eftZkzk1PNSGKZGYwHF8yT-4pG0ehf79A0GGheRDSJZbXHOTVG6_9EJLTWMcH2Dah6yYnjg2P3rWbcbIvXHTlFxQc",
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
        case "null_points":
          return this.null_points(action);
        case "null_points_by_name":
          return this.null_points_by_name(action);
        default:
          throw new Error();
      }
    }
  }

  null_points(action) {
    let arr = this.state.participants;
    let changed_id;
    let prev_score;
    arr.forEach(item => {
      if (item.id + 1 === action.participant) {
        prev_score = item.score;
        item.score = 0;
        changed_id = item.id;
      }
    })
    this.setState((state) => {
      return {
        participants: arr,
        last_update: {
          id: changed_id,
          type: prev_score > 0 ? -1 : +1,
        },
        help_text: state.help_text,
        show_help: state.show_help,
      }
    });
  }

  null_points_by_name(action) {
    let arr = this.state.participants;
    let changed_id;
    let prev_score;
    arr.forEach(item => {
      if (item.name.trim().toLowerCase() === action.name.trim().toLowerCase()) {
        prev_score = item.score;
        item.score = 0;
        changed_id = item.id;
      }
    })
    this.setState((state) => {
      return {
        participants: arr,
        last_update: {
          id: changed_id,
          type: prev_score > 0 ? -1 : +1,
        },
        help_text: state.help_text,
        show_help: state.show_help,
      }
    });
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
    let ass = this.assistant;
    let st = this.state;
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
          st.participants = arr;
          ass.sendData({ action: { type: 'set_state', payload: { items: arr } } })
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
