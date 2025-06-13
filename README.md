# PetriGo

PetriGo is a web application for modeling, simulating, and analyzing Petri Nets. It combines an intuitive React-based interface with a robust JavaScript simulation core, enabling users to visually create nets, run simulations, and explore advanced properties such as liveness, boundedness, and persistence.

---

## Features

- **Interactive Visual Editor:** Build Petri Nets by adding places, transitions, and arcs via a drag-and-drop UI.
- **Simulation Engine:** Simulate the dynamic behavior of your net with immediate and timed transitions.
- **Property Analysis:** Check for net properties such as boundedness, liveness, and persistence.
- **Customizable Tokens and Capacities:** Configure places, transitions, arc weights, and inhibitor arcs.
- **Real-time Feedback:** Visualize token movements and transition firings during simulation.
- **Export/Import:** Save and load your Petri Net models.
- **Marking Graphs:** Generate and explore the full marking graph (graphe de marquages) and the tangible marking graph (graphe de marquage tangible) for your net to analyze its reachable states and tangible states.
- **Educational Resources & Guide:** A comprehensive user guide is included to explain the features of PetriGo and help you get the most out of the tool.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher recommended)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MarwaOB/PetriGo.git
cd PetriGo
npm install
```

### Available Scripts

- **Start development server:**
  ```bash
  npm start
  ```
  Visit [http://localhost:3000](http://localhost:3000) in your browser.

- **Run tests:**
  ```bash
  npm test
  ```

- **Build for production:**
  ```bash
  npm run build
  ```

- **Eject (advanced, irreversible):**
  ```bash
  npm run eject
  ```

---

## Project Structure

- `/src/modules/Petri_Net.js` – Core Petri Net implementation (places, transitions, arcs, simulation logic).
- `/src/modules/Marking.js` – Marking and state management, transition enabling, property checking, marking graph generation.
- `/src/modules/Arc.js` – Arc types, weights, and connections.
- `/src/Functions/simulate.js` – Simulation helpers and user feedback.
- `/public/` – Static assets (including token images).
- `/src/components/` – React UI components (editor, visualization, controls).
- `/docs/guide.md` – User guide explaining all features and usage of PetriGo.

---

## How It Works

1. **Create a Petri Net:** Add places, transitions, and connect them with arcs (regular or inhibitor).
2. **Assign Tokens:** Set initial tokens and place capacities.
3. **Simulate:** Click run to watch tokens flow and transitions fire according to the net's rules.
4. **Analyze:** Use built-in tools to check properties like liveness, boundedness, and persistence.
5. **Marking Graphs:** Automatically generate the marking graph and tangible marking graph to visualize all possible (and only tangible) states reachable by your net.

---

## Advanced Topics

- [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
- [Troubleshooting: build fails to minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Learn More

- [Petri Net Introduction (Wikipedia)](https://en.wikipedia.org/wiki/Petri_net)
- [Petri Net Tutorials](https://www.petrinets.info/tutorials/)
- [React Documentation](https://reactjs.org/)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Questions, feedback, or contributions?  
Open an issue or reach out to [MarwaOB](https://github.com/MarwaOB).

---
