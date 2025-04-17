const SUPABASE_URL = "https://gmtnsgvgydsfdvyyywyy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdG5zZ3ZneWRzZmR2eXl5d3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM1NzQsImV4cCI6MjA1NjI4OTU3NH0.z4wQSX3Uz4e7GXR5LStRaL6dwPWgPaGi1rB0U2vZg9s";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        document.getElementById("message").textContent = "Login failed: " + error.message;
    } else {
        document.getElementById("message").textContent = "Login successful! Redirecting...";
        window.location.href = "dashboard.html"; 
    }
});
