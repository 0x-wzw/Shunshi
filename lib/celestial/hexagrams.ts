// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ZHOUYI / I CHING HEXAGRAM STATE SPACE MODULE                              ║
// ║  Binary state vectors, transformations, and interpretation framework       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * The I Ching as a State Space
 * 
 * Each hexagram represents a 6-dimensional binary state vector.
 * This module treats the Zhouyi as a computational system:
 * - 64 possible states (2^6)
 * - State transitions via moving lines
 * - Resonance between hexagrams
 * - Correspondence with temporal cycles
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE HEXAGRAM DATA
// ═══════════════════════════════════════════════════════════════════════════

export interface HexagramLine {
    position: number;  // 1-6 (bottom to top)
    value: number;     // 6 (旧阴), 7 (少阳), 8 (少阴), 9 (旧阳)
    isChanging: boolean; // 6 or 9 (old/changing lines)
    isYang: boolean;   // 7 or 9
}

export interface Hexagram {
    number: number;          // 1-64
    name: {
        chinese: string;
        pinyin: string;
        english: string;
    };
    binary: string;          // 6-bit binary (1=yang, 0=yin), top to bottom
    trigrams: {
        upper: string;
        lower: string;
    };
    binaryValue: number;     // 0-63 (Leibniz ordering)
    attributes: {
        element: string;
        nature: string;
        quality: 'creative' | 'receptive' | 'dynamic' | 'stable';
    };
    judgment: string;
    image: string;
}

export const HEXAGRAMS: Hexagram[] = [
    // ═══════════════════════════════════════════════════════════════════════
    // HEAVEN TRIGRAM (☰) UPPER
    // ═══════════════════════════════════════════════════════════════════════
    { number: 1, name: { chinese: '乾', pinyin: 'Qián', english: 'The Creative' },
      binary: '111111', trigrams: { upper: '☰', lower: '☰' }, binaryValue: 63, 
      attributes: { element: 'metal', nature: 'heaven', quality: 'creative' },
      judgment: 'The Creative works sublime success, furthering through perseverance.',
      image: 'The movement of heaven is powerful. The superior person strengthens themselves ceaselessly.' },
    
    { number: 11, name: { chinese: '泰', pinyin: 'Tài', english: 'Peace' },
      binary: '111000', trigrams: { upper: '☷', lower: '☰' }, binaryValue: 56,
      attributes: { element: 'earth', nature: 'peace', quality: 'stable' },
      judgment: 'Peace. The small departs, the great approaches. Good fortune. Success.',
      image: 'Heaven and earth unite. The ruler completes the way of heaven and earth.' },
    
    { number: 34, name: { chinese: '大壯', pinyin: 'Dà Zhuàng', english: 'Great Power' },
      binary: '111001', trigrams: { upper: '☳', lower: '☰' }, binaryValue: 57,
      attributes: { element: 'wood', nature: 'thunder', quality: 'dynamic' },
      judgment: 'Great Power. The superior person does not tread on paths that do not accord with established order.',
      image: 'Thunder in heaven. The superior person does not take a step that goes astray.' },
    
    { number: 43, name: { chinese: '夬', pinyin: 'Guài', english: 'Breakthrough' },
      binary: '111110', trigrams: { upper: '☱', lower: '☰' }, binaryValue: 62,
      attributes: { element: 'metal', nature: 'lake', quality: 'dynamic' },
      judgment: 'Breakthrough. One must resolutely make the matter known at the court of the king.',
      image: 'The lake rises to heaven. The superior person dispenses riches downward.' },
    
    { number: 9, name: { chinese: '小畜', pinyin: 'Xiǎo Chù', english: 'Small Taming' },
      binary: '111011', trigrams: { upper: '☴', lower: '☰' }, binaryValue: 59,
      attributes: { element: 'wood', nature: 'wind', quality: 'stable' },
      judgment: 'Small Taming. Success. Dense clouds, no rain from our western region.',
      image: 'Wind blowing across heaven. The superior person refines the outward appearance of their virtue.' },
    
    { number: 14, name: { chinese: '大有', pinyin: 'Dà Yǒu', english: 'Possession' },
      binary: '111101', trigrams: { upper: '☲', lower: '☰' }, binaryValue: 61,
      attributes: { element: 'fire', nature: 'fire', quality: 'creative' },
      judgment: 'Possession in great measure. Supreme success.',
      image: 'Fire in heaven. The superior person checks evil and exalts good.' },
    
    // ═══════════════════════════════════════════════════════════════════════
    // EARTH TRIGRAM (☷) UPPER
    // ═══════════════════════════════════════════════════════════════════════
    { number: 2, name: { chinese: '坤', pinyin: 'Kūn', english: 'The Receptive' },
      binary: '000000', trigrams: { upper: '☷', lower: '☷' }, binaryValue: 0,
      attributes: { element: 'earth', nature: 'earth', quality: 'receptive' },
      judgment: 'The Receptive brings sublime success, furthering through the perseverance of a mare.',
      image: 'The earth\'s condition is receptivity. The superior person supports all beings with generous nature.' },
    
    { number: 12, name: { chinese: '否', pinyin: 'Pǐ', english: 'Standstill' },
      binary: '000111', trigrams: { upper: '☰', lower: '☷' }, binaryValue: 7,
      attributes: { element: 'heaven', nature: 'stagnation', quality: 'stable' },
      judgment: 'Standstill. Evil people do not further the perseverance of the superior person.',
      image: 'Heaven and earth do not unite. The superior person keeps their virtue and conceals their capability.' },
    
    { number: 16, name: { chinese: '豫', pinyin: 'Yù', english: 'Enthusiasm' },
      binary: '000100', trigrams: { upper: '☳', lower: '☷' }, binaryValue: 4,
      attributes: { element: 'earth', nature: 'thunder', quality: 'dynamic' },
      judgment: 'Enthusiasm. It furthers one to install helpers and to set armies marching.',
      image: 'Thunder bursts from the earth. The superior person sets off all equipment of war by order.' },
    
    { number: 45, name: { chinese: '萃', pinyin: 'Cuì', english: 'Gathering' },
      binary: '000110', trigrams: { upper: '☱', lower: '☷' }, binaryValue: 6,
      attributes: { element: 'metal', nature: 'lake', quality: 'stable' },
      judgment: 'Gathering. Success. The king approaches his temple. It furthers one to see the great person.',
      image: 'The lake rises to the earth. The superior person prepares their weapons of war against unexpected attacks.' },
    
    { number: 20, name: { chinese: '觀', pinyin: 'Guān', english: 'Contemplation' },
      binary: '000011', trigrams: { upper: '☴', lower: '☷' }, binaryValue: 3,
      attributes: { element: 'wood', nature: 'wind', quality: 'receptive' },
      judgment: 'Contemplation. The ablution has been made, but not the offering. Full of trust they look up to the ruler.',
      image: 'Wind blows over the earth. The superior person examines the forms of the people to see their conditions.' },
    
    { number: 35, name: { chinese: '晉', pinyin: 'Jìn', english: 'Progress' },
      binary: '000101', trigrams: { upper: '☲', lower: '☷' }, binaryValue: 5,
      attributes: { element: 'fire', nature: 'sun', quality: 'dynamic' },
      judgment: 'Progress. The powerful prince is honored with horses in large numbers. In a single day he is granted audience three times.',
      image: 'The sun rises over the earth. The superior person bestows brightness on their own bright virtue.' },
    
    // ═══════════════════════════════════════════════════════════════════════
    // THUNDER TRIGRAM (☳) UPPER
    // ═══════════════════════════════════════════════════════════════════════
    { number: 51, name: { chinese: '震', pinyin: 'Zhèn', english: 'The Arousing' },
      binary: '001001', trigrams: { upper: '☳', lower: '☳' }, binaryValue: 9,
      attributes: { element: 'wood', nature: 'thunder', quality: 'dynamic' },
      judgment: 'The Arousing brings success. It comes with a shock, laughing and shouting.',
      image: 'Thunder repeated. The superior person in fear and trembling sets in order and examines themselves.' },
    
    { number: 24, name: { chinese: '復', pinyin: 'Fù', english: 'Return' },
      binary: '001000', trigrams: { upper: '☷', lower: '☳' }, binaryValue: 8,
      attributes: { element: 'earth', nature: 'return', quality: 'creative' },
      judgment: 'Return. Success. Going out and coming in without harm. Friends come without blame.',
      image: 'Thunder within the earth. The superior person practices the shut doors of winter.' },
    
    { number: 40, name: { chinese: '解', pinyin: 'Xiè', english: 'Deliverance' },
      binary: '001010', trigrams: { upper: '☵', lower: '☳' }, binaryValue: 10,
      attributes: { element: 'water', nature: 'movement', quality: 'dynamic' },
      judgment: 'Deliverance. The southwest furthers. If there is no longer anything where one had to go, returning brings good fortune.',
      image: 'Thunder and rain disentangle. The superior person forgives errors and pardons crimes.' },
    
    { number: 54, name: { chinese: '歸妹', pinyin: 'Guī Mèi', english: 'Marrying Maiden' },
      binary: '001110', trigrams: { upper: '☱', lower: '☳' }, binaryValue: 14,
      attributes: { element: 'metal', nature: 'lake', quality: 'dynamic' },
      judgment: 'Marrying Maiden. Undertakings bring misfortune. Nothing that would further.',
      image: 'Thunder over the lake. The superior person understands the transitory in the light of the eternal.' },
    
    { number: 42, name: { chinese: '益', pinyin: 'Yì', english: 'Increase' },
      binary: '001011', trigrams: { upper: '☴', lower: '☳' }, binaryValue: 11,
      attributes: { element: 'wood', nature: 'wind', quality: 'creative' },
      judgment: 'Increase. It furthers one to undertake something. It furthers one to cross the great water.',
      image: 'Wind and thunder. The superior person sees good and moves to do it, sees fault and reforms it.' },
    
    { number: 21, name: { chinese: '噬嗑', pinyin: 'Shì Kè', english: 'Biting Through' },
      binary: '001101', trigrams: { upper: '☲', lower: '☳' }, binaryValue: 13,
      attributes: { element: 'fire', nature: 'lightning', quality: 'dynamic' },
      judgment: 'Biting Through has success. It is favorable to let justice be administered.',
      image: 'Thunder and lightning. The superior person sets the penalties and proclaims the laws.' },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WATERS TRIGRAM (☵) UPPER
    // ═══════════════════════════════════════════════════════════════════════
    { number: 29, name: { chinese: '坎', pinyin: 'Kǎn', english: 'The Abysmal' },
      binary: '010010', trigrams: { upper: '☵', lower: '☵' }, binaryValue: 18,
      attributes: { element: 'water', nature: 'water', quality: 'receptive' },
      judgment: 'The Abysmal repeated. If you are sincere, you have success in your heart.',
      image: 'Water flows on without filling up. The superior person constantly practices virtue and improves their teaching.' },
    
    { number: 8, name: { chinese: '比', pinyin: 'Bǐ', english: 'Holding Together' },
      binary: '010000', trigrams: { upper: '☷', lower: '☵' }, binaryValue: 16,
      attributes: { element: 'earth', nature: 'water_gathering', quality: 'stable' },
      judgment: 'Holding Together brings good fortune. Inquire of the oracle once more whether you possess sublimity, constancy, and perseverance.',
      image: 'Water on the earth. The previous rulers established the myriad states in relation to the feudal lords.' },
    
    { number: 3, name: { chinese: '屯', pinyin: 'Zhūn', english: 'Difficulty at the Beginning' },
      binary: '010100', trigrams: { upper: '☳', lower: '☵' }, binaryValue: 20,
      attributes: { element: 'wood', nature: 'sprouting', quality: 'creative' },
      judgment: 'Difficulty at the Beginning works supreme success, furthering through perseverance.',
      image: 'Clouds and thunder. The superior person brings order out of chaos, establishing the principles of nature.' },
    
    { number: 60, name: { chinese: '節', pinyin: 'Jié', english: 'Limitation' },
      binary: '010110', trigrams: { upper: '☱', lower: '☵' }, binaryValue: 22,
      attributes: { element: 'metal', nature: 'lake', quality: 'stable' },
      judgment: 'Limitation. Success. Grief brings no blame.',
      image: 'Water over the lake. The superior person establishes measures and discusses the virtues of conduct.' },
    
    { number: 59, name: { chinese: '渙', pinyin: 'Huàn', english: 'Dispersion' },
      binary: '010011', trigrams: { upper: '☴', lower: '☵' }, binaryValue: 19,
      attributes: { element: 'wood', nature: 'wind', quality: 'dynamic' },
      judgment: 'Dispersion. Success. The king approaches his temple. It furthers one to cross the great water.',
      image: 'Wind drives over the water. The previous kings offered sacrifice to the Lord on high and installed the feudal lords.' },
    
    { number: 64, name: { chinese: '未濟', pinyin: 'Wèi Jì', english: 'Before Completion' },
      binary: '010101', trigrams: { upper: '☲', lower: '☵' }, binaryValue: 21,
      attributes: { element: 'fire', nature: 'transformation', quality: 'dynamic' },
      judgment: 'Before Completion. Success. But if the little fox, having almost completed crossing, gets its tail in the water, there is nothing that would further.',
      image: 'Fire over water. The superior person takes great care in discriminating things so that each finds its place.' },
    
    // Additional hexagrams (abbreviated for space)
    { number: 4, name: { chinese: '蒙', pinyin: 'Méng', english: 'Youthful Folly' },
      binary: '000010', trigrams: { upper: '☶', lower: '☵' }, binaryValue: 2,
      attributes: { element: 'earth', nature: 'spring', quality: 'receptive' },
      judgment: 'Youthful Folly has success. I do not seek the youthful fool, the youthful fool seeks me.',
      image: 'Spring at the foot of the mountain. The superior person nurtures virtue by thorough conduct in carrying out their work.' },
    
    { number: 5, name: { chinese: '需', pinyin: 'Xū', english: 'Waiting' },
      binary: '010111', trigrams: { upper: '☵', lower: '☰' }, binaryValue: 23,
      attributes: { element: 'water', nature: 'clouds', quality: 'stable' },
      judgment: 'Waiting. If you are sincere, you have light and success.',
      image: 'Clouds rise up to heaven. The superior person eats and drinks, feasting at ease.' },
    
    { number: 6, name: { chinese: '訟', pinyin: 'Sòng', english: 'Conflict' },
      binary: '111010', trigrams: { upper: '☰', lower: '☵' }, binaryValue: 58,
      attributes: { element: 'metal', nature: 'water', quality: 'dynamic' },
      judgment: 'Conflict. You are sincere and are being obstructed. A cautious approach brings good fortune.',
      image: 'Heaven and water go their opposite ways. The superior person plans the beginning of all undertakings.' },
    
    { number: 7, name: { chinese: '師', pinyin: 'Shī', english: 'The Army' },
      binary: '000010', trigrams: { upper: '☷', lower: '☵' }, binaryValue: 2,
      attributes: { element: 'earth', nature: 'military', quality: 'stable' },
      judgment: 'The Army needs perseverance and a strong person. Good fortune without blame.',
      image: 'Water in the midst of the earth. The superior person nourishes the people and takes their multitude together.' },
    
    { number: 10, name: { chinese: '履', pinyin: 'Lǚ', english: 'Treading' },
      binary: '110111', trigrams: { upper: '☰', lower: '☱' }, binaryValue: 55,
      attributes: { element: 'metal', nature: 'lake', quality: 'dynamic' },
      judgment: 'Treading on the tail of the tiger. It does not bite the person. Success.',
      image: 'Heaven above, the lake below. The superior person discriminates between high and low, and strengthens the people\'s opinion.' },
    
    { number: 13, name: { chinese: '同人', pinyin: 'Tóng Rén', english: 'Fellowship' },
      binary: '111101', trigrams: { upper: '☰', lower: '☲' }, binaryValue: 61,
      attributes: { element: 'metal', nature: 'fire', quality: 'creative' },
      judgment: 'Fellowship with people in the open. Success. It furthers one to cross the great water.',
      image: 'Heaven with fire. The superior person classifies and distinguishes beings, each in its own category.' },
    
    { number: 15, name: { chinese: '謙', pinyin: 'Qiān', english: 'Modesty' },
      binary: '000100', trigrams: { upper: '☷', lower: '☶' }, binaryValue: 4,
      attributes: { element: 'earth', nature: 'mountain', quality: 'receptive' },
      judgment: 'Modesty creates success. The superior person carries things through.',
      image: 'In the midst of the earth is a mountain. The superior person decreases the superabundant and augments the insufficient.' },
    
    { number: 17, name: { chinese: '隨', pinyin: 'Suí', english: 'Following' },
      binary: '001110', trigrams: { upper: '☱', lower: '☳' }, binaryValue: 14,
      attributes: { element: 'metal', nature: 'thunder', quality: 'dynamic' },
      judgment: 'Following has supreme success. Perseverance furthers. No blame.',
      image: 'Thunder in the middle of the lake. The superior person at sundown goes indoors for rest and recuperation.' },
    
    { number: 18, name: { chinese: '蠱', pinyin: 'Gǔ', english: 'Work on What Has Been Spoiled' },
      binary: '001001', trigrams: { upper: '☶', lower: '☴' }, binaryValue: 9,
      attributes: { element: 'wood', nature: 'correction', quality: 'dynamic' },
      judgment: 'Work on what has been spoiled has supreme success. It furthers one to cross the great water.',
      image: 'Wind and mountain. The superior person stirs up the people and nourishes their virtue.' },
    
    { number: 19, name: { chinese: '臨', pinyin: 'Lín', english: 'Approach' },
      binary: '000011', trigrams: { upper: '☷', lower: '☱' }, binaryValue: 3,
      attributes: { element: 'earth', nature: 'lake', quality: 'receptive' },
      judgment: 'Approach has supreme success. It furthers one to see the great person.',
      image: 'The earth above, the lake below. The superior person teaches with inexhaustible hospitality.' },
    
    { number: 22, name: { chinese: '賁', pinyin: 'Bì', english: 'Grace' },
      binary: '101001', trigrams: { upper: '☶', lower: '☲' }, binaryValue: 41,
      attributes: { element: 'fire', nature: 'mountain', quality: 'creative' },
      judgment: 'Grace has success. In small matters it is favorable to undertake something.',
      image: 'Fire at the foot of the mountain. The superior person brings clarity to governmental institutions without daring to decide lawsuits.' },
    
    { number: 23, name: { chinese: '剝', pinyin: 'Bō', english: 'Splitting Apart' },
      binary: '000001', trigrams: { upper: '☷', lower: '☶' }, binaryValue: 1,
      attributes: { element: 'earth', nature: 'decline', quality: 'receptive' },
      judgment: 'Splitting Apart. It does not further one to go anywhere.',
      image: 'The mountain rests on the earth. The superior person gives full care to the people and is generous toward those below.' },
    
    { number: 25, name: { chinese: '无妄', pinyin: 'Wú Wàng', english: 'Innocence' },
      binary: '111001', trigrams: { upper: '☰', lower: '☳' }, binaryValue: 57,
      attributes: { element: 'wood', nature: 'sincerity', quality: 'creative' },
      judgment: 'Innocence. Supreme success. It is not I who seek the youthful, the youthful seeks me.',
      image: 'Thunder under heaven. The superior person takes its first step according to the movement of the seasons.' },
    
    { number: 26, name: { chinese: '大畜', pinyin: 'Dà Chù', english: 'The Taming Power of the Great' },
      binary: '100111', trigrams: { upper: '☶', lower: '☰' }, binaryValue: 39,
      attributes: { element: 'wood', nature: 'accumulation', quality: 'stable' },
      judgment: 'The Taming Power of the Great. Perseverance furthers. It is favorable not to eat at home.',
      image: 'Heaven in the mountain. The superior person acquires exact knowledge and makes their virtue great.' },
    
    { number: 27, name: { chinese: '頤', pinyin: 'Yí', english: 'Nourishment' },
      binary: '100001', trigrams: { upper: '☶', lower: '☳' }, binaryValue: 33,
      attributes: { element: 'wood', nature: 'nourishment', quality: 'receptive' },
      judgment: 'Nourishment. Perseverance brings good fortune. Watch your speech when you nourish with it.',
      image: 'At the foot of the mountain is thunder. The superior person is careful of their words and moderate in eating and drinking.' },
    
    { number: 28, name: { chinese: '大過', pinyin: 'Dà Guò', english: 'Preponderance of the Great' },
      binary: '011110', trigrams: { upper: '☱', lower: '☴' }, binaryValue: 30,
      attributes: { element: 'wood', nature: 'excess', quality: 'dynamic' },
      judgment: 'Preponderance of the Great. The ridgepole sags. It furthers one to have somewhere to go. Success.',
      image: 'The lake rises above the trees. The superior person stands alone without fear and retires from the world without regret.' },
    
    { number: 30, name: { chinese: '離', pinyin: 'Lí', english: 'The Clinging' },
      binary: '101101', trigrams: { upper: '☲', lower: '☲' }, binaryValue: 45,
      attributes: { element: 'fire', nature: 'fire', quality: 'creative' },
      judgment: 'The Clinging. Perseverance furthers. It brings success. Care of the cow brings good fortune.',
      image: 'Brightness doubled forms the image of the Clinging. The great person continues the shining light of their virtue to all directions.' },
    
    { number: 31, name: { chinese: '咸', pinyin: 'Xián', english: 'Influence' },
      binary: '001110', trigrams: { upper: '☱', lower: '☶' }, binaryValue: 14,
      attributes: { element: 'metal', nature: 'attraction', quality: 'dynamic' },
      judgment: 'Influence. Success. Perseverance furthers. To take a maiden to wife brings good fortune.',
      image: 'A lake on the mountain. The superior person encourages people to approach by their readiness to receive them.' },
    
    { number: 32, name: { chinese: '恆', pinyin: 'Héng', english: 'Duration' },
      binary: '110011', trigrams: { upper: '☴', lower: '☳' }, binaryValue: 51,
      attributes: { element: 'wood', nature: 'thunder', quality: 'stable' },
      judgment: 'Duration. Success. No blame. Perseverance furthers. It furthers one to have somewhere to go.',
      image: 'Thunder and wind. The superior person stands firm and does not change their aim.' },
    
    { number: 33, name: { chinese: '遯', pinyin: 'Dùn', english: 'Retreat' },
      binary: '111100', trigrams: { upper: '☰', lower: '☶' }, binaryValue: 60,
      attributes: { element: 'metal', nature: 'retreat', quality: 'dynamic' },
      judgment: 'Retreat. Success. In what is small, perseverance furthers.',
      image: 'Under heaven is the mountain. The superior person keeps the inferior person at a distance with mildness and severity.' },
    
    { number: 36, name: { chinese: '明夷', pinyin: 'Míng Yí', english: 'Darkening of the Light' },
      binary: '101000', trigrams: { upper: '☷', lower: '☲' }, binaryValue: 40,
      attributes: { element: 'fire', nature: 'concealment', quality: 'receptive' },
      judgment: 'Darkening of the Light. In adversity it furthers one to be persevering.',
      image: 'The light sunk into the earth. The superior person manages the people by keeping their light obscured.' },
    
    { number: 37, name: { chinese: '家人', pinyin: 'Jiā Rén', english: 'The Family' },
      binary: '110101', trigrams: { upper: '☴', lower: '☲' }, binaryValue: 53,
      attributes: { element: 'fire', nature: 'family', quality: 'stable' },
      judgment: 'The Family. The perseverance of the woman furthers.',
      image: 'Wind comes forth from fire. The superior person is substantiated in their words and consistent in their conduct.' },
    
    { number: 38, name: { chinese: '睽', pinyin: 'Kuí', english: 'Opposition' },
      binary: '110101', trigrams: { upper: '☲', lower: '☱' }, binaryValue: 53,
      attributes: { element: 'fire', nature: 'divergence', quality: 'dynamic' },
      judgment: 'Opposition. In small matters, good fortune.',
      image: 'Fire above, the lake below. The superior person keeps their individuality while working with others.' },
    
    { number: 39, name: { chinese: '蹇', pinyin: 'Jiǎn', english: 'Obstruction' },
      binary: '001010', trigrams: { upper: '☵', lower: '☶' }, binaryValue: 10,
      attributes: { element: 'water', nature: 'difficulty', quality: 'receptive' },
      judgment: 'Obstruction. It furthers one to go southwest, not to go northeast. It furthers one to see the great person.',
      image: 'Water on the mountain. The superior person turns around to examine their virtue and improves their conduct.' },
    
    { number: 41, name: { chinese: '損', pinyin: 'Sǔn', english: 'Decrease' },
      binary: '110001', trigrams: { upper: '☶', lower: '☱' }, binaryValue: 49,
      attributes: { element: 'metal', nature: 'reduction', quality: 'dynamic' },
      judgment: 'Decrease combined with sincerity brings supreme good fortune without blame.',
      image: 'At the foot of the mountain is the lake. The superior person controls anger and restrains their instincts.' },
    
    { number: 44, name: { chinese: '姤', pinyin: 'Gòu', english: 'Coming to Meet' },
      binary: '111110', trigrams: { upper: '☰', lower: '☴' }, binaryValue: 62,
      attributes: { element: 'wood', nature: 'encounter', quality: 'dynamic' },
      judgment: 'Coming to Meet. The maiden is powerful. One should not marry such a maiden.',
      image: 'Under heaven, wind. The superior person announces their commands and proclaims their affairs to the four quarters.' },
    
    { number: 46, name: { chinese: '升', pinyin: 'Shēng', english: 'Pushing Upward' },
      binary: '110000', trigrams: { upper: '☷', lower: '☴' }, binaryValue: 48,
      attributes: { element: 'wood', nature: 'ascent', quality: 'creative' },
      judgment: 'Pushing Upward brings supreme success. One must see the great person. Fear not.',
      image: 'Wood in the midst of the earth. The superior person by their modest care and reverence builds up their virtue.' },
    
    { number: 47, name: { chinese: '困', pinyin: 'Kùn', english: 'Oppression' },
      binary: '110101', trigrams: { upper: '☱', lower: '☵' }, binaryValue: 53,
      attributes: { element: 'metal', nature: 'constraint', quality: 'receptive' },
      judgment: 'Oppression. Success. Perseverance. The great person brings about good fortune. No blame.',
      image: 'The lake without water. The superior person risks their life to follow their will.' },
    
    { number: 48, name: { chinese: '井', pinyin: 'Jǐng', english: 'The Well' },
      binary: '010110', trigrams: { upper: '☵', lower: '☴' }, binaryValue: 22,
      attributes: { element: 'wood', nature: 'resource', quality: 'stable' },
      judgment: 'The Well. The town may be changed, but the well cannot be changed.',
      image: 'Water above wood. The superior person encourages the people at their work and exhorts them to help one another.' },
    
    { number: 49, name: { chinese: '革', pinyin: 'Gé', english: 'Revolution' },
      binary: '011101', trigrams: { upper: '☱', lower: '☲' }, binaryValue: 29,
      attributes: { element: 'metal', nature: 'transformation', quality: 'dynamic' },
      judgment: 'Revolution. On your own day you are believed. Supreme success.',
      image: 'Fire in the lake. The superior person reckons with the appointed times and clarifies the seasons.' },
    
    { number: 50, name: { chinese: '鼎', pinyin: 'Dǐng', english: 'The Cauldron' },
      binary: '101110', trigrams: { upper: '☱', lower: '☴' }, binaryValue: 46,
      attributes: { element: 'fire', nature: 'nourishment', quality: 'creative' },
      judgment: 'The Cauldron. Supreme good fortune. Success.',
      image: 'Fire over wood. The superior person consolidates their position by providing for what is proper.' },
    
    { number: 52, name: { chinese: '艮', pinyin: 'Gèn', english: 'Keeping Still' },
      binary: '001001', trigrams: { upper: '☶', lower: '☶' }, binaryValue: 9,
      attributes: { element: 'earth', nature: 'mountain', quality: 'stable' },
      judgment: 'Keeping Still. Keeping the back so still that one forgets the self. No blame.',
      image: 'Mountains standing close together. The superior person does not allow their thoughts to go beyond their position.' },
    
    { number: 53, name: { chinese: '漸', pinyin: 'Jiàn', english: 'Development' },
      binary: '001100', trigrams: { upper: '☴', lower: '☶' }, binaryValue: 12,
      attributes: { element: 'wood', nature: 'gradual_progress', quality: 'creative' },
      judgment: 'Development. The maiden is given in marriage. Good fortune. Perseverance furthers.',
      image: 'Wood on the mountain. The superior person lives in dignity and virtue in order to improve the customs.' },
    
    { number: 55, name: { chinese: '豐', pinyin: 'Fēng', english: 'Abundance' },
      binary: '001101', trigrams: { upper: '☳', lower: '☲' }, binaryValue: 13,
      attributes: { element: 'fire', nature: 'fullness', quality: 'creative' },
      judgment: 'Abundance has success. The king attains abundance. Be not sad. Be like the sun at noon.',
      image: 'Thunder and lightning come. The superior person decides lawsuits and exacts punishments.' },
    
    { number: 56, name: { chinese: '旅', pinyin: 'Lǚ', english: 'The Wanderer' },
      binary: '101100', trigrams: { upper: '☲', lower: '☶' }, binaryValue: 44,
      attributes: { element: 'fire', nature: 'travel', quality: 'dynamic' },
      judgment: 'The Wanderer. Success through smallness. Perseverance brings good fortune to the wanderer.',
      image: 'Fire on the mountain. The superior person is clear-minded and cautious in imposing penalties.' },
    
    { number: 57, name: { chinese: '巽', pinyin: 'Xùn', english: 'The Gentle' },
      binary: '011011', trigrams: { upper: '☴', lower: '☴' }, binaryValue: 27,
      attributes: { element: 'wood', nature: 'wind', quality: 'receptive' },
      judgment: 'The Gentle. Success through what is small. It furthers one to have somewhere to go.',
      image: 'Winds following one upon the other. The superior person unfolds their mandate and reaches out to the people.' },
    
    { number: 58, name: { chinese: '兌', pinyin: 'Duì', english: 'The Joyous' },
      binary: '110110', trigrams: { upper: '☱', lower: '☱' }, binaryValue: 54,
      attributes: { element: 'metal', nature: 'lake', quality: 'creative' },
      judgment: 'The Joyous. Success. Perseverance is favorable.',
      image: 'Lakes resting one on the other. The superior person joins with friends for discussion and practice.' },
    
    { number: 61, name: { chinese: '中孚', pinyin: 'Zhōng Fú', english: 'Inner Truth' },
      binary: '110011', trigrams: { upper: '☴', lower: '☱' }, binaryValue: 51,
      attributes: { element: 'wood', nature: 'sincerity', quality: 'stable' },
      judgment: 'Inner Truth. Pigs and fish. Good fortune. It furthers one to cross the great water.',
      image: 'Wind over the lake. The superior person discusses criminal cases to delay executions.' },
    
    { number: 62, name: { chinese: '小過', pinyin: 'Xiǎo Guò', english: 'Preponderance of the Small' },
      binary: '001100', trigrams: { upper: '☳', lower: '☶' }, binaryValue: 12,
      attributes: { element: 'wood', nature: 'small_excess', quality: 'dynamic' },
      judgment: 'Preponderance of the Small. Success. It furthers one to undertake small things, not great things.',
      image: 'Thunder on the mountain. The superior person exceeds in respect, but is deficient in ceremony.' },
    
    { number: 63, name: { chinese: '既濟', pinyin: 'Jì Jì', english: 'After Completion' },
      binary: '101010', trigrams: { upper: '☵', lower: '☲' }, binaryValue: 42,
      attributes: { element: 'fire', nature: 'completion', quality: 'stable' },
      judgment: 'After Completion. Success in small matters. Perseverance furthers.',
      image: 'Water over fire. The superior person takes thought of troubles and guards against their approach.' },
];

// Index maps for quick lookup
export const HEXAGRAM_BY_NUMBER = new Map(HEXAGRAMS.map(h => [h.number, h]));
export const HEXAGRAM_BY_BINARY = new Map(HEXAGRAMS.map(h => [h.binary, h]));
export const HEXAGRAM_BY_VALUE = new Map(HEXAGRAMS.map(h => [h.binaryValue, h]));

// ═══════════════════════════════════════════════════════════════════════════
// HEXAGRAM OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get hexagram by any identifier
 */
export function getHexagram(id: number | string): Hexagram | undefined {
    if (typeof id === 'number') {
        return HEXAGRAM_BY_NUMBER.get(id);
    }
    if (id.length === 6 && /^[01]+$/.test(id)) {
        return HEXAGRAM_BY_BINARY.get(id);
    }
    // Try by name
    return HEXAGRAMS.find(h => 
        h.name.chinese === id || 
        h.name.pinyin.toLowerCase() === id.toLowerCase() ||
        h.name.english.toLowerCase() === id.toLowerCase()
    );
}

/**
 * Calculate opposite hexagram (flip all lines)
 */
export function getOppositeHexagram(hexagram: Hexagram): Hexagram {
    const oppositeBinary = hexagram.binary.split('').map(b => b === '1' ? '0' : '1').join('');
    return HEXAGRAM_BY_BINARY.get(oppositeBinary) || hexagram;
}

/**
 * Calculate nuclear hexagram (center 4 lines become outer 4)
 */
export function getNuclearHexagram(hexagram: Hexagram): Hexagram {
    // Extract nuclear lines (lines 2,3,4 → lower nuclear; lines 3,4,5 → upper nuclear)
    // binary is top-to-bottom: index 0=top(yao6), index 5=bottom(yao1)
    const chars = hexagram.binary.split('');
    // Line 2 = index 4, Line 3 = index 3, Line 4 = index 2 (bottom→top extraction)
    // Line 3 = index 3, Line 4 = index 2, Line 5 = index 1 (bottom→top extraction)
    const lowerBits = chars[4] + chars[3] + chars[2];  // bottom→top
    const upperBits = chars[3] + chars[2] + chars[1];  // bottom→top
    // Reverse each trigram to top→bottom convention for binary composition
    const lowerReversed = lowerBits.split('').reverse().join('');
    const upperReversed = upperBits.split('').reverse().join('');
    const nuclearBinary = upperReversed + lowerReversed;

    return HEXAGRAM_BY_BINARY.get(nuclearBinary) || hexagram;
}

/**
 * Calculate transformed hexagram from moving lines
 */
export function getTransformedHexagram(
    hexagram: Hexagram, 
    movingLines: number[]
): { hexagram: Hexagram; lines: HexagramLine[] } {
    const chars = hexagram.binary.split('');
    const lines: HexagramLine[] = [];
    
    for (let i = 0; i < 6; i++) {
        const position = 6 - i; // 1-6 (bottom to top, but binary is top to bottom)
        const isMoving = movingLines.includes(position);
        const isYang = chars[i] === '1';
        
        // Old yang = 9, old yin = 6, young yang = 7, young yin = 8
        let value: number;
        if (isMoving) {
            value = isYang ? 9 : 6; // Old/changing
        } else {
            value = isYang ? 7 : 8; // Young/stable
        }
        
        lines.push({
            position,
            value,
            isChanging: isMoving,
            isYang
        });
        
        // Flip moving lines
        if (isMoving) {
            chars[i] = isYang ? '0' : '1';
        }
    }
    
    const transformedBinary = chars.join('');
    const transformed = HEXAGRAM_BY_BINARY.get(transformedBinary);
    
    return {
        hexagram: transformed || hexagram,
        lines
    };
}

/**
 * Calculate relationship between two hexagrams
 */
export function hexagramRelationship(h1: Hexagram, h2: Hexagram): {
    type: 'complementary' | 'contrasting' | 'sequential' | 'unrelated';
    description: string;
    affinity: number; // 0-1
} {
    const diff = h1.binaryValue ^ h2.binaryValue; // XOR shows differences
    const distance = diff.toString(2).replace(/0/g, '').length; // Hamming distance
    
    if (h2.number === getOppositeHexagram(h1).number) {
        return {
            type: 'complementary',
            description: `${h1.name.english} and ${h2.name.english} are opposites—mutual completion through contrast.`,
            affinity: 1.0
        };
    }
    
    if (h1.attributes.element === h2.attributes.element) {
        return {
            type: 'contrasting',
            description: `Same element (${h1.attributes.element}) but different nature—parallel streams.`,
            affinity: 0.7
        };
    }
    
    if (distance === 1) {
        return {
            type: 'sequential',
            description: 'Single line different—adjacent states in flux.',
            affinity: 0.8
        };
    }
    
    return {
        type: 'unrelated',
        description: 'Distant states without direct relationship.',
        affinity: Math.max(0, 1 - distance / 6)
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE SPACE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * State space metrics for hexagram system
 */
export function analyzeStateSpace(): {
    totalStates: number;
    elementDistribution: Record<string, number>;
    qualityDistribution: Record<string, number>;
    transitionGraph: Map<number, number[]>;
} {
    // Count by element
    const elementDistribution: Record<string, number> = {};
    const qualityDistribution: Record<string, number> = {};
    
    for (const h of HEXAGRAMS) {
        elementDistribution[h.attributes.element] = (elementDistribution[h.attributes.element] || 0) + 1;
        qualityDistribution[h.attributes.quality] = (qualityDistribution[h.attributes.quality] || 0) + 1;
    }
    
    // Build transition graph (single line changes)
    const transitionGraph = new Map<number, number[]>();
    
    for (const h of HEXAGRAMS) {
        const neighbors: number[] = [];
        for (let i = 0; i < 6; i++) {
            const bit = 5 - i; // bit position
            const neighborValue = h.binaryValue ^ (1 << bit);
            const neighbor = HEXAGRAM_BY_VALUE.get(neighborValue);
            if (neighbor) {
                neighbors.push(neighbor.number);
            }
        }
        transitionGraph.set(h.number, neighbors);
    }
    
    return {
        totalStates: HEXAGRAMS.length,
        elementDistribution,
        qualityDistribution,
        transitionGraph
    };
}

/**
 * Calculate state trajectory through hexagram space
 * Simulates "walking" through hexagrams based on temporal inputs
 */
export function calculateTrajectory(
    startHexagram: Hexagram,
    steps: number,
    seed?: number
): Hexagram[] {
    const trajectory: Hexagram[] = [startHexagram];
    let current = startHexagram;
    
    // Simple pseudo-random walk through state space
    let rng = seed || Date.now();
    const nextRandom = () => {
        rng = (rng * 9301 + 49297) % 233280;
        return rng / 233280;
    };
    
    for (let i = 0; i < steps && i < 64; i++) {
        const transitions = analyzeStateSpace().transitionGraph.get(current.number) || [];
        if (transitions.length === 0) break;
        
        const nextNum = transitions[Math.floor(nextRandom() * transitions.length)];
        const next = HEXAGRAM_BY_NUMBER.get(nextNum);
        if (next) {
            trajectory.push(next);
            current = next;
        }
    }
    
    return trajectory;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPORAL CORRELATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map Julian Day Number to hexagram cycle
 * Hexagram cycle is approximately 60 days (sexagenary cycle resonance)
 */
export function jdnToHexagram(jdn: number): Hexagram {
    // 64 hexagrams mapped to cycle
    // Cycle length: 64 * 3 days = 192 days (roughly 6.4 months)
    const cyclePosition = jdn % 64;
    return HEXAGRAM_BY_NUMBER.get(cyclePosition + 1) || HEXAGRAMS[0];
}

/**
 * Get hourly hexagram (each hour has a hexagram correspondence)
 */
export function hourToHexagram(hour: number): Hexagram {
    // Map 12 hours to hexagrams
    const hourlyMap = [1, 24, 3, 42, 51, 21, 30, 44, 33, 12, 45, 2];
    return HEXAGRAM_BY_NUMBER.get(hourlyMap[hour % 12]) || HEXAGRAMS[0];
}

/**
 * Calculate resonance between hexagram and Bazi chart
 */
export function hexagramBaziResonance(
    hexagram: Hexagram,
    dayPillar: { stem: string; branch: string },
    monthPillar: { stem: string; branch: string }
): {
    resonance: number; // 0-1
    description: string;
    elementHarmony: boolean;
} {
    // Simplified element matching
    const hexElement = hexagram.attributes.element;
    
    // Map stems/branches to elements (simplified)
    const branchElements: Record<string, string> = {
        '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
        '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
        '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water'
    };
    
    const dayElement = branchElements[dayPillar.branch] || 'earth';
    const monthElement = branchElements[monthPillar.branch] || 'earth';
    
    // Calculate harmony
    const dayMatch = dayElement === hexElement ? 0.5 : 0;
    const monthMatch = monthElement === hexElement ? 0.3 : 0;
    
    // Generate phase (simplified)
    const phaseMap: Record<string, string[]> = {
        'wood': ['fire', 'earth'],
        'fire': ['earth', 'metal'],
        'earth': ['metal', 'water'],
        'metal': ['water', 'wood'],
        'water': ['wood', 'fire']
    };
    
    const dayPhase = phaseMap[dayElement]?.includes(hexElement) ? 0.2 : 0;
    
    const resonance = Math.min(1, dayMatch + monthMatch + dayPhase);
    
    return {
        resonance,
        description: resonance > 0.7 ? 'Strong harmony with temporal energies' :
                     resonance > 0.4 ? 'Moderate resonance' :
                     'Disharmony—caution advised',
        elementHarmony: resonance > 0.5
    };
}
