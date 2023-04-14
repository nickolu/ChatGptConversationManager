chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getConversationData") {
    const pageTitle = document.title;
    const conversationData = {
      url: window.location.href,
      name: pageTitle,
    };

    sendResponse(conversationData);
  } else if (message.action === "highlightConversations") {
    highlightMatchingConversations(message.data);
  }
});

async function highlightMatchingConversations() {
  const highlightConversations = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getSavedConversations' }, (response) => {
      resolve(response.data);
    });
  });

  const conversationElements = document.querySelectorAll(
    '.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative'
  );

  conversationElements.forEach((element) => {
    const conversationName = element.textContent.trim();

    highlightConversations.forEach((conversation) => {
        if (conversation.name === conversationName) {
            element.textContent = `[${conversation.tags.join(', ')}] ${element.textContent}`
            element.style.color = '#ddf';
        }
    });
  });
}