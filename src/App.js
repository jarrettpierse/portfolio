import logo from './load.gif'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>There'll be something here... eventually 👀</h1>
        <img src={logo} width="20%" alt="loading..." />
        <p>If you can't wait that long, find me on   <a
          className="App-link"
          href="https://www.linkedin.com/in/jarrettpierse/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a> 🙂</p>
      </header>
    </div>
  );
}

export default App;
