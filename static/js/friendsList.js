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
      <img src="../static/images/joe.jpg" alt="Friend">
      <span class="friend_name">${friend.name}</span>
      <span class="friend_email">${friend.email}</span>
      <button class="remove_friend_button">Remove Friend</button>
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
      <img src="../static/images/jess.jpg" alt="Friend">
      <span class="friend_name">${newFriend.name}</span>
      <span class="friend_email">${newFriend.email}</span>
      <button class="remove_friend_button">Remove Friend</button>
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

// Add an event listener to each remove friend button
friendsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove_friend_button')) {
    // Get the parent element of the button (the friend element)
    const friendElement = e.target.parentElement;
    // Remove the friend element from the friends list
    friendsList.removeChild(friendElement);
  }
});

// Get the filter form and buttons
const filterForm = document.getElementById('filter_form');
const applyFiltersButton = document.getElementById('apply_filters');
const clearFiltersButton = document.getElementById('clear_filters');

// Get the friends list container
const friendsListContainer = document.querySelector('.friends_list');

// Define the filtering logic
function applyFilters() {
  const drexelClass = document.getElementById('drexel_class').value;
  const interests = Array.from(document.getElementById('interests').selectedOptions).map(option => option.value);
  const clubs = Array.from(document.getElementById('clubs').selectedOptions).map(option => option.value);

  // Filter the friends list based on the selected filters
  const filteredFriends = friendsList.filter(friend => {
    // Filter by Drexel graduating class
    if (drexelClass && friend.drexelClass !== drexelClass) return false;

    // Filter by interests
    if (interests.length > 0 && !interests.some(interest => friend.interests.includes(interest))) return false;

    // Filter by clubs
    if (clubs.length > 0 && !clubs.some(club => friend.clubs.includes(club))) return false;

    return true;
  });

  // Update the friends list container with the filtered friends
  friendsListContainer.innerHTML = '';
  filteredFriends.forEach(friend => {
    const friendHTML = `
      <div>
        <h2>${friend.name}</h2>
        <p>Drexel Class: ${friend.drexelClass}</p>
        <p>Interests: ${friend.interests.join(', ')}</p>
        <p>Clubs: ${friend.clubs.join(', ')}</p>
      </div>
    `;
    friendsListContainer.insertAdjacentHTML('beforeend', friendHTML);
  });
}

// Define the clear filters logic
function clearFilters() {
  // Reset the filter form
  filterForm.reset();
}
  // Update the friends list container with the original friends list
friendsListContainer.innerHTML = '';
friendsList.forEach(friend => {
  const friendHTML = `
    <div>
      <h2>${friend.name}</h2>
      <p>Drexel Class: ${friend.drexelClass}</p>
      <p>Interests: ${friend.interests.join(', ')}</p>
      <p>Clubs: ${friend.clubs.join(', ')}</p>
    </div>
  `;
  friendsListContainer.insertAdjacentHTML('beforeend', friendHTML);
});