import React, { FC } from 'react';

import { PlayerCardsProps } from './types';
import './PlayerCards.css';

const clPlcard = (
  e: React.MouseEvent<HTMLImageElement>,
  endGame: boolean,
  isYourHod: boolean,
  setCurrCard: React.Dispatch<React.SetStateAction<number>>
) => {
  //Выбор карты игроком
  if (endGame) {
    console.log('Игра закончена. Чтобы начать новую, обновите страницу');
    return;
  }
  if (!isYourHod) {
    console.log('Сейчас ходите не вы. Нажмите кнопку ход компьютера');
    return;
  }

  setCurrCard(+(e.target as HTMLImageElement).id);
  // console.log('Выбрана карта ' + currCard);
};

const PlayerCards: FC<PlayerCardsProps> = ({
  playerCards,
  endGame,
  isYourHod,
  setCurrCard,
  currCard,
}) => {
  //Вывод информации о массиве карт

  return (
    <div>
      {playerCards.map(({ id, src }) => (
        <div className={`${currCard === id ? 'card active' : 'card'}`}>
          <img
            src={src}
            id={`${id}`}
            key={`${src}-${id}`}
            onClick={(e) => clPlcard(e, endGame, isYourHod, setCurrCard)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerCards;
