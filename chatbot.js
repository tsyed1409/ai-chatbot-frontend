document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat-button");
    const chatBox = document.getElementById("chat-box");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-button");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const crawlUrlInputInChat = document.getElementById("crawlUrlInputInChat");
    let documentsUploaded = false;  // ✅ Track if docs are uploaded

    chatButton.addEventListener("click", () => {
        chatBox.classList.remove("hidden");
        chatInput.focus();
    });

    closeChat.addEventListener("click", () => {
        chatBox.classList.add("hidden");
    });

    // ✅ Send Button Logic (updated)
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
                // ✅ Crawl mode: send to /crawl-and-chat
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
            if (lastBotMsg) lastBotMsg.textContent = data.response;
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

    // ✅ Website Chat (no changes)
    document.getElementById("urlSubmit").addEventListener("click", async () => {
        const url = document.getElementById("urlInput").value.trim();
        const question = document.getElementById("urlQuestionInput").value.trim();
        const urlResponse = document.getElementById("urlResponse");

        if (!url || !question) {
            urlResponse.innerText = "Please enter both a URL and a question.";
            return;
        }

        urlResponse.innerText = "Thinking...";

        try {
            const response = await fetch("https://i-hybrid-chatbot-backend.onrender.com/chat-with-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, message: question }),
            });

            const data = await response.json();
            urlResponse.innerText = data.response || data.error || "No response.";
        } catch (error) {
            console.error("Error:", error);
            urlResponse.innerText = "An error occurred while contacting the server.";
        }
    });

    // ✅ Upload Document (sets documentsUploaded = true)
    document.getElementById('uploadBtn').addEventListener('click', function () {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput.files.length) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        fetch('https://i-hybrid-chatbot-backend.onrender.com/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('uploadStatus').innerText = data.status || data.error;
            if (data.status) {
                documentsUploaded = true;  // ✅ Set flag when upload is successful
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            document.getElementById('uploadStatus').innerText = 'Upload failed.';
        });
    });
});
