document.getElementById('save-form').addEventListener('submit', saveConversation);


const backgroundPort = chrome.runtime.connect({ name: 'popup' });
const tagFilter = document.getElementById('tag-filter');
tagFilter.addEventListener('input', () => {
  const filterTag = tagFilter.value.trim();
  backgroundPort.postMessage({ action: 'loadConversations', data:filterTag });
});

async function saveConversation(event) {
  event.preventDefault();
  try {
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(currentTab.id, { action: 'getConversationData' }, (result) => {
      if (result) {
        const conversationData = result;
        if (conversationData) {
          if (!conversationData?.url?.startsWith('https://chat.openai.com/c/') && !conversationData?.url?.startsWith('https://chat.openai.com/chat/')) {
            alert("Please navigate to a previous conversation in the OpenAI chat app before saving it.");

            return;
          }

          const tags = document.getElementById('tag-input').value.split(',').map(tag => tag.trim());
          conversationData.tags = tags;

          backgroundPort.postMessage({ action: 'saveConversation', data: conversationData });
          document.getElementById('tag-input').value = '';
        }
      }
    });
  } catch (error) {
    console.error('Error while querying the current tab:', error);
  }
}


backgroundPort.onMessage.addListener((message) => {
  if (message.action === 'updateConversations') {
    const conversationsList = document.getElementById('conversations-list');
    conversationsList.innerHTML = '';

    message.data.forEach(conversation => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      const tags = document.createElement('span');
      link.href = conversation.url;
      link.textContent = conversation.name;
      link.target = '_blank';

      listItem.appendChild(link);
      tags.textContent = ' [' + conversation.tags.join(', ') + ']';
      listItem.appendChild(tags);
      conversationsList.appendChild(listItem);
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-conversation');
      deleteButton.dataset.url = conversation.url;
      deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        backgroundPort.postMessage({ action: 'deleteConversation', data: { url: conversation.url } });
      });
      listItem.appendChild(deleteButton);
    });
  }
});



backgroundPort.postMessage({ action: 'loadConversations' });

