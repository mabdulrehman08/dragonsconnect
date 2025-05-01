// Get the add friend button
const addFriendButton = document.getElementById('add_friend_button');

// Get the add friend modal
const addFriendModal = document.getElementById('add_friend_modal');

// Get the modal content
const modalContent = document.querySelector('.modal_content');

// Get the close button
const closeButton = document.getElementById('send_friend_request');

// Get the search box
const searchBox = document.getElementById('search_box');

// Get the filter form
const filterForm = document.getElementById('filter_form');

// Add event listener to the add friend button
addFriendButton.addEventListener('click', () => {
  // Show the add friend modal
  addFriendModal.style.display = 'block';
});

// Add event listener to the close button
closeButton.addEventListener('click', () => {
  // Hide the add friend modal
  addFriendModal.style.display = 'none';
});

// Add event listener to the search box
searchBox.addEventListener('input', () => {
  // Get the search value
  const searchValue = searchBox.value.toLowerCase();

  // Get the friends list
  const friendsList = document.querySelector('.friends_list');

  // Get the friends
  const friends = friendsList.children;

  // Loop through the friends
  for (let i = 0; i < friends.length; i++) {
    // Get the friend name
    const friendName = friends[i].querySelector('h2').textContent.toLowerCase();

    // Check if the friend name includes the search value
    if (friendName.includes(searchValue)) {
      // Show the friend
      friends[i].style.display = 'block';
    } else {
      // Hide the friend
      friends[i].style.display = 'none';
    }
  }
});

// Add event listener to the filter form
filterForm.addEventListener('submit', (e) => {
  // Prevent the default form submission
  e.preventDefault();

  // Get the filter values
  const drexelClass = document.getElementById('drexel_class').value;
  const interests = document.getElementById('interests').value;
  const clubs = document.getElementById('clubs').value;

  // Get the friends list
  const friendsList = document.querySelector('.friends_list');

  // Get the friends
  const friends = friendsList.children;

  // Loop through the friends
  for (let i = 0; i < friends.length; i++) {
    // Get the friend details
    const friendDetails = friends[i].querySelector('.friend_details');

    // Check if the friend details include the filter values
    if (friendDetails.textContent.includes(drexelClass) && friendDetails.textContent.includes(interests) && friendDetails.textContent.includes(clubs)) {
      // Show the friend
      friends[i].style.display = 'block';
    } else {
      // Hide the friend
      friends[i].style.display = 'none';
    }
  }
});