import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';

// Simple shuffle util
function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { count: '1' } },
      { params: { count: '3' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps() {
  const cardsDir = path.join(process.cwd(), 'public', 'cards');
  let files = [];
  try {
    files = fs.readdirSync(cardsDir);
  } catch (err) {
    console.error('Cannot read cards directory', err);
  }
  const cards = files.map((file) => ({
    file,
    name: file.replace(/\.(jpg|jpeg)$/i, ''),
  }));
  return { props: { cards } };
}

export default function CardsPage({ cards }) {
  const router = useRouter();
  const { count } = router.query;
  const cnt = Number(count);
  const cardsToPick = cnt === 1 ? 1 : 3;
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState([]);
  const isInitial = selected.length === 0;

  useEffect(() => {
    // Prepare 9 random cards for layout
    const shuffled = shuffle(cards).slice(0, 9);
    setDeck(shuffled);

    // Telegram WebApp init
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, [cards]);

  const handleClick = (card) => {
    if (selected.includes(card.name)) return;
    if (selected.length >= cardsToPick) return;
    setSelected((prev) => [...prev, card.name]);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify({ cards: selected }));
    }
  };

  let title = `Ты выбрал ${selected.length} из ${cardsToPick}, выбери ещё`;
  if (selected.length === 0) {
    title = `Выбери ${cardsToPick} ${cardsToPick === 1 ? 'карту' : 'карты'}`;
  } else if (selected.length === cardsToPick) {
    title = 'Отлично, нажми кнопку продолжить';
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-3 text-white relative">
      <div className="overlay"></div>
      <h1 className={`hint font-bold mb-3 text-center ${isInitial ? 'text-large-title' : ''}`}>{title}</h1>
      <div className="grid grid-cols-3 gap-2" id="cardsContainer">
        {deck.map((card) => (
          <button
            key={card.file}
            onClick={() => handleClick(card)}
            className={`relative w-28 h-44 perspective ${selected.includes(card.name) ? 'selected cursor-default' : 'cursor-pointer'}`}
          >
            <div className={`preserve-3d h-full w-full duration-500 ${selected.includes(card.name) ? 'rotate-y-180' : ''}`}>
              {/* back */}
              <div className="absolute inset-0 backface-hidden">
                <Image src="/textures/card_back.png" alt="back" fill sizes="128px" />
              </div>
              {/* front */}
              <div className="absolute inset-0 rotate-y-180 backface-hidden">
                <Image src={`/cards/${card.file}`} alt={card.name} fill sizes="128px" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected.length === cardsToPick && (
        <button
          id="continueBtn"
          onClick={handleContinue}
          className="mt-6 px-8 py-4 bg-yellow-500 rounded text-black font-semibold"
        >
          Продолжить
        </button>
      )}
    </div>
  );
} 