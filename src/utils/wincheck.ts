import { Card } from 'types';

type WincheckProps = {
  marker: number;
  playerCards: Card[];
  compCards: Card[];
  endGame: boolean;
};

export const wincheck = ({
  marker,
  playerCards,
  compCards,
  endGame,
}: WincheckProps) => {
  //проверка на победу, вызывается после кнопки сброс
  if (marker !== 36) {
    return;
  }
  if (playerCards.length > 0 && compCards.length > 0) {
    return;
  }
  if (playerCards.length === 0 && compCards.length === 0) {
    console.log('Ничья');
    endGame = true;
    return;
  }
  if (playerCards.length === 0) {
    console.log('Вы победили');
    endGame = true;
    return;
  }
  if (compCards.length === 0) {
    console.log('Вы проиграли');
    endGame = true;
    return;
  }
};
