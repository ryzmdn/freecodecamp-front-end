const drumSounds = [
  {
    keyCode: 81,
    keyTrigger: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    keyCode: 87,
    keyTrigger: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    keyCode: 69,
    keyTrigger: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    keyCode: 65,
    keyTrigger: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    keyCode: 83,
    keyTrigger: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    keyCode: 68,
    keyTrigger: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    keyCode: 90,
    keyTrigger: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    keyCode: 88,
    keyTrigger: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    keyCode: 67,
    keyTrigger: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

const { useState, useEffect, useCallback } = React;
const { Provider, useSelector, useDispatch } = ReactRedux;

// Redux Actions
const PLAY_SOUND = "PLAY_SOUND";

const playSound = (soundId) => ({
  type: PLAY_SOUND,
  payload: soundId,
});

// Reducer
const initialState = {
  lastPlayed: "",
};

const drumReducer = (state = initialState, action) => {
  if (action.type === PLAY_SOUND) {
    return { ...state, lastPlayed: action.payload };
  }

  return state;
};

// Create Redux Store
const store = Redux.createStore(drumReducer);

// Drum Pad Component
const DrumPad = ({ drumKit }) => {
  const dispatch = useDispatch();

  const playDrumSound = useCallback(() => {
    const audioElement = document.getElementById(drumKit.keyTrigger);
    audioElement.currentTime = 0;
    audioElement.play();
    dispatch(playSound(drumKit.id));
  }, [drumKit, dispatch]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === drumKit.keyCode) {
        playDrumSound();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [drumKit, playDrumSound]);

  return (
    <div
      className="drum-pad col btn btn-dark d-flex justify-content-center align-items-center"
      id={drumKit.id}
      onClick={playDrumSound}
    >
      {drumKit.keyTrigger}
      <audio className="clip" id={drumKit.keyTrigger} src={drumKit.url} />
    </div>
  );
};

// Drum Machine Component
const DrumMachine = () => {
  const lastPlayed = useSelector((state) => state.lastPlayed);

  return (
    <div id="drum-machine" className="text-center p-4 bg-dark rounded-2 shadow">
      <div id="display" className="fs-4 fw-medium mb-4 py-2 bg-secondary text-white">
        {lastPlayed || "Play a sound"}
      </div>
      <div className="row row-cols-3 justify-content-center gap-2">
        {drumSounds.map((sound) => (
          <DrumPad key={sound.keyTrigger} drumKit={sound} />
        ))}
      </div>
    </div>
  );
};

// Render App
const App = () => (
  <Provider store={store}>
    <main id="container" className="d-flex justify-content-center align-items-center">
      <DrumMachine />
    </main>
  </Provider>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
