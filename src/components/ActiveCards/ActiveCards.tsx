import React, { FC } from 'react';

import { ActiveCardsProps } from './types';

const ActiveCards: FC<ActiveCardsProps> = ({ playerCards }) => {
  return (
    <div>
      {playerCards.map(({ src, id }) => (
        <img src={src} id={`${id}`} key={`${src}-${id}`} />
      ))}
    </div>
  );
};

export default ActiveCards;
