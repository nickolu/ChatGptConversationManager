document
  .getElementById("save-form")
  .addEventListener("submit", saveConversation);
document
  .getElementById("highlight-conversations")
  .addEventListener("click", highlightConversations);

const backgroundPort = chrome.runtime.connect({ name: "popup" });
const tagFilter = document.getElementById("tag-filter");
tagFilter.addEventListener("input", handleTagFilterInput);

backgroundPort.onMessage.addListener(handleMessage);
backgroundPort.postMessage({ action: "loadConversations" });

async function saveConversation(event) {
  event.preventDefault();
  try {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    processCurrentTab(currentTab);
  } catch (error) {
    console.error("Error while querying the current tab:", error);
  }
}

function handleTagFilterInput() {
  const filterTag = tagFilter.value.trim();
  backgroundPort.postMessage({ action: "loadConversations", data: filterTag });
}

function processCurrentTab(currentTab) {
  chrome.tabs.sendMessage(
    currentTab.id,
    { action: "getConversationData" },
    processConversationData
  );
}

function processConversationData(result) {
  if (result) {
    const conversationData = result;
    if (conversationData) {
      if (isInvalidConversationURL(conversationData)) {
        alert(
          "Please navigate to a previous conversation in the OpenAI chat app before saving it."
        );
        return;
      }

      const tags = document
        .getElementById("tag-input")
        .value.split(",")
        .map((tag) => tag.trim());
      conversationData.tags = tags;

      backgroundPort.postMessage({
        action: "saveConversation",
        data: conversationData,
      });
      document.getElementById("tag-input").value = "";
    }
  }
}

function isInvalidConversationURL(conversationData) {
  return (
    !conversationData?.url?.startsWith("https://chat.openai.com/c/") &&
    !conversationData?.url?.startsWith("https://chat.openai.com/chat/")
  );
}

function handleMessage(message) {
  if (message.action === "updateConversations") {
    updateConversationsList(message.data);
  }
}

function highlightConversations(tags) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'highlightConversations',
    });
  });
}

function updateConversationsList(conversations) {
  const conversationsList = document.getElementById("conversations-list");
  conversationsList.innerHTML = "";

  conversations.forEach((conversation) => {
    const listItem = createConversationListItem(conversation);
    conversationsList.appendChild(listItem);
  });
}

function createConversationListItem(conversation) {
  const listItem = document.createElement("li");
  const link = createConversationLink(conversation);
  const tags = createConversationTags(conversation);
  const deleteButton = createDeleteConversationButton(conversation);

  listItem.appendChild(link);
  listItem.appendChild(tags);
  listItem.appendChild(deleteButton);

  return listItem;
}

function createConversationLink(conversation) {
  const link = document.createElement("a");
  link.href = conversation.url;
  link.textContent = conversation.name;
  link.target = "_blank";

  return link;
}

function createConversationTags(conversation) {
  const tags = document.createElement("span");
  tags.textContent = " [" + conversation.tags.join(", ") + "]";

  return tags;
}

function createDeleteConversationButton(conversation) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "x";
  deleteButton.classList.add("delete-conversation");
  deleteButton.dataset.url = conversation.url;
  deleteButton.addEventListener("click", handleDeleteButtonClick);

  return deleteButton;
}

function handleDeleteButtonClick(event) {
  event.preventDefault();
  const conversationUrl = event.target.dataset.url;
  backgroundPort.postMessage({
    action: "deleteConversation",
    data: { url: conversationUrl },
  });
}
