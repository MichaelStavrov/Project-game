import { Card } from 'types';

type CanThrowProps = {
  isYourAttack: boolean;
  hodNum: number;
  actPlayerCards: Card[];
  actCompCards: Card[];
  playerCards: Card[];
  currCard: number;
  cozyr: number;
};

export const canThrow = ({
  isYourAttack,
  hodNum,
  actPlayerCards,
  currCard,
  playerCards,
  actCompCards,
  cozyr,
}: CanThrowProps): boolean => {
  //Проверка на то может ли игрок кинуть указанную карту
  if (isYourAttack && hodNum < 2) {
    //если ничего нет среди активных карт то можно кидать любую карту,
    // а иначе смотрим первую карту и сравниваем c ней текущую карту
    if (actPlayerCards.length === 0) {
      return true;
    }

    const num1 = playerCards[currCard].num;
    const num2 = actPlayerCards[0].num;

    return Math.floor(num1 / 4) === Math.floor(num2 / 4);
  }

  if (isYourAttack && hodNum >= 2) {
    // мы смотрим совпадение нулевой карты активной своей + все карты врага.
    // Если ничего нет среди активных карт то можно кидать любую карту,
    // а иначе смотрим первую карту там и сравниваем c ней текущую карту

    let num1 = Math.floor(playerCards[currCard].num / 4); //num1 это текущая карта

    if (num1 === Math.floor(actPlayerCards[0].num / 4)) {
      return true;
    }
    for (let i = 0; i < actCompCards.length; i++) {
      if (Math.floor(actCompCards[i].num / 4) === num1) {
        return true;
      }
    }

    return false;
  }

  if (!isYourAttack) {
    //игрок должен отбить карту которая еще не отбита
    let index = actPlayerCards.length;
    let num1 = actCompCards[index].num; //та карта которую нужно отбить
    let num2 = playerCards[currCard].num; //та карта которой мы пытаемся отбить
    if (num1 % 4 === num2 % 4) {
      return Math.floor(num1) < Math.floor(num2);
    }

    return num2 % 4 === cozyr % 4;
  }

  return false;
};
