document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat-button");
    const chatBox = document.getElementById("chat-box");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-button");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const crawlUrlInputInChat = document.getElementById("crawlUrlInputInChat");
    const fileInputInChat = document.getElementById("fileInputInChat");
    const uploadBtnInChat = document.getElementById("uploadBtnInChat");
    const uploadStatusInChat = document.getElementById("uploadStatusInChat");

    let documentsUploaded = false;  // ✅ Track if docs are uploaded

    // Open chat box
    chatButton.addEventListener("click", () => {
        chatBox.classList.remove("hidden");
        chatInput.focus();
    });

    // Close chat box
    closeChat.addEventListener("click", () => {
        chatBox.classList.add("hidden");
    });

    // ✅ Send chat message
    sendButton.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        const crawlUrl = crawlUrlInputInChat.value.trim();
        if (!message) return;

        appendMessage("user", message);
        chatInput.value = "";
        appendMessage("bot", "...");

        try {
            let endpoint;
            let body;

            if (crawlUrl) {
                // ✅ Crawl mode
                endpoint = "https://i-hybrid-chatbot-backend.onrender.com/crawl-and-chat";
                body = JSON.stringify({ url: crawlUrl, message: message });
            } else if (documentsUploaded) {
                // ✅ Query uploaded documents
                endpoint = "https://i-hybrid-chatbot-backend.onrender.com/query-documents";
                body = JSON.stringify({ question: message });
            } else {
                // ✅ General chat
                endpoint = "https://i-hybrid-chatbot-backend.onrender.com/chat";
                body = JSON.stringify({ message: message });
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body
            });

            const data = await response.json();
            const lastBotMsg = chatMessages.querySelector(".bot:last-child");
            if (lastBotMsg) lastBotMsg.textContent = data.response || data.error || "No response.";
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

    // ✅ Upload Document inside chat widget
    uploadBtnInChat.addEventListener("click", () => {
        if (!fileInputInChat.files.length) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInputInChat.files[0]);

        uploadStatusInChat.textContent = "Uploading...";

        fetch('https://i-hybrid-chatbot-backend.onrender.com/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            uploadStatusInChat.textContent = data.status || data.error;
            if (data.status) {
                documentsUploaded = true;  // ✅ Mark as uploaded
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            uploadStatusInChat.textContent = 'Upload failed.';
        });
    });
});
