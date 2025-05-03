document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chat-button");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const sendButton = document.getElementById("send-button");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  chatButton.addEventListener("click", () => {
    chatBox.classList.remove("hidden");
    chatInput.focus();
  });

  closeChat.addEventListener("click", () => {
    chatBox.classList.add("hidden");
  });

  sendButton.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    chatInput.value = "";
    appendMessage("bot", "...");

    try {
      const response = await fetch("https://i-hybrid-chatbot-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      const lastBotMsg = chatMessages.querySelector(".bot:last-child");
      if (lastBotMsg) lastBotMsg.textContent = data.response;
;
    } catch (error) {
      console.error("Error:", error);
      appendMessage("bot", "Sorry, something went wrong.");
    }
  });

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = sender;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
