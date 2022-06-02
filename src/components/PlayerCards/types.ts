import { Card } from '../../types';

export type PlayerCardsProps = {
  playerCards: Card[];
  endGame: boolean;
  isYourHod: boolean;
  setCurrCard: React.Dispatch<React.SetStateAction<number>>;
  currCard: number;
};
