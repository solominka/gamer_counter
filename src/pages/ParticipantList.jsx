import React from 'react';
import {ParticipantCardList} from '../components/ParticipantCardList';

export const ParticipantList = (props) => {
    const { items, onClickPlus, onClickMinus, onChangeName } = props;
    return (
        <main className="container">
            <ParticipantCardList
                items        = { items }
                onClickPlus  = { onClickPlus }
                onClickMinus = { onClickMinus }
                onChangeName = { onChangeName }
            />
        </main>
    )
}
