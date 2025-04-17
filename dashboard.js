// Get the modal element
const modal = document.getElementById('add_friend_modal');

// Get the modal content element
const modalContent = modal.querySelector('.modal_content');

// Get the add friend form element
const addFriendForm = modalContent.querySelector('#add_friend_form');

// Get the friend name input element
const friendNameInput = addFriendForm.querySelector('#friend_name');

// Get the friend email input element
const friendEmailInput = addFriendForm.querySelector('#friend_email');

// Get the send friend request button element
const sendFriendRequestButton = addFriendForm.querySelector('#send_friend_request');

// Get the friends list element
const friendsList = document.querySelector('.friends_list');

// Add an event listener to the add friend button
document.getElementById('add_friend_button').addEventListener('click', () => {
  // Show the modal
  modal.style.display = 'block';
});

// Add an event listener to the send friend request button
sendFriendRequestButton.addEventListener('click', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the friend name and email values
  const friendName = friendNameInput.value.trim();
  const friendEmail = friendEmailInput.value.trim();

  // Create a new friend object
  const newFriend = {
    name: friendName,
    email: friendEmail,
  };

  // Add the new friend to the friends list
  const newFriendHTML = `
    <div class="friend">
      <img src="images/friend.jpg" alt="Friend">
      <span class="friend_name">${newFriend.name}</span>
      <span class="friend_email">${newFriend.email}</span>
    </div>
  `;
  friendsList.insertAdjacentHTML('beforeend', newFriendHTML);

  // Clear the input fields
  friendNameInput.value = '';
  friendEmailInput.value = '';

  // Hide the modal
  modal.style.display = 'none';
});

// Add an event listener to the modal to close it when clicked outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});