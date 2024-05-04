const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const chatCloseBtn = document.querySelector(".close-btn");

let userMessage;
let fileContents;
const API_KEY = "sk-proj-mjj32rJzR92plUf5TsWzT3BlbkFJLh4M3Nut1qZKTpLTU4kf";
const inputInitHeight = chatInput.scrollHeight;

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }

    //Sends POST request to OpenAI API
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        // console.log(data);
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch((error) => {
        // console.log(error);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please Try Again!";
    }).finally(() =>  chatbox.scrollTo(0, chatbox.scrollHeight));
}


//Creates a chat <Li> with message and classname
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const sendUserMessage = () => {
    if(!userMessage) return; //Return if chat input empty
    
    //After User Inputs it Clear the Textfield
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //Outputs the User's Message to Chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

const handleChat = () => {
    let file = document.getElementById('fileInput').files[0]; // Get the selected file
    if (file) { // Check if a file is selected
        const reader = new FileReader();

        reader.onload = function(event) {
            userMessage = event.target.result; // Set userMessage to the contents of the file
            userMessage += "\nuse the above data to answer the question\n";
            userMessage += chatInput.value.trim();
            sendUserMessage();
        };

        reader.readAsText(file); // Read the contents of the file as text
    } else {
        userMessage = chatInput.value.trim(); // If no file is selected, use the input from the textarea
        sendUserMessage();
    }
    // userMessage = chatInput.value.trim();
    // if(!userMessage) return; //Return if chat input empty
    
    // //After User Inputs it Clear the Textfield
    // chatInput.value = "";
    // chatInput.style.height = `${inputInitHeight}px`;

    // //Outputs the User's Message to Chatbox
    // //userMessage = "what is 5 squared?\n\n" + userMessage
    // chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    // chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // setTimeout(() => {
    //     const incomingChatLi = createChatLi("Thinking...", "incoming");
    //     chatbox.appendChild(incomingChatLi);
    //     chatbox.scrollTo(0, chatbox.scrollHeight);
    //     generateResponse(incomingChatLi);
    // }, 600);
}


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
