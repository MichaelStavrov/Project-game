import React, { FC, useEffect, useState } from 'react';

import PlayerCards from '../../components/PlayerCards';
import ActiveCards from '../../components/ActiveCards';
import { getCardImageSrc, wincheck, canThrow } from '../../utils';
import { Card } from 'types';

const coloda: number[] = [];
let marker = 0;
let cozyr = 0;
let hodNum = 0;
let isYourAttack = true;
let endGame = false;
let isYourHod = true;

const makeColoda = () => {
  let randomNum = 0;

  const usedCards = new Set();

  usedCards.clear();

  for (let i = 0; i < 36; i++) {
    do {
      randomNum = Math.floor(Math.random() * 36);
    } while (usedCards.has(randomNum));

    usedCards.add(randomNum);
    coloda.push(randomNum);
    marker = 12;

    if (i === 35) {
      cozyr = randomNum;
    }
  }
};

makeColoda();

const cardsCount = [0, 1, 2, 3, 4, 5];

const App: FC = () => {
  // const [cozyrcard, setCozyrcard] = useState(getCardImageSrc(cozyr));
  // const [compcardc, setCompcardc] = useState(6);
  const [currCard, setCurrCard] = useState(-1);
  const [colodaCount, setcolodaCount] = useState(36 - marker);
  const [actPlayerCards, setActPlayerCards] = useState<Card[]>([]);
  const [actCompCards, setActCompCards] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>(
    cardsCount.map((num) => ({
      id: num,
      num: coloda[num],
      src: getCardImageSrc(coloda[num]),
    }))
  );
  const [compCards, setCompCards] = useState(
    cardsCount.map((num) => ({
      id: num,
      num: coloda[num + 6],
      src: getCardImageSrc(coloda[num + 6]),
    }))
  );
  const [sbros, setSbros] = useState(false);

  useEffect(() => {
    //очищаем активные карты
    if (sbros) {
      setActPlayerCards([]);
      setActCompCards([]);

      //добавляем игроку и компьютеру карт
      let i = playerCards.length;
      let j = compCards.length;

      while ((i < 6 || j < 6) && marker < 36) {
        if (i < 6 && marker < 35 && isYourAttack) {
          let num1 = coloda[marker];
          marker++;
          let tempItem = { id: i, num: num1, src: getCardImageSrc(num1) };
          setPlayerCards((prev) => [...prev, tempItem]);
          i++;
        }

        if (j < 6 && marker < 36) {
          let num2 = coloda[marker];
          marker++;
          let tempItem2 = { id: j, num: num2, src: getCardImageSrc(num2) };
          setCompCards((prev) => [...prev, tempItem2]);
          j++;
        }

        if (i < 6 && marker < 36 && !isYourAttack) {
          let num1 = coloda[marker];
          marker++;
          let tempItem = { id: i, num: num1, src: getCardImageSrc(num1) };

          setPlayerCards((prev) => [...prev, tempItem]);
          i++;
        }
      }

      setcolodaCount(36 - marker);
      // setCompcardc(compcards.length);

      wincheck({ marker, compCards, endGame, playerCards });
    }

    setSbros(false);
  }, [sbros]);

  const clThrow = () => {
    if (endGame) {
      console.log('Игра закончена. Чтобы начать новую, обновите страницу');
      return;
    }

    if (currCard === -1) {
      console.log('Выберите карту');
      return;
    }

    if (
      !canThrow({
        actCompCards,
        actPlayerCards,
        cozyr,
        currCard,
        hodNum,
        isYourAttack,
        playerCards,
      })
    ) {
      console.log('Указанную карту кинуть нельзя');
      return;
    }

    if (actPlayerCards.length - actCompCards.length >= compCards.length) {
      console.log(
        'Карту кинуть нельзя. У компьютера нет столько карт чтобы отбить ваши'
      );
      return;
    }

    const tempArray = [...playerCards];

    const newSrc = tempArray[currCard].src;
    const newNum = tempArray[currCard].num;

    tempArray.splice(currCard, 1);

    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i].id = i;
    }
    setPlayerCards(tempArray);
    setActPlayerCards((prev) => [
      ...prev,
      { id: actPlayerCards.length, num: newNum, src: newSrc },
    ]);

    setCurrCard(-1);
  };

  const compZabrat = () => {
    let j = compCards.length;

    const newCompCards: Card[] = [];
    const actCards = [...actPlayerCards, ...actCompCards];
    for (let i = 0; i < actCards.length; i++) {
      newCompCards.push({
        id: j,
        num: actCards[i].num,
        src: actCards[i].src,
      });
      j++;
    }

    setCompCards((prev) => [...prev, ...newCompCards]);
    setActPlayerCards([]);
    setActCompCards([]);
    setSbros(true);
    hodNum = 0;
    isYourHod = true;
    isYourAttack = true;
    console.log('Ход передается игроку');
  };

  const clComphod = () => {
    if (endGame) {
      console.log('Игра закончена. Чтобы начать новую, обновите страницу');
      return;
    }
    //Проверки на то что можно передавать ход компьютеру
    if (isYourHod && isYourAttack) {
      if (actPlayerCards.length === 0) {
        console.log('Сначала необходимо кинуть одну или несколько карт');
        return;
      }

      if (actPlayerCards.length === actCompCards.length) {
        console.log('Компьютер уже походил. Ваша очередь');
        return;
      }
    }

    if (isYourHod && !isYourAttack) {
      if (actPlayerCards.length < actCompCards.length) {
        console.log('Сначала необходимо отбить все кинутые компьютером карты');
        return;
      }
    }
    if (isYourAttack || hodNum > 0) {
      hodNum++;
    }

    if (isYourAttack) {
      console.log('Компьютер отбивает ваши карты');
      const tempArray = [...actPlayerCards];
      for (let i = actCompCards.length; i < tempArray.length; i++) {
        const num1 = tempArray[i].num;
        //стратегия такая - выбираем лучшую(самую минимальную) карту которой можно отбить указанную в порядке обычные карты
        //- козыря+20 та же масть +0 , другая масть *0
        const tempArray2 = [...compCards];
        let imin = -1;
        let vmin = 100;

        for (let j = 0; j < tempArray2.length; j++) {
          const num2 = tempArray2[j].num;
          let tmp = 100;
          if (num2 % 4 === num1 % 4) {
            tmp = 6 + Math.floor(num2 / 4);
          }
          if (num2 % 4 === cozyr % 4) {
            tmp = 26 + Math.floor(num2 / 4);
          }
          if (tmp < 6 + Math.floor(num1 / 4) && num1 % 4 !== cozyr % 4) {
            tmp = 100;
          }
          if (tmp < 26 + Math.floor(num1 / 4) && num1 % 4 === cozyr % 4) {
            tmp = 100;
          }

          if (tmp < vmin) {
            vmin = tmp;
            imin = j;
          }
        }

        if (imin === -1) {
          console.log('Компьютер не может отбить ваши карты. Он их забирает');
          compZabrat();
          return;
        }

        const newSrc = tempArray2[imin].src;
        const newNum = tempArray2[imin].num;
        tempArray2.splice(imin, 1);

        for (let j = 0; j < tempArray2.length; j++) {
          tempArray2[j].id = j;
        }
        setCompCards(tempArray2);
        // setCompcardc(tempArray2.length);

        const tempArray3 = [...actCompCards];
        const tempItem3 = { id: tempArray3.length, num: newNum, src: newSrc };
        tempArray3.push(tempItem3);
        setActCompCards(tempArray3);
        imin = -1;
      }
    }
    // далее не забыть что еще кроме обычного хода есть реагирование на то что у вас есть такая же карта
    // компьютер будет кидать все кроме козырей
    else if (!isYourAttack && hodNum < 2) {
      console.log('Компьютер ходит');

      const tempArray = [...compCards];
      let repeatBonus = new Set();
      let imin = -1;
      let vmin = 100;
      //сначала определяем какую карту будет подкидывать
      for (let i = 0; i < tempArray.length; i++) {
        let num1 = 6 + Math.floor(tempArray[i].num / 4);

        if (tempArray[i].num % 4 === cozyr % 4) {
          num1 += 20;
        }
        if (repeatBonus.has(tempArray[i].num)) {
          num1 -= 3;
        }
        if (num1 < vmin) {
          imin = i;
          vmin = num1;
        }
        repeatBonus.add(tempArray[i].num);
      }

      let num2 = tempArray[imin].num;
      let num3 = 0;
      if (num2 % 4 === cozyr % 4) {
        num3 = 1;
      }
      //специально в обратну сторону потому что может получится что иначе проскочим возможное значение
      for (let i = tempArray.length - 1; i >= 0; i--) {
        let num1 = tempArray[i].num;
        if (
          Math.floor(num1 / 4) === Math.floor(num2 / 4) &&
          (num1 % 4 !== cozyr % 4 || num3 === 1)
        ) {
          //тогда мы эту карту отбираем в активные
          let tempArray3 = [...actCompCards];
          let tempItem3 = {
            id: tempArray3.length,
            num: num1,
            src: getCardImageSrc(num1),
          };
          tempArray3.push(tempItem3);
          setActCompCards(tempArray3);

          tempArray.splice(i, 1);
          for (let j = 0; j < tempArray.length; j++) {
            tempArray[j].id = j;
          }
          setCompCards(tempArray);
        }
      }
    } else if (!isYourAttack && hodNum >= 2) {
      //здесь компьютер подкидывает карты
      console.log('Компьютер подкидывает карты');
      let usedCards = new Set();
      let num1 = 6 + actCompCards[0].num / 4;
      let co = 0;
      usedCards.add(num1);
      let tempArray = [...actPlayerCards];
      for (let i = 0; i < tempArray.length; i++) {
        num1 = 6 + Math.floor(tempArray[i].num / 4);
        usedCards.add(num1);
      }

      tempArray = [...compCards];
      for (let i = tempArray.length - 1; i >= 0; i--) {
        num1 = 6 + Math.floor(tempArray[i].num / 4);
        let b = true;
        if (tempArray[i].num % 4 === cozyr % 4) {
          b = false;
        }
        if (marker >= 35) {
          b = true;
        }
        if (actCompCards.length - actPlayerCards.length >= playerCards.length) {
          b = false;
        }
        if (usedCards.has(num1) && b) {
          //добавляем в активные карты компьютера, удаляем из колоды компьютера
          let tempArray2 = [...actCompCards];
          let tempItem2 = {
            id: tempArray2.length,
            num: tempArray[i].num,
            src: tempArray[i].src,
          };
          tempArray.splice(i, 1);
          tempArray2.push(tempItem2);
          setActCompCards(tempArray2);
          setCompCards(tempArray);
          co++;
        }
      }

      if (co === 0) {
        console.log('Компьютер не может ничего подкинуть. Сбрасываем карты.');
        setSbros(true);
        isYourAttack = true;
        isYourHod = true;
        hodNum = 0;
        console.log('Ход передается игроку');
        return;
      }
    }
    isYourHod = true;
    hodNum++;
  };

  const clZabrat = () => {
    //кнопка забрать- если ее нажимает игрок
    if (endGame) {
      console.log('Игра закончена. Чтобы начать новую, обновите страницу');
      return;
    }

    if (isYourAttack) {
      return;
    }

    let j = playerCards.length;

    const newClCards: Card[] = [];
    const actCards = [...actPlayerCards, ...actCompCards];

    for (let i = 0; i < actCards.length; i++) {
      newClCards.push({
        id: j,
        num: actCards[i].num,
        src: actCards[i].src,
      });
      j++;
    }

    setPlayerCards((prev) => [...prev, ...newClCards]);
    setActPlayerCards([]);
    setActCompCards([]);
    setSbros(true);
    hodNum = 0;
    isYourHod = false;
    isYourAttack = false;
    console.log('Ход передается компьютеру');
  };

  const clSbros = () => {
    if (endGame) {
      console.log('Игра закончена. Чтобы начать новую, обновите страницу');
      return;
    }
    if (!isYourAttack) {
      console.log('Ходит компьютер. Только он может сбросить карты');
      return;
    }
    setSbros(true);
    isYourAttack = false;
    isYourHod = false;
    hodNum = 0;
    console.log('Ход передается компьютеру');
  };

  // игрок отбивает карты по очереди, отбил нажимает ок, далее компьютер принимает ход и подбрасывает карты
  return (
    <div className='App'>
      <p>Количество карт в колоде = {colodaCount}</p>
      Козырь - <img src={getCardImageSrc(cozyr)} />
      {/* <p>Количество карт у компьютера = {compcardc}</p> */}
      <p>У вас на руке следующие карты</p>
      <PlayerCards
        {...{ playerCards, endGame, isYourHod, setCurrCard, currCard }}
      />
      <button id='btn_throw' onClick={() => clThrow()}>
        Кинуть карту
      </button>
      <button id='btn-comphod' onClick={() => clComphod()}>
        Ход компьютера
      </button>
      <button id='btn-sbros' onClick={() => clSbros()}>
        Сбросить
      </button>
      <button id='btn-zabrat' onClick={() => clZabrat()}>
        Забрать
      </button>
      <p>Ваши активные карты</p>
      <ActiveCards playerCards={actPlayerCards} />
      <p>Активные карты компьютера</p>
      <ActiveCards playerCards={actCompCards} />
      <p>Карты компьютера</p>
      <ActiveCards playerCards={compCards} />
    </div>
  );
};

export default App;
