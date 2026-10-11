export interface VocabularyWord {
  word: string;
  korean: string;
  phonetic: string;
  definition: string;
  example: string;
  category: 'character' | 'nature' | 'emotion' | 'action';
  icon: string;
}

export interface StoryQuestion {
  id: string;
  question: string;
  koreanQuestion: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StorySentence {
  text: string;
  highlightWords?: string[];
}

export interface StoryPage {
  pageNumber: number;
  title: string;
  sentences: StorySentence[];
  defaultImagePrompt: string;
  illustrationSvgTheme: {
    bgGradient: string;
    primaryElement: string;
    accentColor: string;
    description: string;
  };
  checkpointQuestion?: StoryQuestion;
  keyWords: string[];
}

export const VOCABULARY_LIST: Record<string, VocabularyWord> = {
  dragon: {
    word: 'dragon',
    korean: '용 (불을 뿜는 전설의 동물)',
    phonetic: '/ˈdræɡ.ən/',
    definition: 'A friendly mythical winged creature with scales and magic fire.',
    example: 'Lumi is a gentle little dragon.',
    category: 'character',
    icon: '🐉',
  },
  fire: {
    word: 'fire',
    korean: '불, 불꽃',
    phonetic: '/ˈfaɪ.ər/',
    definition: 'Bright, warm glowing flames and golden sparks.',
    example: 'Lumi lost her warm golden fire.',
    category: 'nature',
    icon: '🔥',
  },
  forest: {
    word: 'forest',
    korean: '숲, 삼림',
    phonetic: '/ˈfɔːr.ɪst/',
    definition: 'A large, peaceful land covered with green trees and flowers.',
    example: 'She walks bravely into the deep forest.',
    category: 'nature',
    icon: '🌲',
  },
  rabbit: {
    word: 'rabbit',
    korean: '토끼',
    phonetic: '/ˈræb.ɪt/',
    definition: 'A soft, fluffy animal with long ears that loves hopping.',
    example: 'Lumi meets a friendly white rabbit.',
    category: 'character',
    icon: '🐰',
  },
  bird: {
    word: 'bird',
    korean: '새',
    phonetic: '/bɜːrd/',
    definition: 'A feathered creature with wings that sings sweet melodies.',
    example: 'A singing blue bird rests on the river rock.',
    category: 'character',
    icon: '🐦',
  },
  river: {
    word: 'river',
    korean: '강, 하천',
    phonetic: '/ˈrɪv.ər/',
    definition: 'A long flowing stream of sparkling crystal-clear water.',
    example: 'They walk together beside the blue river.',
    category: 'nature',
    icon: '🌊',
  },
  mountain: {
    word: 'mountain',
    korean: '산',
    phonetic: '/ˈmaʊn.tən/',
    definition: 'A tall rocky peak reaching up high into the sunny clouds.',
    example: 'High on the mountain, golden sparks glow.',
    category: 'nature',
    icon: '🏔️',
  },
  lost: {
    word: 'lost',
    korean: '잃어버린, 길을 잃은',
    phonetic: '/lɔːst/',
    definition: 'Not able to be found; misplaced or gone away.',
    example: 'Lumi was sad because she lost her fire.',
    category: 'emotion',
    icon: '🔍',
  },
  afraid: {
    word: 'afraid',
    korean: '두려워하는, 무서워하는',
    phonetic: '/əˈfreɪd/',
    definition: 'Feeling scared or worried when something unusual happens.',
    example: 'At first, Lumi felt afraid in the quiet woods.',
    category: 'emotion',
    icon: '🥺',
  },
  brave: {
    word: 'brave',
    korean: '용감한',
    phonetic: '/breɪv/',
    definition: 'Ready to try your best and keep going even when scared.',
    example: 'Lumi was brave and climbed all the way to the top!',
    category: 'emotion',
    icon: '⭐',
  },
  friend: {
    word: 'friend',
    korean: '친구',
    phonetic: '/frend/',
    definition: 'A kind companion who helps and cares for you.',
    example: 'The rabbit and the bird are Lumi\'s true friends.',
    category: 'character',
    icon: '🤝',
  },
  help: {
    word: 'help',
    korean: '돕다, 도와주다',
    phonetic: '/help/',
    definition: 'To assist someone and make a hard task easier.',
    example: 'Her kind friends offered to help look for her fire.',
    category: 'action',
    icon: '🤲',
  },
};

export const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    title: 'Meet Lumi the Dragon',
    sentences: [
      {
        text: 'This is Lumi.',
        highlightWords: [],
      },
      {
        text: 'Lumi is a little green dragon.',
        highlightWords: ['dragon'],
      },
      {
        text: 'She lives in a warm and cozy cave.',
        highlightWords: [],
      },
    ],
    defaultImagePrompt: 'A cute friendly small emerald-green baby dragon named Lumi with sparkling purple eyes and tiny soft wings, sitting happily inside a warm cozy cave with glowing lantern lights and soft moss pillows, storybook children illustration, warm colors',
    illustrationSvgTheme: {
      bgGradient: 'from-emerald-100 via-teal-50 to-amber-50',
      primaryElement: 'dragon_cave',
      accentColor: '#10b981',
      description: 'Lumi in her cozy mountain cave with warm lanterns',
    },
    keyWords: ['dragon'],
  },
  {
    pageNumber: 2,
    title: 'The Big Sneeze',
    sentences: [
      {
        text: 'One sunny morning, Lumi sneezes.',
        highlightWords: [],
      },
      {
        text: '"Achoo!" Oh no! Where is her fire?',
        highlightWords: ['fire'],
      },
      {
        text: 'Lumi cannot breathe fire today! Her fire is lost.',
        highlightWords: ['fire', 'lost'],
      },
    ],
    defaultImagePrompt: 'Cute little baby green dragon sneezing with funny surprised expression, puff of tiny harmless grey smoke with zero fire, bright morning sunshine outside cave entrance, children storybook fairytale style',
    illustrationSvgTheme: {
      bgGradient: 'from-amber-100 via-orange-50 to-rose-50',
      primaryElement: 'dragon_sneeze',
      accentColor: '#f59e0b',
      description: 'Lumi sneezing "Achoo!" and discovering her flame is missing',
    },
    checkpointQuestion: {
      id: 'q1',
      question: 'What did Lumi lose when she sneezed?',
      koreanQuestion: '루미가 재채기했을 때 무엇을 잃어버렸나요?',
      options: ['Her warm fire', 'Her little shoes', 'Her cozy cave'],
      correctAnswer: 0,
      explanation: 'That is right! Lumi sneezed "Achoo!" and her fire disappeared.',
    },
    keyWords: ['fire', 'lost'],
  },
  {
    pageNumber: 3,
    title: 'Into the Forest',
    sentences: [
      {
        text: 'Lumi feels afraid.',
        highlightWords: ['afraid'],
      },
      {
        text: 'She walks into the dark green forest.',
        highlightWords: ['forest'],
      },
      {
        text: '"Have you seen my fire?" Lumi asks the tall trees.',
        highlightWords: ['fire', 'forest'],
      },
    ],
    defaultImagePrompt: 'Small shy green baby dragon tiptoeing cautiously into a lush enchanted forest with tall mossy oak trees, soft sunbeams filtering through leaves, gentle magical atmosphere, children storybook picture',
    illustrationSvgTheme: {
      bgGradient: 'from-emerald-200 via-green-100 to-teal-50',
      primaryElement: 'forest_walk',
      accentColor: '#059669',
      description: 'Lumi walking into the tall green forest asking the trees',
    },
    checkpointQuestion: {
      id: 'q2',
      question: 'How did Lumi feel when she lost her fire?',
      koreanQuestion: '불을 잃어버렸을 때 루미의 기분은 어땠나요?',
      options: ['Afraid and worried', 'Very angry', 'Sleepy and tired'],
      correctAnswer: 0,
      explanation: 'Great job! Lumi felt afraid at first, but she bravely kept walking.',
    },
    keyWords: ['afraid', 'forest', 'fire'],
  },
  {
    pageNumber: 4,
    title: 'A New Fluffy Friend',
    sentences: [
      {
        text: 'Lumi meets a fluffy white rabbit.',
        highlightWords: ['rabbit', 'friend'],
      },
      {
        text: '"Have you seen my fire?" asks Lumi.',
        highlightWords: ['fire'],
      },
      {
        text: '"No, but I can help you look!" says the rabbit.',
        highlightWords: ['help', 'friend'],
      },
    ],
    defaultImagePrompt: 'Adorable small green baby dragon talking with a fluffy white bunny rabbit holding a pink wildflower in a sunlit forest clearing, friendly kind expressions, charming picture book art',
    illustrationSvgTheme: {
      bgGradient: 'from-lime-100 via-emerald-50 to-yellow-50',
      primaryElement: 'rabbit_meeting',
      accentColor: '#84cc16',
      description: 'Lumi meets the kind fluffy white rabbit who offers to help',
    },
    checkpointQuestion: {
      id: 'q3',
      question: 'Who did Lumi meet first in the forest to help her?',
      koreanQuestion: '숲에서 루미를 돕기 위해 처음 만난 동물은 누구인가요?',
      options: ['A fluffy white rabbit', 'A scary brown bear', 'A sleeping wolf'],
      correctAnswer: 0,
      explanation: 'Awesome! The fluffy white rabbit said "I can help you look!"',
    },
    keyWords: ['rabbit', 'help', 'friend'],
  },
  {
    pageNumber: 5,
    title: 'By the Sparkling River',
    sentences: [
      {
        text: 'Lumi and the rabbit walk to a sparkling blue river.',
        highlightWords: ['rabbit', 'river', 'friend'],
      },
      {
        text: 'A singing blue bird lands on a smooth rock.',
        highlightWords: ['bird'],
      },
      {
        text: '"Have you seen my fire?" asks Lumi.',
        highlightWords: ['fire'],
      },
    ],
    defaultImagePrompt: 'Cute green baby dragon and white rabbit standing by a sparkling crystal-blue flowing river, looking up at a cheerful little blue songbird perched on a river stone, bright whimsical storybook style',
    illustrationSvgTheme: {
      bgGradient: 'from-sky-200 via-cyan-100 to-blue-50',
      primaryElement: 'river_bird',
      accentColor: '#0284c7',
      description: 'Lumi and rabbit by the sparkling blue river talking to the blue bird',
    },
    keyWords: ['river', 'bird', 'fire'],
  },
  {
    pageNumber: 6,
    title: 'The Golden Spark on High',
    sentences: [
      {
        text: 'The bird chirps, "Look up! High on the mountain, there is a warm golden spark!"',
        highlightWords: ['bird', 'mountain'],
      },
      {
        text: '"Let\'s go together!" says her friend.',
        highlightWords: ['friend', 'help'],
      },
    ],
    defaultImagePrompt: 'Little blue bird chirping joyfully and pointing wing toward a magnificent tall purple-blue mountain in the distance, tiny golden spark glowing at the summit, cute baby dragon and rabbit smiling, storybook painting',
    illustrationSvgTheme: {
      bgGradient: 'from-violet-100 via-indigo-50 to-sky-100',
      primaryElement: 'mountain_pointing',
      accentColor: '#6366f1',
      description: 'The blue bird points toward the tall mountain peak',
    },
    checkpointQuestion: {
      id: 'q4',
      question: 'Where does the bird tell Lumi to look?',
      koreanQuestion: '새는 루미에게 어디를 보라고 말했나요?',
      options: ['High on the mountain', 'Under a heavy stone', 'Deep in the dark water'],
      correctAnswer: 0,
      explanation: 'Correct! The bird spotted a warm golden spark high on the mountain.',
    },
    keyWords: ['mountain', 'bird', 'friend'],
  },
  {
    pageNumber: 7,
    title: 'Be Brave, Lumi!',
    sentences: [
      {
        text: 'The mountain is steep and high.',
        highlightWords: ['mountain'],
      },
      {
        text: 'Lumi is tired, but her friends say, "Be brave, Lumi! You can do it!"',
        highlightWords: ['friend', 'brave', 'help'],
      },
      {
        text: 'Lumi smiles and climbs up with all her strength.',
        highlightWords: ['brave'],
      },
    ],
    defaultImagePrompt: 'Small green baby dragon climbing up a scenic rocky flower-dotted mountain path, accompanied by fluffy white bunny and little blue bird cheering her on, sunset glow on the peaks, heartwarming storybook scene',
    illustrationSvgTheme: {
      bgGradient: 'from-orange-100 via-amber-50 to-rose-100',
      primaryElement: 'mountain_climb',
      accentColor: '#ea580c',
      description: 'Lumi climbing the mountain with her encouraging friends',
    },
    keyWords: ['mountain', 'brave', 'friend'],
  },
  {
    pageNumber: 8,
    title: 'The Inner Fire and Joy',
    sentences: [
      {
        text: 'At the top of the mountain, Lumi feels a warm glow in her heart.',
        highlightWords: ['mountain'],
      },
      {
        text: '"Whoosh!" Golden sparks fly! Lumi found her fire!',
        highlightWords: ['fire', 'brave'],
      },
      {
        text: '"I can do it!" she cheers. Believe in yourself!',
        highlightWords: ['brave'],
      },
    ],
    defaultImagePrompt: 'Joyful little baby green dragon on a scenic mountain peak breathing beautiful sparkling golden magical fairy flames into the colorful dusk sky, rabbit and blue bird celebrating together with joy, triumphant storybook masterpiece',
    illustrationSvgTheme: {
      bgGradient: 'from-amber-200 via-yellow-100 to-orange-100',
      primaryElement: 'fire_celebration',
      accentColor: '#d97706',
      description: 'Lumi breathing bright golden fire at the mountain summit with her friends cheering',
    },
    checkpointQuestion: {
      id: 'q5',
      question: 'How did Lumi get her fire back?',
      koreanQuestion: '루미는 어떻게 불을 다시 찾게 되었나요?',
      options: ['By being brave and believing in herself', 'By eating hot chili peppers', 'By buying a box of matches'],
      correctAnswer: 0,
      explanation: 'Superstar! By being brave, trying hard, and having good friends, Lumi found her fire inside!',
    },
    keyWords: ['fire', 'brave', 'mountain'],
  },
];

// Story sequence cards for the Post-Reading Drag/Order activity (Screen 9)
export interface SequenceCard {
  id: string;
  stepNumber: number;
  title: string;
  korean: string;
  emoji: string;
  description: string;
}

export const SEQUENCE_CARDS: SequenceCard[] = [
  { id: 'forest', stepNumber: 1, title: 'Forest', korean: '숲', emoji: '🌲', description: 'Lumi walked into the green forest.' },
  { id: 'rabbit', stepNumber: 2, title: 'Rabbit', korean: '토끼', emoji: '🐰', description: 'Lumi met the kind fluffy rabbit.' },
  { id: 'river', stepNumber: 3, title: 'River', korean: '강', emoji: '🌊', description: 'They walked to the sparkling river.' },
  { id: 'bird', stepNumber: 4, title: 'Bird', korean: '새', emoji: '🐦', description: 'The blue bird showed the mountain.' },
  { id: 'mountain', stepNumber: 5, title: 'Mountain', korean: '산', emoji: '🏔️', description: 'Lumi climbed high and found her fire!' },
];

export const SENTENCE_COMPLETIONS = [
  {
    text: 'she climbed the tall mountain with her friends',
    korean: '친구들과 함께 높은 산을 올랐기 때문에',
  },
  {
    text: 'she did not give up even when she was afraid',
    korean: '두려웠지만 결코 포기하지 않았기 때문에',
  },
  {
    text: 'she asked for help and believed in herself',
    korean: '도움을 청하고 자신을 믿었기 때문에',
  },
];
