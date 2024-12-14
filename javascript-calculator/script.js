function evaluateExpression(expression) {
  expression = expression.replace(/\s+/g, "").replace(/--/g, "+");

  function calculate(tokens) {
    while (tokens.includes("*") || tokens.includes("/")) {
      for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === "*" || tokens[i] === "/") {
          const left = parseFloat(tokens[i - 1]);
          const right = parseFloat(tokens[i + 1]);
          let result;

          switch (tokens[i]) {
            case "*":
              result = left * right;
              break;
            case "/":
              result = left / right;
              break;
          }

          tokens.splice(i - 1, 3, result.toString());
        }
      }
    }

    while (tokens.includes("+") || tokens.includes("-")) {
      for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === "+" || tokens[i] === "-") {
          const left = parseFloat(tokens[i - 1]);
          const right = parseFloat(tokens[i + 1]);
          let result;

          switch (tokens[i]) {
            case "+":
              result = left + right;
              break;
            case "-":
              result = left - right;
              break;
          }

          tokens.splice(i - 1, 3, result.toString());
        }
      }
    }

    return parseFloat(tokens[0]);
  }

  const tokens = [];
  let currentToken = "";
  let lastIsOperator = true;

  for (let char of expression) {
    if ("+-*/".includes(char)) {
      if (currentToken !== "") {
        tokens.push(currentToken);
        currentToken = "";
      }

      if (char === "-" && lastIsOperator) {
        currentToken = char;
      } else if (lastIsOperator) {
        if (tokens.length > 0 && "*/+-".includes(tokens[tokens.length - 1])) {
          tokens.pop();
        }
        tokens.push(char);
      } else {
        tokens.push(char);
      }
      lastIsOperator = true;
    } else {
      currentToken += char;
      lastIsOperator = false;
    }
  }

  if (currentToken !== "") {
    tokens.push(currentToken);
  }

  return Number(calculate(tokens).toFixed(4));
}

const INPUT_NUMBER = "INPUT_NUMBER";
const CLEAR_DISPLAY = "CLEAR_DISPLAY";
const BACK_SPACE = "BACK_SPACE";
const PERFORM_OPERATION = "PERFORM_OPERATION";
const CALCULATE_RESULT = "CALCULATE_RESULT";
const INPUT_DECIMAL = "INPUT_DECIMAL";

const inputNumber = (number) => ({ type: INPUT_NUMBER, payload: number });
const clearDisplay = () => ({ type: CLEAR_DISPLAY });
const backSpace = () => ({ type: BACK_SPACE });
const performOperation = (operation) => ({
  type: PERFORM_OPERATION,
  payload: operation,
});
const calculateResult = () => ({ type: CALCULATE_RESULT });
const inputDecimal = () => ({ type: INPUT_DECIMAL });

const initialState = {
  displayValue: "0",
  formula: "0",
  justCalculated: false,
};

function calculatorReducer(state = initialState, action) {
  switch (action.type) {
    case INPUT_NUMBER: {
      if (state.justCalculated) {
        return {
          ...state,
          displayValue: String(action.payload),
          formula: String(action.payload),
          justCalculated: false,
        };
      }
      return {
        ...state,
        displayValue:
          state.displayValue === "0"
            ? String(action.payload)
            : state.displayValue + action.payload,
        formula:
          state.formula === "0"
            ? String(action.payload)
            : state.formula + action.payload,
        justCalculated: false,
      };
    }
    case INPUT_DECIMAL: {
      const lastPart = state.displayValue.split(/[+\-*/]/).pop();
      if (!lastPart.includes(".")) {
        return {
          ...state,
          displayValue: state.displayValue + ".",
          formula: state.formula + ".",
        };
      }
      return state;
    }
    case CLEAR_DISPLAY: {
      return initialState;
    }
    case BACK_SPACE: {
      const newDisplayValue = state.displayValue.length > 1 ? state.displayValue.slice(0, -1) : "0";
      const newFormula = state.formula.length > 1 ? state.formula.slice(0, -1) : "";

      return {
        ...state,
        displayValue: newDisplayValue,
        formula: newFormula,
      };
    }
    case PERFORM_OPERATION: {
      if (state.justCalculated) {
        return {
          ...state,
          displayValue: "0",
          formula: state.displayValue + action.payload,
          justCalculated: false,
        };
      }

      const updatedFormula = state.formula.replace(
        /([+\-*/])([+\-*/]+)/g,
        (_, first, rest) => {
          return first === "-" ? first + rest.slice(-1) : rest.slice(-1);
        }
      );

      return {
        ...state,
        displayValue: "0",
        formula: updatedFormula + action.payload,
        justCalculated: false,
      };
    }
    case CALCULATE_RESULT: {
      try {
        const result = evaluateExpression(state.formula);
        return {
          ...state,
          displayValue: String(result),
          formula: String(result),
          justCalculated: true,
        };
      } catch (error) {
        return {
          ...state,
          displayValue: "Error",
          formula: "",
          justCalculated: true,
        };
      }
    }
    default: {
      return state;
    }
  }
}

const store = Redux.createStore(calculatorReducer);

function Calculator() {
  const dispatch = ReactRedux.useDispatch();
  const displayValue = ReactRedux.useSelector((state) => state.displayValue);
  const formula = ReactRedux.useSelector((state) => state.formula);

  const handleNumberClick = (number) => {
    dispatch(inputNumber(number));
  };

  const handleOperationClick = (operation) => {
    dispatch(performOperation(operation));
  };

  return (
    <main>
      <div className="calculator">
        <div className="form-control text-end">
          <div className="row mb-2">
            <div className="fs-4 text-muted">{formula}</div>
          </div>
          <div id="display" className="fs-3">
            {displayValue}
          </div>
        </div>
        <div className="row g-2">
          <button
            id="clear"
            className="col-3 text-danger btn"
            onClick={() => dispatch(clearDisplay())}
          >
            AC
          </button>
          <button
            id="divide"
            className="col-3 text-primary btn"
            onClick={() => handleOperationClick("/")}
          >
            &divide;
          </button>
          <button
            id="multiply"
            className="col-3 text-primary btn"
            onClick={() => handleOperationClick("*")}
          >
            &times;
          </button>
          <button
            id="subtract"
            className="col-3 text-primary btn"
            onClick={() => handleOperationClick("-")}
          >
            &minus;
          </button>
          <button
            id="seven"
            className="col-3 btn"
            onClick={() => handleNumberClick(7)}
          >
            7
          </button>
          <button
            id="eight"
            className="col-3 btn"
            onClick={() => handleNumberClick(8)}
          >
            8
          </button>
          <button
            id="nine"
            className="col-3 btn"
            onClick={() => handleNumberClick(9)}
          >
            9
          </button>
          <button
            id="add"
            className="col-3 text-primary btn"
            onClick={() => handleOperationClick("+")}
          >
            &#43;
          </button>
          <button
            id="four"
            className="col-3 btn"
            onClick={() => handleNumberClick(4)}
          >
            4
          </button>
          <button
            id="five"
            className="col-3 btn"
            onClick={() => handleNumberClick(5)}
          >
            5
          </button>
          <button
            id="six"
            className="col-3 btn"
            onClick={() => handleNumberClick(6)}
          >
            6
          </button>
          <button
            id="equals"
            className="col-3 text-primary btn"
            onClick={() => dispatch(calculateResult())}
          >
            &#61;
          </button>
          <button
            id="one"
            className="col-3 btn"
            onClick={() => handleNumberClick(1)}
          >
            1
          </button>
          <button
            id="two"
            className="col-3 btn"
            onClick={() => handleNumberClick(2)}
          >
            2
          </button>
          <button
            id="three"
            className="col-3 btn"
            onClick={() => handleNumberClick(3)}
          >
            3
          </button>
          <button
            id="decimal"
            className="col-3 text-primary btn"
            onClick={() => dispatch(inputDecimal())}
          >
            .
          </button>
          <button
            id="zero"
            className="col-6 btn"
            onClick={() => handleNumberClick(0)}
          >
            0
          </button>
          <button
            id="five"
            className="col-3 text-danger btn"
            onClick={() => dispatch(backSpace())}
          >
            BC
          </button>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <ReactRedux.Provider store={store}>
      <Calculator />
    </ReactRedux.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
