// Get the add friend button
const addFriendButton = document.getElementById('add_friend_button');

// Get the add friend modal
const addFriendModal = document.getElementById('add_friend_modal');

// Get the modal content
const modalContent = document.querySelector('.modal_content');

// Get the friend name input
const friendNameInput = document.getElementById('friend_name');

// Get the friend email input
const friendEmailInput = document.getElementById('friend_email');

// Add event listener to the add friend button
addFriendButton.addEventListener('click', () => {
  // Show the add friend modal
  addFriendModal.style.display = 'block';
});

// Add event listener to the modal content
modalContent.addEventListener('submit', (e) => {
  // Prevent the default form submission
  e.preventDefault();

  // Get the friend name and email
  const friendName = friendNameInput.value;
  const friendEmail = friendEmailInput.value;

  // Create a new friend element
  const newFriend = document.createElement('div');
  newFriend.classList.add('friend');

  // Create a new friend name element
  const newFriendName = document.createElement('h2');
  newFriendName.textContent = friendName;

  // Create a new friend email element
  const newFriendEmail = document.createElement('p');
  newFriendEmail.textContent = friendEmail;

  // Add the friend name and email to the new friend element
  newFriend.appendChild(newFriendName);
  newFriend.appendChild(newFriendEmail);

  // Get the friends list
  const friendsList = document.querySelector('.friends_list');

  // Add the new friend to the friends list
  friendsList.appendChild(newFriend);

  // Hide the add friend modal
  addFriendModal.style.display = 'none';

  // Clear the friend name and email inputs
  friendNameInput.value = '';
  friendEmailInput.value = '';
});