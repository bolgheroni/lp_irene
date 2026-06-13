// All recipient-facing strings and ordered data. Edit here, don't hunt through logic.

export const LANDING = {
  line: 'Three little puzzles. Then something for you.',
  startLabel: 'Start',
};

export const PUZZLE_1 = {
  title: 'Pick the real Italian dish.',
  options: [
    { id: 'cacio',     label: 'Cacio e Pepe',        img: 'assets/food/cacio_pepe.webp',          correct: true,  reaction: '' },
    { id: 'bolognese', label: 'Spaghetti Bolognese', img: 'assets/food/spaghetti_bolognese.jpeg', correct: false, reaction: "Tourist trap. No Italian eats this." },
    { id: 'alfredo',   label: 'Fettuccine Alfredo',  img: 'assets/food/fettucine_alfredo.webp',   correct: false, reaction: 'American invention. Try again.' },
    { id: 'melanzane', label: 'Lasagna di Melanzane',img: 'assets/food/lasanha_berinjela.webp',   correct: false, reaction: '😏 nice try.' },
  ],
};

export const PUZZLE_2 = {
  title: 'Now my side. Pick the real one.',
  options: [
    { id: 'pao',          label: 'Pão de queijo',         img: 'assets/food/pao_de_queijo.jpg',      correct: true,  reaction: '' },
    { id: 'brilhadeiro',  label: 'Brilhadeiro',           img: 'assets/food/brigadeiro.jpg',         correct: false, reaction: "'Shiny one' — almost. The real one is brigadeiro." },
    { id: 'beijoada',     label: 'Beijoada',              img: 'assets/food/feijoada.jpg',           correct: false, reaction: "'Kissed one' — cute, but no." },
    { id: 'lasanha',      label: 'Lasanha de berinjela',  img: 'assets/food/lasanha_berinjela.webp', correct: false, reaction: "Don't even start." },
  ],
};

export const SLOT = {
  title: 'Last one. What are our Sims called?',
  pullLabel: 'Pull',
  jackpotLine: "That's us. 💌",
  pressPlayLabel: 'Press play to start the show',
  // Order matters: index 1 on each reel is the jackpot target.
  leftReel:  ['Bolgheroni', 'Boquetoni', 'Bolognese', 'Bombolone', 'Brigadeiro', 'Boquerone'],
  rightReel: ['Mazzucco',   'Zucchero',  'Zuccotto',  'Zuccone',   'Zucchina',   'Zampone'],
  jackpotIndices: { left: 1, right: 1 }, // Boquetoni + Zucchero
  // Slotted by (leftIndex,rightIndex) for guaranteed lines on memorable combos.
  // Anything not listed uses one of the generic reactions below.
  specificReactions: {
    '0,0': 'Bolgheroni Mazzucco. Too official. No.',
    '3,4': 'Bombolone Zucchina. Sounds like a dessert. No.',
    '5,5': 'Boquerone Zampone. We are not selling cured meats. No.',
    '2,2': 'Bolognese Zuccotto. Two desserts walk into a bar. No.',
  },
  genericReactions: [
    'Quasi! Ma no.',
    'Cute. Wrong, but cute.',
    'Almost.',
    "Pull again — I believe in you.",
    'Nope. Keep going.',
    "That's a band name, not us. No.",
    'Closer. Maybe.',
    "I'd marry that name. Still no.",
  ],
};

export const REEL = {
  // file is relative to repo root. caption can be ''.
  // Final photo (couple_my_favorite.jpg) MUST be last; it gets special treatment.
  photos: [
    { file: 'assets/photos/first_date.jpg',         caption: 'where it started.' },
    { file: 'assets/photos/ire_beautiful.jpg',      caption: '' },
    { file: 'assets/photos/couple_vatican.jpg',     caption: 'Rome.' },
    { file: 'assets/photos/couple_train.jpg',       caption: 'on our way somewhere.' },
    { file: 'assets/photos/couple_lunch.jpg',       caption: 'sunday lunch.' },
    { file: 'assets/photos/couple_playing.jpg',     caption: '' },
    { file: 'assets/photos/couple_her_b_day.jpg',   caption: 'your day.' },
    { file: 'assets/photos/couple_bed.jpg',         caption: '' },
    { file: 'assets/photos/couple_bed_2.jpg',       caption: '' },
    { file: 'assets/photos/couple_cute.jpg',        caption: '' },
    { file: 'assets/photos/couple_cute_2.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_3.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_4.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_5.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_6.jpg',      caption: '' },
    { file: 'assets/photos/couple_cute_7.jpg',      caption: '' },
    { file: 'assets/photos/couple_cool.jpg',        caption: '' },
    { file: 'assets/photos/couple_cool_2.jpg',      caption: '' },
    { file: 'assets/photos/couple_cool_3.jpg',      caption: '' },
    { file: 'assets/photos/couple_2.jpg',           caption: '' },
    { file: 'assets/photos/couple_fun_1.jpg',       caption: '' },
    { file: 'assets/photos/couple_funny_2.jpg',     caption: '' },
    { file: 'assets/photos/her_funny.jpg',          caption: '' },
    { file: 'assets/photos/her_funny_2.jpg',        caption: '' },
    { file: 'assets/photos/her_pretty.jpg',         caption: '' },
    { file: 'assets/photos/ire_funny.jpg',          caption: '' },
    { file: 'assets/photos/couple_my_favorite.jpg', caption: 'my favorite. always.' }, // MUST stay last
  ],
  perPhotoMs: 4000,
  finalPhotoMs: 6500,
  crossfadeMs: 800,
  skipLabel: 'skip to the wall →',
};

export const WALL = {
  ourSongLabel: '♪ Our song',
  ourSongHref: 'https://www.youtube.com/watch?v=J36z7AnhvOM',
};
