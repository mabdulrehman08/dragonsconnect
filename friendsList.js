// friendsList.js

// Sample friends data
const friends = [
    { name: 'Joe Smchoe', email: 'joe.smchoe@drexel.edu' },
    { name: 'MJ Parker', email: 'mj.parker@drexel.edu' },
    { name: 'Jess Ica', email: 'jess.ica@drexel.edu' },
  ];
  
  // Populate friends list
  const friendsList = document.querySelector('.friends_list');
  friends.forEach((friend) => {
    const friendHTML = `
      <div class="friend">
        <img src="images/friend.jpg" alt="Friend">
        <span class="friend_name">${friend.name}</span>
        <span class="friend_email">${friend.email}</span>
      </div>
    `;
    friendsList.insertAdjacentHTML('beforeend', friendHTML);
  });
  
  // Add event listener to "Add Friend" button
  const addFriendButton = document.querySelector('#add_friend_button');
  addFriendButton.addEventListener('click', () => {
    const addFriendModal = document.querySelector('#add_friend_modal');
    addFriendModal.style.display = 'block';
  });
  
  // Add event listener to "Send Friend Request" button
  const sendFriendRequestButton = document.querySelector('#send_friend_request');
  sendFriendRequestButton.addEventListener('click', () => {
    const friendNameInput = document.querySelector('#friend_name');
    const friendEmailInput = document.querySelector('#friend_email');
    const friendName = friendNameInput.value.trim();
    const friendEmail = friendEmailInput.value.trim();
  
    // Create a new friend object
    const newFriend = { name: friendName, email: friendEmail };
  
    // Add new friend to friends list
    const newFriendHTML = `
      <div class="friend">
        <img src="images/friend.jpg" alt="Friend">
        <span class="friend_name">${newFriend.name}</span>
        <span class="friend_email">${newFriend.email}</span>
      </div>
    `;
    friendsList.insertAdjacentHTML('beforeend', newFriendHTML);
  
    // Clear input fields
    friendNameInput.value = '';
    friendEmailInput.value = '';
  
    // Close add friend modal
    const addFriendModal = document.querySelector('#add_friend_modal');
    addFriendModal.style.display = 'none';
  });

  // Get the friends list element
const friendsList = document.querySelector('.friends_list');

// Add an event listener to each remove friend button
document.querySelectorAll('.remove_friend_button').forEach(button => {
  button.addEventListener('click', () => {
    // Get the parent element of the button (the friend element)
    const friendElement = button.parentElement;
    // Remove the friend element from the friends list
    friendsList.removeChild(friendElement);
  });
});