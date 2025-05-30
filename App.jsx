import { useState, useEffect } from "react";
import "./App.css";

const TIPS = [
  "Take a short walk outside today to clear your mind.",
  "Try deep breathing exercises for 5 minutes.",
  "Remember to drink water and stay hydrated!",
  "Write down 3 things you're grateful for.",
  "Reach out to a friend or family member for support.",
];

function App() {
  const [journal, setJournal] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [entries, setEntries] = useState([]);
  const [checkInMood, setCheckInMood] = useState("");
  const [checkInInput, setCheckInInput] = useState("");
  const [error, setError] = useState("");
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("mindmend-entries")) || [];
    setEntries(savedEntries);

    setTips(shuffleArray(TIPS).slice(0, 3));
  }, []);

  useEffect(() => {
    localStorage.setItem("mindmend-entries", JSON.stringify(entries));
  }, [entries]);

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function saveEntry() {
    if (!journal.trim()) {
      setError("Please enter your thoughts before analyzing.");
      return;
    }
    setError("");
    const newEntry = {
      id: Date.now(),
      text: journal,
      analysis,
      date: new Date().toLocaleDateString(),
    };
    setEntries([newEntry, ...entries]);
    setJournal("");
    setAnalysis("");
  }

  async function analyzeJournal() {
    if (!journal.trim()) {
      setError("Please type something first.");
      return;
    }
    setError("");
    setAnalysis("Analyzing your thoughts... 🧠");
    setTimeout(() => {
      setAnalysis(
        "Your feelings show you are reflective. Remember, it’s okay to feel down sometimes. Try some self-care today!"
      );
    }, 1500);
  }

  function saveCheckIn() {
    if (!checkInInput.trim()) {
      setError("Please enter your mood.");
      return;
    }
    setError("");
    setCheckInMood(checkInInput);
    setEntries([{ id: Date.now(), mood: checkInInput, date: new Date().toLocaleDateString() }, ...entries]);
    setCheckInInput("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🧠 MindMend</h1>
        <p>Your personal AI mental health journal</p>
      </header>

      <main className="main">
        {/* Journal Input */}
        <textarea
          className="journal-input"
          placeholder="Type your thoughts or feelings here..."
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        ></textarea>
        <button className="analyze-btn" onClick={analyzeJournal}>
          Analyze with AI
        </button>
        <button className="save-btn" onClick={saveEntry}>
          Save Entry
        </button>

        {error && <p className="error">{error}</p>}

        {/* Analysis Output */}
        {analysis && (
          <div className="analysis-output">
            <h2>AI Insight</h2>
            <p>{analysis}</p>
          </div>
        )}

        {/* Mood Check-in */}
        <div className="check-in">
          <h3>Quick Mood Check-in</h3>
          <input
            type="text"
            placeholder="How are you feeling right now?"
            value={checkInInput}
            onChange={(e) => setCheckInInput(e.target.value)}
          />
          <button onClick={saveCheckIn}>Save Mood</button>
          {checkInMood && <p>Last mood saved: {checkInMood}</p>}
        </div>

        {/* Entries List */}
        <section className="entries-section">
          <h3>Your Past Entries & Moods</h3>
          {entries.length === 0 && <p>No entries yet.</p>}
          <ul>
            {entries.map((entry) =>
              entry.text ? (
                <li key={entry.id}>
                  <strong>{entry.date}:</strong> {entry.text}
                  {entry.analysis && (
                    <p className="entry-analysis">Insight: {entry.analysis}</p>
                  )}
                </li>
              ) : (
                <li key={entry.id}>
                  <strong>{entry.date}:</strong> Mood: {entry.mood}
                </li>
              )
            )}
          </ul>
        </section>

        {/* Tips & Resources */}
        <section className="tips-section">
          <h3>Self-Care Tips</h3>
          <ul>
            {tips.map((tip, i) => (
              <li key={i}>💡 {tip}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
