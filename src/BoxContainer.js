import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import UserInput from './UserInput';
import OutputBox from './OutputBox';
import SearchedResults from './SearchedResults';
import Goose from './static/goose.png';
import SignInButtons from './SignInButtons';
import TimeComplexity from './TimeComplexity';

// mock data for searched:
// to test first update username in the state to any mock string as well
const mockDataForSearch = [
  {
    code: `<!DOCTYPE html>
    <html>
    <head>
        <title>
            How to insert spaces/tabs in text using HTML/CSS?
        </title>
    </head>
    <body>
        <h1 style="color: green">GeeksforGeeks</h1>
        <b>How to insert spaces/tabs in text using HTML/CSS?</b>

        <p>This is a &nbsp; regular space.</p>
        <p>This is a &ensp; two spaces gap.</p>
        <p>This is a &emsp; four spaces gap.</p>
    </body>
    </html>`,
    translation: 'This is a function with console.log',
  },
  {
    code: 'useEffect(() => {setInputTextLength(inputText.toString().length)',
    translation: 'this is another function',
  },
];

function BoxContainer() {
  const [inputText, setInputText] = useState('');
  const [inputTextLength, setInputTextLength] = useState(0);
  const [inputLanguage, setInputLanguage] = useState('Javascript');
  const [outputText, setOutputText] = useState('');
  const [username, setUsername] = useState('');
  const [open, setHistoryOpen] = useState(false);
  const [shrinkComponent, setShrinkComponent] = useState({});
  const [searched, setSearched] = useState(mockDataForSearch);

  // New Feature: Time Complexity 
  const [complexityText, setComplexityText] = useState('');

  useEffect(() => {
    setInputTextLength(inputText.toString().length);
  });

  // // functionality to get previously researched queries from the database
  // useEffect(() => {
  //   if (username) {
  //     const requestURI = process.env.BACKEND_API_URI + '/user/getRequests';
  //     const getSearched = async () => {
  //       const response = await fetch(requestURI, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Access-Control-Allow-Origin': '*', // might not need this
  //         },
  //         body: JSON.stringify({
  //           username: username,
  //         }),
  //       });
  //       return response.data;
  //     };
  //     const data = getSearched();
  //     setSearched(data);
  //   }
  // }, [username]);

  // function to invoke when user clicks one previously searched query
  // we expect to see full code and translation in the input / output boxes
  function handleElementClick(obj) {
    setShrinkComponent({ shrink: 'true' });
    document.querySelector('#filled-multiline-static').value = obj.code;
    setOutputText(obj.translation);
  }

  const handleTyping = (event) => {
    setInputText(event.target.value);
  };

  const CopyToClipBoardNormal = (event) => {
    if (!outputText) return;

    const lineLength = 40;
    let copyOutput = outputText[0];
    let readyToCopy = false;
    for (let i = 1; i < outputText.length; i++) {
      if (i % lineLength === 0) readyToCopy = true;
      if (readyToCopy && outputText[i] === ' ') {
        copyOutput += '\n';
        readyToCopy = false;
        continue;
      }
      copyOutput += outputText[i];
    }
    navigator.clipboard.writeText(copyOutput);
  };

  const CopyToClipBoardSudo = (event) => {
    if (!outputText) return;

    const lineLength = 40;
    let copyOutput = outputText[0];
    let readyToCopy = false;
    for (let i = 1; i < outputText.length; i++) {
      if (i % lineLength === 0) readyToCopy = true;
      if (readyToCopy && outputText[i] === ' ') {
        copyOutput += '\n';
        readyToCopy = false;
        continue;
      }
      copyOutput += outputText[i];
    }
    const textToCopy = `/*\n ${copyOutput} \n */`;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleSubmit = async (event) => {
    console.log(JSON.stringify(inputText));
    event.preventDefault();

    // Determines where we send the HTTP Request
    const requestURI = process.env.BACKEND_API_URI; 

    // 
    const json = {
      text: inputText,
      language: 'JavaScript',
    };

    // sending username if user is logged in
    if (username.length > 0) {
      json.username = username;
    }

    const response = await axios.post(requestURI, json, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    // **********
    // Need to invoke setComplexityText based on whatever the server responds with
    setOutputText(response.data.text);
    setComplexityText(response.data.complexityText);
  };

  const handleHistoryOpen = () => {
    setHistoryOpen(!open);
  };

  return (
    <>
      <div id='headerButtons'>
        <SignInButtons setUsername={setUsername} stateUsername={username} />
        {username && (
          <div className='dropdown'>
            <Button onClick={handleHistoryOpen}>Your History</Button>
            {open ? (
              <SearchedResults
                handleElementClick={handleElementClick}
                searched={searched}
              />
            ) : null}
          </div>
        )}
      </div>
      <main id='BoxContainer' style={{ display: 'flex' }}>
        <UserInput
          shrinkComponent={shrinkComponent}
          inputlanguage={inputLanguage}
          inputText={inputText}
          handleTyping={handleTyping}
          handleSubmit={handleSubmit}
          inputTextLength={inputTextLength}
        />
        <div id='imgWrapper'>
          <img id='goose' src={Goose}></img>
        </div>
        <div className="output-side">
          <OutputBox
          username={username}
          outputText={outputText}
          copyNormal={CopyToClipBoardNormal}
          copySudo={CopyToClipBoardSudo}
          />
          { username !== '' &&
            <TimeComplexity complexityText={complexityText}/>
          }
          
        </div>
      </main>
    </>
  );
}

export default BoxContainer;
