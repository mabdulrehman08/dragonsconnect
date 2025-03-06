const supabase = supabase.createClient("https://gmtnsgvgydsfdvyyywyy.supabase.co ", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdG5zZ3ZneWRzZmR2eXl5d3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM1NzQsImV4cCI6MjA1NjI4OTU3NH0.z4wQSX3Uz4e7GXR5LStRaL6dwPWgP');

async function fetchUser() {
    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("user-info").textContent = `Logged in as: ${user.email}`;
    }
}

document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html"; 
});

fetchUser();
