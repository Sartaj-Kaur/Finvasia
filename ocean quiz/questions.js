const questions = [
    // EXTRAVERSION
    { id: 1, text: "Am the life of the party.", trait: "E", reverse: false },
    { id: 2, text: "Don't talk a lot.", trait: "E", reverse: true },

    // AGREEABLENESS
    { id: 3, text: "Am interested in people.", trait: "A", reverse: false },
    { id: 4, text: "Feel little concern for others.", trait: "A", reverse: true },

    // CONSCIENTIOUSNESS
    { id: 5, text: "Am always prepared.", trait: "C", reverse: false },
    { id: 6, text: "Leave my belongings around.", trait: "C", reverse: true },

    // NEUROTICISM
    { id: 7, text: "Get stressed out easily.", trait: "N", reverse: false },
    { id: 8, text: "Am relaxed most of the time.", trait: "N", reverse: true },

    // OPENNESS
    { id: 9, text: "Have a rich vocabulary.", trait: "O", reverse: false },
    { id: 10, text: "Have a vivid imagination.", trait: "O", reverse: false },
];

module.exports = questions;