
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/sidebar/LogoutButton";
import { io } from "socket.io-client";

const App = () => {
  const [newCardContent, setNewCardContent] = useState("");
  const [date, setdate] = useState("");
  const [cards, setCards] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [messages, setMessages] = useState({});
  const userData = JSON.parse(localStorage.getItem("chat-user"));
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatRoomName, setChatRoomName] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    axios
      .get("/api/travel")
      .then((response) => {
        setCards(response.data.todos || []);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });
    setSocket(socket);

    // Track the state of the socket connection

    socket.on("connect", () => {
      console.log("WebSocket connected");
      setSocketConnected(true);
    });

    // Cleanup function for the previous-messages event listener
    return () => {
      socket.off("travel-previous-messages");
      socket.off("travel-receive-message");
      socket.disconnect();
    };
  }, []);

  // Effect for handling previous-messages
  useEffect(() => {
    if (!socket) return; // Ensure socket is initialized

    const handlePreviousMessages = (previousMessages) => {
      console.log("Received previous messages:", previousMessages);
      console.log("Current selected card index:", selectedCardIndex);
      console.log("Current messages:", messages);
      // Update the state with the previous messages
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedCardIndex]: previousMessages,
      }));
      console.log("Updated messages:", messages);

      setLoadingMessages(false); // Set loading state to false after fetching messages
    };

    // Add the event listener
    socket.on("travel-previous-messages", handlePreviousMessages);

    // Cleanup function to remove the event listener when component unmounts or when the socket changes
    return () => {
      socket.off("travel-previous-messages", handlePreviousMessages);
    };
  }, [socket, selectedCardIndex, messages]); // Ensure dependencies are updated properly

  // Effect for handling receive-message
  useEffect(() => {
    if (!socket) return; // Ensure socket is initialized

    const handleReceiveMessage = (data) => {
      console.log("travel-Received message:", data);
      if (data.room !== undefined) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.room]: [...(prevMessages[data.room] || []), data],
        }));
      }
    };

    // Add the event listener
    socket.on("travel-receive-message", handleReceiveMessage);

    // Cleanup function to remove the event listener when component unmounts or when the socket changes
    return () => {
      socket.off("travel-receive-message", handleReceiveMessage);
    };
  }, [socket, messages]); // Ensure dependencies are updated properly

  const handleInputChange = (event) => {
    setNewCardContent(event.target.value);
  };
  const handleDateChange = (event) => {
    setdate(event.target.value);
  };

  const handleAddCard = async (index) => {
    const formData = new FormData();
    setSelectedCardIndex(index);

    try {
      const response = await axios.post("/api/server1/travel", {
        destination: newCardContent,
        user: userData.fullName,
        date: date,
        iD:selectedCardIndex,
      });
      alert("Todo added");
      setCards((prevCards) => [...prevCards, response.data]);
      setNewCardContent("");
      setdate("");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleOpenChat = (index) => {
    setSelectedCardIndex(index);
    setChatRoomName(cards[index].name);
    setShowSidebar(true);
    if (socket) {
      socket.emit("travel-join-room", index);
      if (!messages[index]) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [index]: [],
        }));
      }
    }
  };

  const handleCloseChat = () => {
    setShowSidebar(false);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (socket || selectedCardIndex !== null) {
      socket.emit("travel-message", {
        text: messageInput,
        room: selectedCardIndex,
        sender: userData.fullName,
      });
      setMessageInput("");
    }
  };

  const handleRemoveCard = async (index) => {
    try {
      const card = cards[index]; // Get the card object from the cards array based on the index
      console.log(card.user)
      // Check if the username of the card matches the current username
      if (card.user === userData.fullName) {
        // If the usernames match, proceed with deletion
        await axios.delete(`/api/server1/travel/${index}`);
        setCards((prevCards) => prevCards.filter((_, i) => i !== index));
        alert("Card is removed");
      } else {
        // If the usernames don't match, display an alert message
        alert("Username mismatch. Deletion not allowed.");
        // Optionally perform another action
      }
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };
  
  


  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (
        card &&
        typeof card.destination === "string" &&
        typeof card.user === "string" &&
        typeof card.date === "string"
      ) {
        return (
          card.destination.toLowerCase().includes(filterText.toLowerCase()) ||
          card.user.toLowerCase().includes(filterText.toLowerCase()) ||
          card.date.toLowerCase().includes(filterText.toLowerCase())
        );
      }
      return false;
    });
  }, [cards, filterText]);

  return (
    <div>
      <div className="new-ui">
        <div className="topbar">
          <div className="top-barservers">
            <a href="/">TUEXCHANGE</a>
          </div>

          <div className="top-barservers">
            <a href="/server1">LOST</a>
            <a href="/server2">TRAVEL</a>
            <a href="/server3">RESELL</a>
            <a href="/server4">BUSINESS</a>
          </div>
        </div>
        <div className="main-content">
          <div className="sidebar">
            <div>
              <LogoutButton />
            </div>
            <h2>Post Travel Details</h2>
            <div className="addlost2">
              <div>
                <input
                  type="text"
                  className="papa"
                  placeholder="Enter destination"
                  value={newCardContent}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="papa"
                  placeholder="Enter date of travel"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="jai2">
                
                <button className="jai3" onClick={()=>handleAddCard()}>
                  ADD DETAILS
                </button>
              </div>
            </div>

            <div className="filteritem">
              <h2>Search Destination</h2>
              <input
                className="filmeba"
                type="text"
                placeholder="Filter cards"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          <div className="stack-of-cards">
            <div className="post"></div>
            <div className="card-container">
              {filteredCards.map((card, index) => (
                <div key={index} className="card">
                  <p className="user-info">USER: {card.user}</p>
                  <p className="user-info">TRAVELDATE: {card.date}</p>
                  <p className="lost-item">DESTINATION: {card.destination}</p>

                  <button
                    className="chat-button"
                    onClick={() => handleOpenChat(index)}
                  >
                    Chat
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveCard(index)}
                  >
                   Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showSidebar && (
          <div className="sidebar-container">
            <div className="sidebar-contenttt">
              <button onClick={handleCloseChat}>Close</button>
              <h2>Chat with {chatRoomName}</h2>
              <div className="formmm">
                <form onSubmit={handleSubmitMessage}>
                  <input
                    className="ina"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Message"
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
              <div className="messages-column">
                <h3>Messages</h3>
                <div className="chat-messages">
                  {/* Display loading indicator while messages are being fetched */}
                  {loadingMessages ? (
                    <p>Loading messages...</p>
                  ) : (
                    // Display messages if not loading
                    (messages[selectedCardIndex] || []).map(
                      (message, index) => (
                        <div key={index}>
                          <p>
                            {message.sender}: {message.text}
                          </p>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
