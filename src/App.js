import React, { useState } from 'react';
import './App.css';
import { HfInference } from "@huggingface/inference";

// Initialize the HfInference client
const inference = new HfInference("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"); // Replace with your actual API key


const StoryGenerator = () => {
    const [size, setSize] = useState('short');
    const [perspective, setPerspective] = useState('first person');
    const [genre, setGenre] = useState('fantasy');
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [Language, setLanguage] = useState('en');

  const generateStory = async () => {
    setStory('');

    const prompt = `Tell a ${size} ${genre} story in ${perspective} perspective:\n\nI`;

    try {
      for await (const chunk of inference.chatCompletionStream({
        model: "google/gemma-2-27b-it",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      })) {
        const newContent = chunk.choices[0]?.delta?.content || "";
        setStory(prevStory => prevStory + newContent);
      }
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Sorry, I couldn't generate a story at this time.");
    } finally {
      setLoading(false);
    }
  };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        generateStory();

        setLoading(false);
    };

    return (
        <div className="story-generator">
            <div className="navbar">
                <h2>Story Generator</h2>
                <form className="story-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="size">Size of Story:</label>
                        <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="perspective">Narrative Perspective:</label>
                        <select id="perspective" value={perspective} onChange={(e) => setPerspective(e.target.value)}>
                            <option value="first person">First Person</option>
                            <option value="second person">Second Person</option>
                            <option value="third person">Third Person</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre">Genre:</label>
                        <input
                            type="text"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Language">Language:</label>
                        <select
                            id="Language"
                            value={Language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Arabic">Arabic</option>
                            <option value="german">German</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Story'}
                    </button>
                </form>
            </div>
            <div className="story-display">
                {story && (
                    <div className="generated-story">
                        <h2>Generated Story</h2>
                        <p>{story}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryGenerator;
