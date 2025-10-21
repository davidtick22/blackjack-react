import React from 'react';
import ReactDOM from 'react-dom/client';
import BlackJack from './components/BlackJack';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <BlackJack />
    </React.StrictMode>
);