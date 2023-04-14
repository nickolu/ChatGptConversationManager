# ChatGPT Conversation Manager

- save and tag your converstaions
- filter conversations by tag
- add tags to the conversations sidebar

This extension does not make any external API calls or collect any user data. It uses the browser's indexedDb API to save your conversations, which is a a client-side, web-based database storage system that allows developers to store and manage complex data structures within a user's browser. Clearing your browser cache/history will not delete your data, however if you uninstall chrome you will lose your data. We'll add a way to back up your saved conversations and tags in the future. 


## How to Install

*This chrome extension is pending review, but in the mean time you can add it to chrome using developer mode:*

1. download or clone this project
2. Visit the Chrome Extensions page in your browser.  (chrome://extensions)
3. Enable the "Developer mode" toggle switch located at the top-right corner of the page.
4. Click on the "Load unpacked" button located at the top-left corner of the page.
5. Select the folder where these files are located

Once the installation is complete, you should see the plugin added to the Chrome Extensions list with a message confirming the successful installation.


## How to save conversations

To save a conversation you have to visit the conversation in the browser first by clicking it in the sidebar. You can't save from the "new chat" view because AFAIK there's no way to retrieve the conversation ID from that view. 


## Displaying Tags in the UI

To make it possible to see which conversations you've already saved, there is a button in the extension popup that says "Insert Tags in the UI" which will add the tags and change the text color of items in the sidebar you have already tagged. This is limited to changing only elements that are already in the UI when you click the button. Also when you visit another conversation, the UI gets entirely rerendered so the tags will go away. I'm open to feedback on how to make this better. 


## Next updates

Things I plan to add next unless I get a lot of feedback suggesting otherwise:

- Filter conversations by name
- Sort conversations by tag
- Sort conversations by name
- Sort conversations by date saved
- A user setting you can toggle which allows you to "insert tags" every time you open the extension (so you don't have to click the button)


## Contributions/Open source

My only goal in making this project was to allow myself to save and tag my conversations, for my own personal benefit. Feel free to contribute, fork, modify, or do whatever you want with this extension. I highly doubt this will be useful beyond six months from now, hopefully OpenAI will just make a good UI so this isn't needed. 

Feel free to submit issues or pull requests. 