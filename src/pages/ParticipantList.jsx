import React from 'react';
import {ParticipantCardList} from '../components/ParticipantCardList';

export const ParticipantList = (props) => {
    const { items, lastUpdate, onClickPlus, onClickMinus, onChangeName } = props;
    return (
        <main className={window.innerWidth > 650 ? "containerBig" : "containerSmall"}>
            <ParticipantCardList
                lastUpdate   = { lastUpdate }
                items        = { items }
                onClickPlus  = { onClickPlus }
                onClickMinus = { onClickMinus }
                onChangeName = { onChangeName }
            />
        </main>
    )
}
