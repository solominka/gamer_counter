import React from 'react';
import {ParticipantCardList} from '../components/ParticipantCardList';

export const ParticipantList = (props) => {
    const { items, lastUpdate, onClickPlus, onClickMinus, onChangeName, help_text, show_help, onClickHideHelp } = props;
    return (
        <main className={window.innerWidth > 650 ? "containerBig" : "containerSmall"}>
            <ParticipantCardList
                lastUpdate   = { lastUpdate }
                items        = { items }
                onClickPlus  = { onClickPlus }
                onClickMinus = { onClickMinus }
                onChangeName = { onChangeName }
                help_text    = { help_text }
                show_help    = { show_help }
                onClickHideHelp = { onClickHideHelp }
            />
        </main>
    )
}
