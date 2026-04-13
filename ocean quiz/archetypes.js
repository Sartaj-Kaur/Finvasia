function matchArchetype(scores) {
    const { openness: O, conscientiousness: C,
        extraversion: E, agreeableness: A, neuroticism: N } = scores;

    if (N > 60)
        return {
            name: "The Calm Guide",
            tone: "reassuring",
            description: "You seem to worry about finances. Your FinTwin will be calm, steady and reassuring."
        };

    if (C < 40)
        return {
            name: "The Disciplined Mentor",
            tone: "structured",
            description: "You tend to be spontaneous. Your FinTwin will be organized and keep you on track."
        };

    if (O < 40)
        return {
            name: "The Gentle Challenger",
            tone: "encouraging",
            description: "You prefer routine. Your FinTwin will gently push you to explore new financial ideas."
        };

    if (E < 40)
        return {
            name: "The Supportive Friend",
            tone: "warm",
            description: "You are more reserved. Your FinTwin will be warm and easy to open up to."
        };

    if (A < 40)
        return {
            name: "The Honest Advisor",
            tone: "direct",
            description: "You are independent. Your FinTwin will be straightforward and no-nonsense."
        };

    return {
        name: "The Balanced Coach",
        tone: "balanced",
        description: "You have a well-rounded personality. Your FinTwin will adapt to what you need."
    };
}

module.exports = matchArchetype;