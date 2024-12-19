import { useState } from "react";
import "./App.css";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {marked} from "marked";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  let [chats, setChats] = useState([]);
  let [initValue, setInitvalue] = useState("");
  let [isLoad, setIsLoad] = useState(false);
  let [isLight, setIsLight] = useState(true);

  let body = document.querySelector("body");
  body.style.backgroundColor = (isLight) ? "#f3f4f6" : "#111827";

  let input_style = (isLight)? {
    backgroundColor: "#030712",
    color: "white",
  } : {
    backgroundColor: "#d1d5db",
    color: "black",
  }

  const getResponse = async (prompt) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    setIsLoad(true);
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    response = marked(response);
    setChats((prevChat) => [...prevChat, [response, 1]]);
    setIsLoad(false);
  }
  
  const enterPrompt = (event) => {
    event.preventDefault();
    let prompt = event.target[0].value;
    if(prompt != "") {
      setChats((prevChat) => [...prevChat, [prompt, 0]]);
      setInitvalue("");
      getResponse(prompt);
    }
  }

  const changeValue = (event) => {
    setInitvalue(event.target.value);
  }

  return (
    <div className="main-area">
      <img src="https://i.ibb.co/wCLddFF/gemchat-logo.png" alt="" style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          height: "50px",
        }}/>
      <label className="grid cursor-pointer place-items-center"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px"
        }}
      >
        <input
          type="checkbox"
          onChange={() => {
            setIsLight(!isLight);
          }}
          className="toggle toggle-lg theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
        />
        <svg
          className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <svg
          className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
      <div className="chat">
        <div className="chat-box">
          {chats.length == 0 ? (
            <div>
              <h1></h1>
            </div>
          ) : (
            chats.map((el) => {
              return el[1] == 1 ? (
                <div className="chat chat-start">
                  <div
                    className="chat-bubble chat-bubble-primary"
                    dangerouslySetInnerHTML={{ __html: el[0] }}
                    style={{
                      backgroundColor: "#374151",
                      color: "white",
                      overflowX: "scroll",
                      scrollbarWidth: "none"
                    }}
                  ></div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div
                    className="chat-bubble chat-bubble-error"
                    style={{
                      backgroundColor: "#d1d5db",
                    }}
                  >
                    {el[0]}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <form action="" className="prompt" onSubmit={enterPrompt}>
          <input
            type="text"
            placeholder="Enter prompt here"
            value={initValue}
            className="input input-bordered input-primary w-full"
            onChange={changeValue}
            style={input_style}
          />
          &nbsp;&nbsp;
          {isLoad ? (
            <button
              className="btn btn-square"
              disabled="disabled"
              style={input_style}
            >
              <span className="loading loading-dots"></span>
            </button>
          ) : (
            <button
              type="submit"
              className="btn"
              style={input_style}
            >
              Enter
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
