// Инициализация Telegram WebApp
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// Раскрываем окно повторно при изменении viewport (десктоп-клиент, клавиатура)
window.Telegram.WebApp.onEvent('viewportChanged', () => {
  window.Telegram.WebApp.expand();
});

// Функция для получения параметра start_param


// Получаем параметр и выводим его в alert





// Список карт
const cardImages = {
    'Колесница': 'css/cards/the_chariot.png',
    'Шут': 'css/cards/the_fool.png',
    'Волшебник': 'css/cards/the_magician.png',
    'Верховная жрица': 'css/cards/the_high_priestess.png',
    'Императрица': 'css/cards/the_empress.png',
    'Император': 'css/cards/the_emperor.png',
    'Иерофант': 'css/cards/the_hierophant.png',
    'Звезда': 'css/cards/the_star.png',
    'Солнце': 'css/cards/the_sun.png',
    'Любовник': 'css/cards/the_lovers.png',
    'Сила': 'css/cards/strength.png',
    'Отшельник': 'css/cards/the_hermit.png',
    'Судья': 'css/cards/justice.png',
    'Колесо удачи': 'css/cards/wheel_of_fortune.png',
    'Смерть': 'css/cards/death.png',
    'Повешенный человек': 'css/cards/the_handed_man.png',
    'Сдержанность': 'css/cards/temperance.png',
    'Справедливость':'css/cards/justice.png',
    'Мир': 'css/cards/the_world.png',
    'Кара': 'css/cards/judgement.png',
    'Луна': 'css/cards/the_moon.png',
    'Башня': 'css/cards/the_tower.png',
    'Дьявол': 'css/cards/the_devil.png',
    'Туз Денариев': 'css/cards/1d.png',
    '2 Пентаклей': 'css/cards/2d.png',
    '3 Пентаклей': 'css/cards/3d.png',
    '4 Пентаклей': 'css/cards/4d.png',
    '5 Пентаклей': 'css/cards/5d.png',
    '6 Пентаклей': 'css/cards/6d.png',
    '7 Пентаклей': 'css/cards/7d.png',
    '8 Пентаклей': 'css/cards/8d.png',
    '9 Пентаклей': 'css/cards/9d.png',
    '10 Пентаклей': 'css/cards/10d.png',
    'Король Пентаклей': 'css/cards/knight_pentacles.png',
    'Королева Пентаклей': 'css/cards/qd.png',
    'Рыцарь Пентаклей': 'css/cards/kd.png',
    'Паж Пентаклей': 'css/cards/pd.png',
    'Туз Мечей': 'css/cards/1s.png',
    '2 Мечей': 'css/cards/2s.png',
    '3 Мечей': 'css/cards/3s.png',
    '4 Мечей': 'css/cards/4s.png',
    '5 Мечей': 'css/cards/5s.png',
    '6 Мечей': 'css/cards/6s.png',
    '7 Мечей': 'css/cards/7s.png',
    '8 Мечей': 'css/cards/8s.png',
    '9 Мечей': 'css/cards/9s.png',
    '10 Мечей': 'css/cards/10s.png',
    'Рыцарь Мечей': 'css/cards/ks.png',
    'Паж Мечей': 'css/cards/ps.png',
    'Король Мечей': 'css/cards/king_swords.png',
    'Королева Мечей': 'css/cards/qs.png',
    'Туз Жезлов': 'css/cards/1g.png',
    '2 Жезлов': 'css/cards/2g.png',
    '3 Жезлов': 'css/cards/3g.png',
    '4 Жезлов': 'css/cards/4g.png',
    '5 Жезлов': 'css/cards/5g.png',
    '6 Жезлов': 'css/cards/6g.png',
    '7 Жезлов': 'css/cards/7g.png',
    '8 Жезлов': 'css/cards/8g.png',
    '9 Жезлов': 'css/cards/9g.png',
    '10 Жезлов': 'css/cards/10g.png',
    'Королева Жезлов': 'css/cards/qg.png',
    'Рыцарь Жезлов': 'css/cards/kg.png',
    'Паж Жезлов': 'css/cards/pg.png',
    'Король Жезлов': 'css/cards/king_g.png',
    'Туз Кубков': 'css/cards/1c.png',
    '2 Кубков': 'css/cards/2c.png',
    '3 Кубков': 'css/cards/3c.png',
    '4 Кубков': 'css/cards/4c.png',
    '5 Кубков': 'css/cards/5c.png',
    '6 Кубков': 'css/cards/6c.png',
    '7 Кубков': 'css/cards/7c.png',
    '8 Кубков': 'css/cards/8c.png',
    '9 Кубков': 'css/cards/9c.png',
    '10 Кубков': 'css/cards/10c.png',
    'Король Кубков': 'css/cards/king_с.png',
    'Королева Кубков': 'css/cards/qc.png',
    'Рыцарь Кубков': 'css/cards/kc.png',
    'Паж Кубков': 'css/cards/pc.png',
};
// Функция для создания звездопада

window.onload = function () {
    const startParam = getStartParam();
    if (startParam) {
        alert(`Start Param: ${startParam}`);
    } else {
        alert('Start Param not found');
    }
};
// Основная логика: выбор случайных карт
const shuffledCards = Object.entries(cardImages)
    .sort(() => 0.5 - Math.random())
    .slice(0, 9); // Берем 9 случайных карт

const cardsContainer = document.getElementById("cardsContainer");
let selectedCards = [];
let selectedCardNames = [];

if (!cardsContainer) {
    console.error("Элемент с id='cardsContainer' не найден!");
} else {
    shuffledCards.forEach(([cardName, imagePath]) => {
        const card = document.createElement("div");
        card.classList.add("tarot-card", "cursor-pointer");
        card.innerHTML = `
            <div class="card-back"></div>
            <div class="card-placeholder" style="background-image: url('${imagePath}')"></div>`;

        card.addEventListener("click", function () {
            if (!selectedCards.includes(this) && selectedCards.length < 3) {
                selectedCards.push(this);
                selectedCardNames.push(cardName);
                this.classList.add("flipped", "selected");
                this.classList.remove("cursor-pointer");
            }
            const continueBtn = document.getElementById("continueBtn");
            if (continueBtn) {
                continueBtn.classList.toggle("hidden", selectedCards.length !== 3);
            }
        });





        cardsContainer.appendChild(card);
    });
}


const continueBtn = document.getElementById("continueBtn");
if (continueBtn) {
    continueBtn.addEventListener("click", function() {
        const data = { cards: selectedCardNames};
        console.log("Отправляем в бота:", data);
        window.Telegram.WebApp.sendData(JSON.stringify(data));
    });
} else {
    console.error("Элемент с id='continueBtn' не найден!");
}