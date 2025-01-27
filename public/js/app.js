// // app.js

// $(document).ready(() => {
//     const chatTemplate = Handlebars.compile($('#chat-template').html());
//     const chatContentTemplate = Handlebars.compile($('#chat-content-template').html());
//     const chatEl = $('#chat');
//     const formEl = $('.form');
//     const messages = [];
//     let username;
  
//     const localImageEl = $('#local-image');
//     const localVideoEl = $('#local-video');
//     localVideoEl.hide();
  
//     const remoteVideoTemplate = Handlebars.compile($('#remote-video-template').html());
//     const remoteVideosEl = $('#remote-videos');
//     let remoteVideosCount = 0;
  
//     formEl.form({
//       fields: {
//         roomName: 'empty',
//         username: 'empty',
//       },
//     });
  
//     const webrtc = new SimpleWebRTC({
//       localVideoEl: 'local-video',
//       remoteVideosEl: 'remote-videos',
//       autoRequestMedia: true,
//       debug: false,
//       detectSpeakingEvents: true,
//       autoAdjustMic: false,
//     });
  
//     webrtc.on('localStream', () => {
//       localImageEl.hide();
//       localVideoEl.show();
//     });
  
//     webrtc.on('videoAdded', (video, peer) => {
//       const id = webrtc.getDomId(peer);
//       const html = remoteVideoTemplate({ id });
//       if (remoteVideosCount === 0) {
//         remoteVideosEl.html(html);
//       } else {
//         remoteVideosEl.append(html);
//       }
//       $(`#${id}`).html(video);
//       $(`#${id} video`).addClass('ui image medium');
//       remoteVideosCount += 1;
//     });
  
//     const updateChatMessages = () => {
//       const html = chatContentTemplate({ messages });
//       $('#chat-content').html(html);
//       const scrollHeight = $('#chat-content').prop('scrollHeight');
//       $('#chat-content').animate({ scrollTop: scrollHeight }, 'slow');
//     };
  
//     const postMessage = (message) => {
//       const chatMessage = {
//         username,
//         message,
//         postedOn: new Date().toLocaleString('en-GB'),
//       };
//       webrtc.sendToAll('chat', chatMessage);
//       messages.push(chatMessage);
//       $('#post-message').val('');
//       updateChatMessages();
//     };
  
//     const showChatRoom = (room) => {
//       formEl.hide();
//       const html = chatTemplate({ room });
//       chatEl.html(html);
//       $('form').form({
//         message: 'empty',
//       });
//       $('#post-btn').on('click', () => {
//         const message = $('#post-message').val();
//         postMessage(message);
//       });
//       $('#post-message').on('keyup', (event) => {
//         if (event.keyCode === 13) {
//           const message = $('#post-message').val();
//           postMessage(message);
//         }
//       });
//     };
  
//     const createRoom = (roomName) => {
//       console.log(`Creating new room: ${roomName}`);
//       webrtc.createRoom(roomName, (err, name) => {
//         if (err) {
//           console.error('Error creating room:', err);
//           // Handle error display or logging
//         } else {
//           console.log('Room created successfully:', name);
//           formEl.form('clear');
//           showChatRoom(name);
//           postMessage(`${username} created chatroom`);
//         }
//       });
//     };
  
//     const joinRoom = (roomName) => {
//       console.log(`Joining Room: ${roomName}`);
//       webrtc.joinRoom(roomName);
//       showChatRoom(roomName);
//       postMessage(`${username} joined chatroom`);
//     };
  
//     $('.submit').on('click', (event) => {
//       if (!formEl.form('is valid')) {
//         return false;
//       }
//       username = $('#username').val();
//       const roomName = $('#roomName').val().toLowerCase();
//       if (event.target.id === 'create-btn') {
//         createRoom(roomName);
//       } else {
//         joinRoom(roomName);
//       }
//       return false;
//     });
  
//     webrtc.connection.on('message', (data) => {
//       if (data.type === 'chat') {
//         const message = data.payload;
//         messages.push(message);
//         updateChatMessages();
//       }
//     });
//   });
  