// Redux Actions
const SET_RANDOM_QUOTE = "SET_RANDOM_QUOTE";

const setRandomQuote = () => ({
  type: SET_RANDOM_QUOTE,
});

// Initial State
const initialState = {
  quotes: [
    {
      text: "The best way to predict the future is to invent it.",
      author: "Alan Kay",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
    },
    {
      text: "You miss 100% of the shots you don't take.",
      author: "Wayne Gretzky",
    },
  ],
  currentQuote: null,
};

// Redux Reducer
const quoteReducer = (state = initialState, action) => {
  if (action.type === SET_RANDOM_QUOTE) {
    const randomIndex = Math.floor(Math.random() * state.quotes.length);
    return {
      ...state,
      currentQuote: state.quotes[randomIndex],
    };
  }
  return state;
};

// Redux Store
const store = Redux.createStore(quoteReducer);

// React Component
const QuoteBox = () => {
  const dispatch = ReactRedux.useDispatch();
  const currentQuote = ReactRedux.useSelector((state) => state.currentQuote);

  React.useEffect(() => {
    dispatch(setRandomQuote());
  }, [dispatch]);

  const handleNewQuote = () => {
    dispatch(setRandomQuote());
  };

  React.useEffect(() => {
    $("#quote-box").fadeIn(500);
  }, [currentQuote]);

  if (!currentQuote) return null;

  return (
    <main id="container" className="d-flex flex-column justify-content-center align-items-center w-100">
      <div id="quote-box" className="overflow-hidden px-3 rounded-3 bg-white shadow">
        <div className="inner-quote-box py-3">
          <div id="text" className="w-100">
            <blockquote id="quote-text" className="fs-2 fw-semibold text-center py-3">
              <p>{currentQuote.text}</p>
            </blockquote>
          </div>
          <div id="author" className="fs-6 text-secondary text-end my-2">
            - {currentQuote.author}
          </div>
          <div className="d-flex justify-content-between w-100 my-4">
            <a id="tweet-quote" href={`https://twitter.com/intent/tweet?text="${currentQuote.text}" - ${currentQuote.author}`} target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center align-items-center bg-white rounded-2 text-decoration-none">
              <i className="bi bi-twitter-x fs-5"></i>
            </a>
            <button id="new-quote" onClick={handleNewQuote} className="fs-6 fw-medium text-white px-3 py-1 rounded-2 shadow-sm">
              New Quote
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

function App() {
  return (
    <ReactRedux.Provider store={store}>
      <QuoteBox />
    </ReactRedux.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
