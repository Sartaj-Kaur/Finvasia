const express = require('express');
const calculateScores = require('./scoring');
const matchArchetype = require('./archetypes');
const questions = require('./questions');
const app = express();
app.use(express.json());

//question rouete//
app.get('/quiz/questions', (req, res) => {
    res.json({ questions });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Mobile backend is running!' });
});

// Submit quiz answers
app.post('/quiz/submit', (req, res) => {
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
        return res.status(400).json({ error: 'No answers provided' });
    }

    const scores = calculateScores(answers);
    const archetype = matchArchetype(scores);

    res.json({
        scores,
        archetype: archetype.name,
        description: archetype.description
    });
});

app.listen(4000, () => {
    console.log('Mobile backend running on http://localhost:4000');
});