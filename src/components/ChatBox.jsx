import React, { useState, useEffect } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import '../index.css';

const ChatBox = () => {
  const [isVisible, setIsVisible] = useState(false); // Manage chatbox visibility
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Joe. What are you looking for?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const predefinedQuestions = [
    "Tell me about your services.",
    "What is your pricing?",
    "How to register new school?",
    "When do you expect for system to be implemented?",
    "Thank you",
  ];

  const botResponses = {
    "Tell me about your services.": "We provide quality gap solutions for educators, by providing tools to streamline their operations. We recommand you to look at service section to know more.",
    "What is your pricing?": "At the launch of the product, each school will be required to pay 50 USD per year. There is one term trial for new parternaer school",
    "How to register new school?": "Click on 'Join Request' button to apply. Our team will recieve your request and reply as soon as possible ",
    "When do you expect for system to be implemented?":"Our team is working tirelessly behind the scenes to craft something truly extraordinary just for you. We will let you know if the system is ready. Stay tuned 🎇 ",
    "Thank you": "You're welcome. If you need more support, please feel free to contact us througth nshimiefaustinpeace@gmail.com",
    
  };

  const handleQuestionClick = (question) => {
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botResponses[question] || "Sorry, I am not capable of answering every question that you ask. Please Select question in section below instead." },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleUserInputSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setUserInput("");

    setIsTyping(true);
    setTimeout(() => {
      const response = botResponses[userMessage] || "Sorry, I am not capable of answering every question that you ask. Please Select question in section below instead.";
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // Show chatbox after 2 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="fixed z-10 bottom-4 right-4">
      {/* Minimized Icon */}
      {!isVisible && (
            <button
            onClick={() => setIsVisible(true)}
            className="p-3  bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition bounce-animation"
          >
            <FaComments size={20} />
          </button>
     
      )}

      {/* Chatbox */}
      {isVisible && (
        <div className="bg-white shadow-2xl rounded-lg w-96 relative overflow-hidden animate-fade-in mt-4">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chat with Joe</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200"
            >
              <RiArrowDropDownLine size={40} />
            </button>
          </div>

                  {/* Messages Section */}
          <div className="h-40 overflow-y-scroll p-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "bot"
                    ? "text-left text-blue-800 bg-blue-100"
                    : "text-right text-green-800 bg-green-100"
                } p-2 rounded-lg shadow-sm max-w-xs ${
                  msg.sender === "bot" ? "self-start" : "self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="text-left text-gray-500 italic">Typing...</div>
            )}
          </div>

          {/* Predefined Questions */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-600 mb-2">FAQ:</h4>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-24">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="px-3 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>


         
          

          {/* User Input */}
          <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              className="p-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
              onClick={handleUserInputSubmit}
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
