const { createClient } = supabase;
const supabaseUrl = "https://gmtnsgvgydsfdvyyywyy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdG5zZ3ZneWRzZmR2eXl5d3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM1NzQsImV4cCI6MjA1NjI4OTU3NH0.z4wQSX3Uz4e7GXR5LStRaL6dwPWgPaGi1rB0U2vZg9s";
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to Sign Up a New User and Store in SQL
async function signUp() {
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const drexelEmail = document.getElementById("drexel_email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const phoneNumber = document.getElementById("phone_number").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById("message").textContent = "Passwords do not match!";
        return;
    }

    // Sign up the user with Supabase authentication
    const { user, error } = await supabase.auth.signUp({
        email: drexelEmail,
        password: password,
    });

    // Check if there is an error during sign-up
    if (error) {
        document.getElementById("message").textContent = "Error: " + error.message;
        return;
    }

    // Insert user details into the "users" table in the database
    const { data, insertError } = await supabase
        .from("users")
        .insert([
            {
                first_name: firstName,
                last_name: lastName,
                drexel_email: drexelEmail,
                password: password, 
                phone_number: phoneNumber,
 


