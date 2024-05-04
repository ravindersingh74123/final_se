
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LogoutButton from "../../components/sidebar/LogoutButton";
import { io } from "socket.io-client";

const App = () => {
  const [newCardContent, setNewCardContent] = useState("");
  const [cards, setCards] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [messages, setMessages] = useState({});
  const userData = JSON.parse(localStorage.getItem("chat-user"));
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatRoomName, setChatRoomName] = useState("");
  const [image, setImage] = useState(null);
  const [price, setprice] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    axios
      .get("/api/resell")
      .then((response) => {
        setCards(response.data.todos || []);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  
    const socket = io("https://final-se.onrender.com", {
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
      socket.off("resell-previous-messages");
      socket.off("resell-receive-message");
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
    socket.on("resell-previous-messages", handlePreviousMessages);
  
    // Cleanup function to remove the event listener when component unmounts or when the socket changes
    return () => {
      socket.off("resell-previous-messages", handlePreviousMessages);
    };
  }, [socket, selectedCardIndex, messages]); // Ensure dependencies are updated properly
  
  // Effect for handling receive-message
  useEffect(() => {
    if (!socket) return; // Ensure socket is initialized
  
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
      if (data.room !== undefined) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.room]: [...(prevMessages[data.room] || []), data],
        }));
      }
    };
  
    // Add the event listener
    socket.on("resell-receive-message", handleReceiveMessage);
  
    // Cleanup function to remove the event listener when component unmounts or when the socket changes
    return () => {
      socket.off("resell-receive-message", handleReceiveMessage);
    };
  }, [socket, messages]); // Ensure dependencies are updated properly
  

  const handleInputChange = (event) => {
    setNewCardContent(event.target.value);
  };
  const handlePriceChange = (event) => {
    setprice(event.target.value);
  };

  const handleAddCard = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", newCardContent);
    formData.append("name", userData.fullName);
    formData.append("price", price);

    try {
      const response = await axios.post("/api/server1/resell", formData);
      alert("Todo added");
      setCards((prevCards) => [...prevCards, response.data]);
      setNewCardContent("");
      setImage(null);
      setprice("");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleOpenChat = (index) => {
    setSelectedCardIndex(index);
    setChatRoomName(cards[index].name);
    setShowSidebar(true);
    if (socket) {
      socket.emit("resell-join-room", index);
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
      socket.emit("resell-message", {
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
      console.log(cards[index])
      // Check if the username of the card matches the current username
      if (card.name === userData.fullName) {
        // If the usernames match, proceed with deletion
        await axios.delete(`/api/server1/resell/${index}`);
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
        typeof card.title === "string" &&
        typeof card.name === "string" &&
        typeof card.price === "string"
      ) {
        return (
          card.title.toLowerCase().includes(filterText.toLowerCase()) ||
          card.name.toLowerCase().includes(filterText.toLowerCase()) ||
          card.price.toLowerCase().includes(filterText.toLowerCase())
        );
      }
      return false;
    });
  }, [cards, filterText]);

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <div className="new-ui">
      <div className="topbar">

<div className="top-barservers">
  <a href="/">TUEXCHANGE</a>
</div >

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
            <h2>Post Your Items</h2>
            <div className="addlost">
              <div>
                <input
                  type="text"
                  className="papa"
                  placeholder="Enter details"
                  value={newCardContent}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="papa"
                  placeholder="Enter price"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
              <div className="jai">
                <form className="photo">
                  <label htmlFor="file-upload" className="custom-file-input">
                     PHOTO
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={onInputChange}
                    className="hidden-input"
                  />
                  <button className="pho" onClick={handleAddCard}>ADD ITEM</button>
                </form>
                
              </div>
            </div>

            <div className="filteritem">
              <h2>Find Items</h2>
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
                  {card.image && (
                    <img
                      src={`https://final-se.onrender.com/images/${card.image}`}
                      alt={`Image ${index}`}
                      height={150}
                      width={200}
                    />
                  )}
                  <p className="user-info">USER: {card.name}</p>

                  <p className="lost-item">ITEM: {card.title}</p>
                  <p className="user-info">PRICE: {card.price}</p>
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
                  <form  onSubmit={handleSubmitMessage}>
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
                    (messages[selectedCardIndex] || []).map((message, index) => (
                      <div key={index}>
                        <p>
                          {message.sender}: {message.text}
                        </p>
                      </div>
                    ))
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

