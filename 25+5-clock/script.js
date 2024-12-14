const audio = document.getElementById("beep");

const SetTimer = ({ title, count, handleDecrease, handleIncrease }) => {
  const id = title.toLowerCase();

  return (
    <div>
      <h2 id={`${id}-label`} className="fs-3 fw-semibold">{title} Length</h2>
      <div className="d-flex justify-content-center align-items-center my-3">
        <button id={`${id}-decrement`} className="btn btn-danger" onClick={handleDecrease}>
          <i class="bi bi-dash" />
        </button>
        <div id={`${id}-length`} className="fs-5 fw-semibold px-4">{count}</div>
        <button id={`${id}-increment`} className="btn btn-success" onClick={handleIncrease}>
          <i class="bi bi-plus" />
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [breakCount, setBreakCount] = React.useState(5);
  const [sessionCount, setSessionCount] = React.useState(25);
  const [timerCount, setTimerCount] = React.useState(25 * 60);
  const [currentTimer, setCurrentTimer] = React.useState("Session");
  const [playing, setPlaying] = React.useState(false);

  const loop = React.useRef(null);

  React.useEffect(() => {
    if (playing) {
      loop.current = setInterval(() => {
        setTimerCount((prev) => {
          if (prev === 0) {
            audio.play();
            setCurrentTimer((timer) =>
              timer === "Session" ? "Break" : "Session"
            );
            return currentTimer === "Session"
              ? breakCount * 60
              : sessionCount * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(loop.current);
    }

    return () => clearInterval(loop.current);
  }, [playing, currentTimer, breakCount, sessionCount]);

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
  };

  const handleReset = () => {
    clearInterval(loop.current);
    setBreakCount(5);
    setSessionCount(25);
    setTimerCount(25 * 60);
    setCurrentTimer("Session");
    setPlaying(false);
    audio.pause();
    audio.currentTime = 0;
  };

  const convertToTime = (count) => {
    const minutes = String(Math.floor(count / 60)).padStart(2, "0");
    const seconds = String(count % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleLengthChange = (count, timerType) => {
    if (playing) return;

    if (timerType === "session") {
      const currentCount = sessionCount + count;
      if (currentCount > 0 && currentCount < 61) {
        setSessionCount(currentCount);
        if (currentTimer === "Session") setTimerCount(currentCount * 60);
      }
    } else {
      const currentCount = breakCount + count;
      if (currentCount > 0 && currentCount < 61) {
        setBreakCount(currentCount);
        if (currentTimer === "Break") setTimerCount(currentCount * 60);
      }
    }
  };

  const breakProps = {
    title: "Break",
    count: breakCount,
    handleDecrease: () => handleLengthChange(-1, "break"),
    handleIncrease: () => handleLengthChange(1, "break"),
  };

  const sessionProps = {
    title: "Session",
    count: sessionCount,
    handleDecrease: () => handleLengthChange(-1, "session"),
    handleIncrease: () => handleLengthChange(1, "session"),
  };

  return (
    <main id="container" className="d-flex justify-content-center align-items-center">
      <div>
        <div className="d-flex align-items-center column-gap-5">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>

        <div className="bg-white shadow-sm text-center my-3 py-4 rounded-3">
          <h1 id="timer-label" className="fs-1 fw-bold">{currentTimer}</h1>
          <div id="time-left" className="fs-3 fw-semibold my-3">{convertToTime(timerCount)}</div>

          <div className="d-flex justify-content-center align-items-center column-gap-2">
            <button id="start_stop" className="btn btn-primary" onClick={handlePlayPause}>
              <i className={`bi bi-${playing ? "pause-fill" : "play-fill"}`} />
            </button>
            <button id="reset" className="btn btn-danger" onClick={handleReset}>
              <i class="bi bi-arrow-clockwise" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
