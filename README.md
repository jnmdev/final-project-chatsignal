# final-project-chatsignal

### Build and run chatsignal locally
To run the project locally, go into ./final-project-chatsignal/chat-signal and run the command 
`npm run build` to make a new production build. <br/>
After the build is complete, a "build" folder will appear. Move that folder to ./final-project-chatsignal/chat-signal/public and replace the old build. <br/>
Go into the public directory and use the command
`npm start` to start the project locally. The default port is `localhost:3000`.<br/>
First time user should register and login to chatsignal. You can open up two localhosts to test out the chat functionality.

### Project structure

```
.
chat-signal
│   
│   App.js
│   index.js
│   serviceWorker.js
│   webSocket.js
│   package-lock.json
│   package.json
|
└───Documentation
│   │   AWS and React Documentation.txt
│   │   Chat Signal Chatroom mockup.png
│   
└───node-modules
│   │   ...(dependencies)
│
└───public
│   │   index.html
│   │   manifest.json
│   │
│   └───build
│       │   ...(production build)
│   
└───src
    │   index.html
    │   manifest.json
    │
    └───AWS
    │   │   fetchUserInfo.js
    │   │   HandleMessage.js
    │   │   onConnect.js
    │   │   onDisconnect.js
    │   │   patch.js
    |   |   keySharing.js
    |   |   keyExchange.js
    |   |   requestConnectionID.js
    │
    └───Login
    │   │   email.jsx
    │   │   EmailPage.jsx
    │   │   index.jsx
    │   │   login.jsx
    │   │   LoginPage.jsx
    │   │   LoginPage.scss
    │   │   register.jsx
    │   │   style.scss
    │
    └───Chatroom
    │   │   Chatbox.jsx
    │   │   ContactsCell.jsx
    │   │   ContactsSidebar.jsx
    │   │   index.jsx
    │   │   MsgInputBox.jsx
    │
    └───Encryption
        │   AES.js
        │   Df.js
```


## AWS
The following functions are AWS lambda functions that are invoked accordingly when AWS Websocket API recieve a request or message. These files will not work or have any effect locally. For more detail on how to setup Web socket and lambda functions on AWS, please refer to the Documentation directory.

  * `fetchUserInfo.js` <br />
    
  * `HandleMessage.js` <br />
    When a message is sent to the route `onMessageCopy`, this funciton will be invoked. The function will parsed the actual message, scan the database for all the connection Ids that appeared in the same table as the sender, and initiate a POST request to forward the incoming message to every clients that are connected to the socket. <br />
    
  * `onConnect.js` <br />
    When a user is connected to the socket for the first time, this function will be invoked and it will assign the newly connected user a unique connection id. This id will also be stored into a database for future message forwarding purpose. <br />

  * `onDisconnect.js` <br />
    When a user disconnect from the socket, this function will be invoked. The function will scan the appropriate database table and remove the entry that contians this disconnected user's conneciton id. <br />

  * `patch.js` <br />
    This is a helper function that has to do with AWS websocket API. This patch is needed in order to successfully POST a message to a connected client with his/her connection id.


  * `keySharing.js` <br />
    This function is used to send the generator, original key and number of connected users to all connected users. The original key is a 256 bit prime number, and the generator is 2. This function runs every time a new user connects so that they key generatioon process starts off the same for all users.
    
    
  * `keyExchange.js` <br />
    This function is used to pass the user generated public keys in a circular fashion. After generating a public key, each user sends that key along with a number that represents the number of remaining rounds of key passing. This number is decremented by this function, and then sent, along with the public key, to the user next to the calling user. In this context, the "next" user is the user whose connection ID is stored after the calling user. In the case that there is no user connection stored after the calling user, it is sent to the first stored user.
    
    
  * `requestConnectionID.js` <br />
    This function is called as soon as the user connects to the websocket. It returns to the caller the connection ID associated with their session. This connection ID is used by later functions on the client side.




## Login








## Chatroom









## Encryption
* `AES.js` <br />
    This module handles encrypting and decrypting messages. The following are components in AES encryption/decryption:
    * `ExpandKey(key)` <br /> 
        This function takes a 265 bit key and expands it into 15 128 bit round keys.
    * `AddRoundKey(stateArray,rKey)` <br />
        This function XORs the current state array to the current round key
    * `SubBytes(stateArray)` <br />
        This function preforms a substitution on each byte of the state array. The substitution is based off of the Rijndael S-box https://en.wikipedia.org/wiki/Rijndael_S-box
    * `ShiftRows(stateArray)` <br />
        This function shifts the rows of the state array to the left in a circular fashion
    * `MixColumns(stateArray)` <br />
        This function "multiplies" the state array in a special way by substituting each byte of a row and XORing it to get an element of the new state array https://en.wikipedia.org/wiki/Rijndael_MixColumns
    * `invSubBytes(stateArray)` <br />
        Inverse of SubBytes, uses the inverse to the original substitution box
    * `invShiftRows(stateArray)` <br />
        Inverse of ShiftRows. Shifts each row to the right in a circular fashion.
    * `invMixColumns(stateArray)` <br />
        Invers of MixColumns. Same type of multiplication but using different substitutions.
    AES_Encryption takes a message string and a BigInt key as arguments. The key is expanded using `ExpandKey` and the message string is split up into 16-character long groups. These groups are put into a 4x4 array, which is then encrypted by preforming the following transformations:
    * AddRoundKey
    13 of rounds:
    * SubBytes
    * ShiftRows
    * MixColumns
    then:
    * SubBytes
    * ShiftRows
    * AddRoundKey
    The resulting encrypted message piece is added to a string, and then the next group of characters is encrypted and added to the string untill the entire message has been encrypted. The resulting string is then returned
    AES_Decryption is meant to preform the inverse of all the Encryption transformations. It works the exact same way by splitting up the message, but each piece undergoes the following transformations instead:
    * AddRoundKey
    13 of rounds:
    * invShiftRows
    * invSubBytes
    * invMixColumns
    then:
    * invShiftRows
    * invSubBytes
    * AddRoundKey
* `Df.js` <br />
    This module contains a class that stores the user secret and is used to generat the secret encryption key. A Df object contains a secret, a generator (g), a base (p), a key and the number of rounds remaining before a private key is considered established. The secret is a randomly generated number between 1 and 1000. This number is never shared with anyone. The generator and base are set by the server. The key is generated on each round of key passing. The following functions are part of key generation:
    * `compute()` <br /> sets and returns the key based off of the generator, base and secret according to the formula `g^(secret) % base`
    
    * `computeSecret(gen)` <br /> sets and returns the key based off of a passed in public key used as the new generator, the base and secret according to the formula `gen^(secret) % base`
    Df key exchange is preformed by websocket.js in rounds. After the initial key generation, users pass their keys to the next user. The users then all generate new keys based off of the keys passed to them. Users continue to pass and generate new keys until every user has recieved n number of keys where n is the number of users minus 1. This key exchange is secure because the final public key is never revealed and can only bebe obtained by being part of the Df circular exchange.
    
    








## WebSocket
Web socket is in charge of communicating with the AWS Websocket API so that the user can send and recieve message in real time. The following overview will walk you through the basic workflow of how the web socket manage, parse, and store incoming data and how it send client requested messages.

`connection.onopen()` Upon connection establish, the webSocket will immediately send a request to the AWS API to get this client's conneciton id. The route is "requestConnectionIDCopy."<br />

`connection.onmessage` Upon recieving message from other clients, there are four possible cases. Note that the raw message is a string that's delimited by "+=+" characters.<br />

1. Connection ID:
    If the incoming message is of type ID, the raw message would be <br />
    `<messageType>+=+<connectionID>` <br />
    Where after recieving this connection ID, the webSocket will request a establish key action to ...?<br />

2. Text message: 
    If the incoming message is of type text message, the raw message would be <br />
    `<messageType>+=+<senderConnectionID>+=+<actualMessage>`<br />
    Where the senderConnectionID will help determine if the message is coming from other user or simply an echo of the message that this client sent. The actual message then is parsed and decryted and saved.<br />

3. Key Generation:
    if the incoming message is of type keyGen, then the raw text would be <br />
    `<messageType>+=+<senderConnectionID>+=+<prime>+=+<gen>+=+<n>`<br />
    The fields prime and gen are used to instantiate an instance of the Df class, which is used to generate the users secret key. the n field represents the number of users currently connected. After the Df class is initiated, the user calculates a public key with it sends, along with n, in a keyExchange message to the websocket
    
4. Key Exchange:
    if the incoming message is of type keyExchange, then the raw text would be <br />
    `<messageType>+=+<senderConnectionID>+=+<publickey>+=+<n>`<br />
    The field publickey is the generated public key of the user whos ID is stored before the recieving user. The recieving user uses this key to generate a new key with their Df object. The n field represents the number of remaining rounds of key exchange. if n is greater than 1, then the newly generated key, along with n, is sent in a keyExchange message to the websocket. Otherwise, the newly generated key is kept by the user for decrypting and encrypting messages.
        
`saveMsg()` The function will be called when the webSocket recieved a text message. The message will be formatted into javascript object with two properties: type and content. The type could be either external or internal. The content will be the actual message that other clients snet. <br />
Note that in current implementation these message willbe pushed into a global array in client's local memory. Thus the message history will be discarded if the user disconnect.

`fetchMsgHistory()` This function will be called by front end code, in particularly `Chatbox`, to retrieve the messages from websocket for display. This function simply return the most up-to-date message history array. <br />

`sendMsg()` This function will be called by front end code, inparticularly `MsgInputBox` to send the message to AWS API. The route will be "onMessageCopy" and the additional property will be the actual message.
