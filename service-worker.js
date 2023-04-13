
const DB_NAME = 'chatgpt_conversations_db';
const STORE_NAME = 'conversations';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'url' });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
      port.onMessage.addListener((message) => {
        if (message.action === 'saveConversation') {
          saveConversation(port, message.data);
        } else if (message.action === 'loadConversations') {
          loadConversations(port, message.data);
        } else if (message.action === 'deleteConversation') {
            deleteConversation(port, message.data);
        }
      });
    }
  });

  async function getStorageData(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (data) => {
        resolve(data[key]);
        });
    });
}

async function saveConversation(port, conversationData) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
  
    store.put(conversationData);
  
    transaction.oncomplete = () => {
      loadConversations(port);
    };
  }



  async function loadConversations(port, filterTag = '') {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
  
    const request = store.getAll();
    request.onsuccess = () => {
      const conversations = request.result || [];
      const filteredConversations = filterTag
        ? conversations.filter((conversation) => conversation.tags.includes(filterTag))
        : conversations;
  
      port.postMessage({ action: 'updateConversations', data: filteredConversations });
    };
  }
  

  async function deleteConversation(port, { url }) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
  
    store.delete(url);
  
    transaction.oncomplete = () => {
      loadConversations(port);
    };
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // this is here to prevent the error "Unchecked runtime.lastError: The message port closed before a response was received."
  });