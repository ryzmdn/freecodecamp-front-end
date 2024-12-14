const UPDATE_MARKDOWN = "UPDATE_MARKDOWN";

// Prism
marked.setOptions({
  breaks: true,
  highlight: function (code, lang) {
    const language = Prism.languages[lang] || Prism.languages.markup;
    return Prism.highlight(code, language, lang);
  },
});

const initialState = {
  markdown: `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`javascript
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`,
};

// Redux Reducer
const markdownReducer = (state = initialState, action) => {
  if (action.type === UPDATE_MARKDOWN) {
    return { ...state, markdown: action.payload };
  }
  
  return state;
};

// Redux Store
const store = Redux.createStore(markdownReducer);

// Component
const MarkdownApp = () => {
  const [markdown, setMarkdown] = React.useState(store.getState().markdown);

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setMarkdown(store.getState().markdown);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (event) => {
    store.dispatch({
      type: UPDATE_MARKDOWN,
      payload: event.target.value,
    });
  };

  return React.createElement(
    "main",
    { className: "markdown-container" },
    React.createElement(
      "div",
      { className: "row" },
      // Editor column
      React.createElement(
        "div",
        { className: "col-6" },
        React.createElement("textarea", {
          id: "editor",
          className: "form-control editor overflow-y-auto",
          value: markdown,
          onChange: handleChange,
          autoComplete: "off",
          spellCheck: "false",
        })
      ),
      // Preview column
      React.createElement(
        "div",
        { className: "col-6" },
        React.createElement("div", {
          id: "preview",
          className: "preview overflow-auto",
          dangerouslySetInnerHTML: {
            __html: marked.parse(markdown),
          },
        })
      )
    )
  );
};

// Render App root
$(document).ready(() => {
  ReactDOM.render(
    React.createElement(MarkdownApp),
    document.getElementById("root")
  );
});
