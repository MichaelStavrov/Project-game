import React from 'react';
import ReactDOMClient from 'react-dom/client';

const container = document.getElementById('root');

if (container) {
  const root = ReactDOMClient.createRoot(container);
  root.render(<div>Hello</div>);
}
