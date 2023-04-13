// contentScript.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getConversationData') {
      const pageTitle = document.title;
      const conversationData = {
        url: window.location.href,
        name: pageTitle,
      };

      sendResponse(conversationData);
    }
  });
  