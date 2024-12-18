import { useState } from "react";
import "./App.css";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {marked} from "marked";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  let [chats, setChats] = useState([]);
  let [initValue, setInitvalue] = useState("");
  let [isLoad, setIsLoad] = useState(false);

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
      <h1 style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        fontSize: "30px"
      }}>GemChat</h1>
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
                  <div className="chat-bubble chat-bubble-primary" dangerouslySetInnerHTML={{__html: el[0]}} style={{
                    backgroundColor: "#374151",
                    color: "white"
                  }}></div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div className="chat-bubble chat-bubble-error" style={{
                    backgroundColor: "#d1d5db"
                  }}>{el[0]}</div>
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
            style={{
              backgroundColor: "#d1d5db",
              color: "black"
            }}
          />
          &nbsp;&nbsp;
          {isLoad ? (
            <button className="btn btn-square" style={{
              backgroundColor: "#d1d5db"
            }}>
              <span className="loading loading-dots"></span>
            </button>
          ) : (
            <button type="submit" className="btn" style={{
              backgroundColor: "#d1d5db",
              color: "black"
            }}>
              Enter
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
