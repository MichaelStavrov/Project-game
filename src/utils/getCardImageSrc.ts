import cardsImages from '../images';

export const getCardImageSrc = (index: number) => {
  const mast = index % 4;
  const num = Math.floor(index / 4) + 6;

  const currCard =
    cardsImages.find((card) => card.label === `${num}_${mast}`)?.value ??
    cardsImages[0].value;

  return currCard;
};
