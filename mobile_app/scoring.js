function calculateScores(answers) {
    let scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    let counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };

    answers.forEach(({ trait, value, reverse }) => {
        const score = reverse ? 6 - value : value;
        scores[trait] += score;
        counts[trait]++;
    });

    return {
        openness: Math.round((scores.O / (counts.O * 5)) * 100),
        conscientiousness: Math.round((scores.C / (counts.C * 5)) * 100),
        extraversion: Math.round((scores.E / (counts.E * 5)) * 100),
        agreeableness: Math.round((scores.A / (counts.A * 5)) * 100),
        neuroticism: Math.round((scores.N / (counts.N * 5)) * 100),
    };
}

module.exports = calculateScores;