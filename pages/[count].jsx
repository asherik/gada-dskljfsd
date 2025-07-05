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

// Mapping from filename (without extension) to Russian card name
const fileToRu = {
  'the_chariot': 'Колесница',
  'the_fool': 'Шут',
  'the_magician': 'Волшебник',
  'the_high_priestess': 'Верховная жрица',
  'the_empress': 'Императрица',
  'the_emperor': 'Император',
  'the_hierophant': 'Иерофант',
  'the_star': 'Звезда',
  'the_sun': 'Солнце',
  'the_lovers': 'Любовник',
  'strength': 'Сила',
  'the_hermit': 'Отшельник',
  'justice': 'Судья',
  'wheel_of_fortune': 'Колесо удачи',
  'death': 'Смерть',
  'the_handed_man': 'Повешенный человек',
  'temperance': 'Сдержанность',
  'the_world': 'Мир',
  'judgement': 'Кара',
  'the_moon': 'Луна',
  'the_tower': 'Башня',
  'the_devil': 'Дьявол',
  '1d': 'Туз Денариев',
  '2d': '2 Пентаклей',
  '3d': '3 Пентаклей',
  '4d': '4 Пентаклей',
  '5d': '5 Пентаклей',
  '6d': '6 Пентаклей',
  '7d': '7 Пентаклей',
  '8d': '8 Пентаклей',
  '9d': '9 Пентаклей',
  '10d': '10 Пентаклей',
  'knight_pentacles': 'Король Пентаклей',
  'qd': 'Королева Пентаклей',
  'kd': 'Рыцарь Пентаклей',
  'pd': 'Паж Пентаклей',
  '1s': 'Туз Мечей',
  '2s': '2 Мечей',
  '3s': '3 Мечей',
  '4s': '4 Мечей',
  '5s': '5 Мечей',
  '6s': '6 Мечей',
  '7s': '7 Мечей',
  '8s': '8 Мечей',
  '9s': '9 Мечей',
  '10s': '10 Мечей',
  'ks': 'Рыцарь Мечей',
  'ps': 'Паж Мечей',
  'king_swords': 'Король Мечей',
  'qs': 'Королева Мечей',
  '1g': 'Туз Жезлов',
  '2g': '2 Жезлов',
  '3g': '3 Жезлов',
  '4g': '4 Жезлов',
  '5g': '5 Жезлов',
  '6g': '6 Жезлов',
  '7g': '7 Жезлов',
  '8g': '8 Жезлов',
  '9g': '9 Жезлов',
  '10g': '10 Жезлов',
  'qg': 'Королева Жезлов',
  'kg': 'Рыцарь Жезлов',
  'pg': 'Паж Жезлов',
  'king_g': 'Король Жезлов',
  '1c': 'Туз Кубков',
  '2c': '2 Кубков',
  '3c': '3 Кубков',
  '4c': '4 Кубков',
  '5c': '5 Кубков',
  '6c': '6 Кубков',
  '7c': '7 Кубков',
  '8c': '8 Кубков',
  '9c': '9 Кубков',
  '10c': '10 Кубков',
  'king_c': 'Король Кубков',
  'qc': 'Королева Кубков',
  'kc': 'Рыцарь Кубков',
  'pc': 'Паж Кубков'
};

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
  const cards = files.map((file) => {
    const key = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    return {
      file,
      name: key,
      ru: fileToRu[key] || key,
    };
  });
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
      // При изменении размера окна (например, клавиатура / ресайз десктоп-клиента)
      window.Telegram.WebApp.onEvent('viewportChanged', () => {
        window.Telegram.WebApp.expand();
      });
    }
  }, [cards]);

  const handleClick = (card) => {
    if (selected.includes(card.ru)) return;
    if (selected.length >= cardsToPick) return;
    setSelected((prev) => [...prev, card.ru]);
  };

  const handleContinue = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      console.log('sending to bot', selected);
      window.Telegram.WebApp.sendData(JSON.stringify({ cards: selected }));
    } else {
      console.log('Telegram WebApp not found');
    }
  };

  let titleNode;
  if (selected.length === 0) {
    titleNode = `Выбери ${cardsToPick} ${cardsToPick === 1 ? 'карту' : 'карты'}`;
  } else if (selected.length === cardsToPick) {
    titleNode = 'Отлично, нажми на кнопку «Продолжить»';
  } else {
    titleNode = `Ты выбрал(а) ${selected.length} из ${cardsToPick}`;
  }

  return (
    <div className="flex flex-col items-center pt-3 text-white relative" style={{minHeight: 'var(--tg-viewport-height)'}}>
      <div className="overlay"></div>
      <div className="w-full max-w-[500px] px-6 sm:px-8">
        <h1 className={`hint font-bold mb-3 text-center ${isInitial ? 'text-large-title' : ''}`}>{titleNode}</h1>
        <div className="grid grid-cols-3 gap-3 w-full max-w-[500px]" id="cardsContainer" style={{gridTemplateRows:'repeat(3, auto)'}}>
          {deck.map((card) => (
            <button
              key={card.file}
              onClick={() => handleClick(card)}
              className={`card-button perspective ${selected.includes(card.ru) ? 'selected cursor-default' : 'cursor-pointer'}`}
            >
              <div className={`preserve-3d w-full h-full duration-500 ${selected.includes(card.ru) ? 'rotate-y-180' : ''}`}>
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
            className="mt-6 px-8 py-4 bg-yellow-500 rounded text-black font-semibold block mx-auto"
          >
            Продолжить
          </button>
        )}
      </div>
    </div>
  );
} 