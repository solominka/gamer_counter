import React from 'react';
import {ParticipantCardList} from '../components/ParticipantCardList';

export const ParticipantList = (props) => {
    const { items, lastUpdate, onClickPlus, onClickMinus, onChangeName } = props;
    return (
        <main className="container">
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
