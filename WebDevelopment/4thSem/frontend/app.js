document.addEventListener("DOMContentLoaded", async function () {
  // Check if user is logged in
  if (!localStorage.getItem('userLoggedIn')) {
    window.location.href = "http://127.0.0.1:5500/frontend/login.html";
    return;
  }

  const genAI = new window.GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const submitButton = document.querySelector("#submit");
  const inputElement = document.querySelector("#input");
  const chatContainer = document.querySelector("#chat-container");
  const newChatButton = document.querySelector("#new-chat-button");
  const downloadButton = document.querySelector("#download");
  const chatHistoryContainer = document.querySelector("#chat-history");
  const deleteAllChatsButton = document.querySelector("#delete-all-chats");
  const logoutButton = document.querySelector("#logout");
  const previousChatsDialog = document.querySelector("#previous-chats-dialog");
  const previousChatsList = document.querySelector("#previous-chats-list");
  const closePreviousChatsButton = document.querySelector("#close-dialog");

  let currentChatId = null;
  let allChats = {};

  function addMessageToChat(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", role);
    messageElement.textContent = content;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function saveChatsToLocalStorage() {
    localStorage.setItem("allChats", JSON.stringify(allChats));
  }

  function loadChatsFromLocalStorage() {
    const savedChats = localStorage.getItem("allChats");
    if (savedChats) {
      allChats = JSON.parse(savedChats);
      updateChatHistorySidebar();
    }
  } 

  function updateChatHistorySidebar() {
    chatHistoryContainer.innerHTML = "";
    Object.entries(allChats).forEach(([chatId, chat]) => {
      const chatElement = document.createElement("div");
      chatElement.classList.add("chat-history-item");
      chatElement.textContent = chat.title || "Untitled Chat";
      chatElement.addEventListener("click", () => loadChat(chatId));
      chatHistoryContainer.appendChild(chatElement);
    });
  }

  function createNewChat() {
    currentChatId = Date.now().toString();
    allChats[currentChatId] = { messages: [], title: null };
    chatContainer.innerHTML = "";
    inputElement.value = "";
    saveChatsToLocalStorage();
    updateChatHistorySidebar();
  }

  function loadChat(chatId) {
    currentChatId = chatId;
    chatContainer.innerHTML = "";
    allChats[chatId].messages.forEach((message) => {
      if (message.role === 'image') {
        addImageToChat(message.content);
      } else {
        addMessageToChat(message.role, message.content);
      }
    });
  }

  async function getMessage() {
    const prompt = inputElement.value;
    if (!prompt) return;

    if (!currentChatId) createNewChat();

    addMessageToChat("user", prompt);
    allChats[currentChatId].messages.push({ role: "user", content: prompt });

    if (!allChats[currentChatId].title) {
      allChats[currentChatId].title = prompt;
      updateChatHistorySidebar();
    }

    inputElement.value = "";

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      addMessageToChat("ai", text);
      allChats[currentChatId].messages.push({ role: "ai", content: text });

      saveChatsToLocalStorage();
    } catch (error) {
      console.error("Detailed error:", error);
      addMessageToChat("error", "An error occurred: " + error.message);
    }
  }

  function deleteAllChats() {
    if (confirm("Are you sure you want to delete all chats? This action cannot be undone.")) {
      allChats = {};
      chatHistoryContainer.innerHTML = '';
      chatContainer.innerHTML = '';
      currentChatId = null;
      saveChatsToLocalStorage();
      addMessageToChat('system', 'All chats have been deleted.');
    }
  }

  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('userLoggedIn');
      window.location.href = "http://127.0.0.1:5500/frontend/login.html";
    }
  }

  function addImageToChat(imageUrl) {
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.alt = "Uploaded image";
    imageElement.style.maxWidth = "100%";
    chatContainer.appendChild(imageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function setupEventListeners() {
    submitButton.addEventListener("click", getMessage);
    inputElement.addEventListener("keypress", function (e) {
      if (e.key === "Enter") getMessage();
    });
    newChatButton.addEventListener('click', createNewChat);
    deleteAllChatsButton.addEventListener('click', deleteAllChats);
    downloadButton.addEventListener("click", function () {
      const element = document.getElementById("chat-container");
      const formattedDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      const options = {
        margin: 10,
        filename: "ChatExport_" + formattedDate + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(element).set(options).save();
    });   
    logoutButton.addEventListener("click", logout);
    closePreviousChatsButton.addEventListener('click', () => previousChatsDialog.close());
  }

  setupEventListeners();
  loadChatsFromLocalStorage();
});