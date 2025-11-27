export interface CardData {
    id: string;
    name: string;
    description: string;
    quantity: number;
    type: 'space' | 'action';
    image?: string;
}

export const SPACE_CARDS: CardData[] = [
    {
        id: 's1',
        name: 'Blank space',
        description: 'This card is blank. Nothing to see here',
        quantity: 9,
        type: 'space',
        image: '/images/cards/s1.png'
    },
    {
        id: 's2',
        name: 'Useful junk',
        description: 'You salvage a load of scrap from a nearby ship wreckage. Pick up 1 game card',
        quantity: 5,
        type: 'space',
        image: '/images/cards/s2.png'
    },
    {
        id: 's3',
        name: 'Mysterious nebula',
        description: 'You float through an incomprehensible cloud of strange dust and gasses. Pick up 2 game cards',
        quantity: 2,
        type: 'space',
        image: '/images/cards/s3.png'
    },
    {
        id: 's4',
        name: 'Hyperspace',
        description: 'The space-time continuum bends and you are transported. Punch it, Chewie! Move forward one space',
        quantity: 1,
        type: 'space',
        image: '/images/cards/s4.png'
    },
    {
        id: 's5',
        name: 'Meteoroid',
        description: 'Lose items to narrowly avoid being obliterated. If you have 6 or more cards, discard 2.',
        quantity: 4,
        type: 'space',
        image: '/images/cards/s5.png'
    },
    {
        id: 's6',
        name: 'Cosmic radiation',
        description: 'You are hit by deadly cosmic rays, slowly boiling your insides. Discard 1 oxygen to make it through.',
        quantity: 6,
        type: 'space',
        image: '/images/cards/s6.png'
    },
    {
        id: 's7',
        name: 'Asteroid field',
        description: 'Giant chunks of fast-moving rock block your path. Discard 2 oxygens to navigate through.',
        quantity: 2,
        type: 'space',
        image: '/images/cards/s7.png'
    },
    {
        id: 's8',
        name: 'Gravitational anomaly',
        description: "An invisible force has pulled you back in time. Maybe. You can't remember. Move back a space",
        quantity: 4,
        type: 'space',
        image: '/images/cards/s8.png'
    },
    {
        id: 's9',
        name: 'Wormhole',
        description: 'Oh dear. You have been sucked into another dimension. Swap places with another player of your choice.',
        quantity: 4,
        type: 'space',
        image: '/images/cards/s9.png'
    },
    {
        id: 's10',
        name: 'Solar flare',
        description: 'Your eyeballs have been partly melted. You cannot play any actions while this card is directly behind you.',
        quantity: 5,
        type: 'space',
        image: '/images/cards/s10.png'
    }
];

export const ACTION_CARDS: CardData[] = [
    {
        id: 'a1',
        name: 'Oxygen siphon',
        description: 'Take a deep breath and relax, literally, because you can steal 2 oxygens from your chosen victim',
        quantity: 3,
        type: 'action',
        image: '/images/cards/a1.png'
    },
    {
        id: 'a2',
        name: 'Shield',
        description: 'Block an attack from another astronaut, discarding both the shield and action cards. (Note that you cannot play a Shield if you are under the influence of a solar flare',
        quantity: 4,
        type: 'action',
        image: '/images/cards/a2.png'
    },
    {
        id: 'a3',
        name: 'Hack suit',
        description: 'Select a player, look at their entire hand, and steal a card of your choosing! This is a magic bullet.',
        quantity: 3,
        type: 'action',
        image: '/images/cards/a3.png'
    },
    {
        id: 'a4',
        name: 'Tractor beam',
        description: 'Steal a card from another players hand at random',
        quantity: 4,
        type: 'action',
        image: '/images/cards/a4.png'
    },
    {
        id: 'a5',
        name: 'Rocket booster',
        description: 'Move forward 1 space, without discarding any oxygen.',
        quantity: 4,
        type: 'action',
        image: '/images/cards/a5.png'
    },
    {
        id: 'a6',
        name: 'Laser blast',
        description: 'Pick another player and knock them back 1 space. (Discard the Space Card behind them and push them back.) Cannot be played on a rival that is on the starting space.',
        quantity: 4,
        type: 'action',
        image: '/images/cards/a6.png'
    },
    {
        id: 'a7',
        name: 'Hole in suit',
        description: "Punch a hole in a rival's suit, forcing them to discard a single oxygen from their hand. (This could kill them!)",
        quantity: 4,
        type: 'action',
        image: '/images/cards/a7.png'
    },
    {
        id: 'a8',
        name: 'Tether',
        description: 'Move forward 1 space, and knock another player back 1 space. This card does not obey the laws of physics. Cannot be played on a rival that is on the starting space',
        quantity: 4,
        type: 'action',
        image: '/images/cards/a8.png'
    }
];
