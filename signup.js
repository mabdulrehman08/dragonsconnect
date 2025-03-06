// Step 1: Initialize Supabase
const SUPABASE_URL = "https://your-project.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "your-anon-public-key"; // Replace with your Supabase anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Step 2: Handle form submission
document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from refreshing

    // Step 3: Get form values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;

   
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        document.getElementById("message").textContent = "Error: " + error.message;
        return;
    }

    
    const { data, error: dbError } = await supabase
        .from("users")
        .insert([{ id: user.id, username, email, phone }]);

    if (dbError) {
        document.getElementById("message").textContent = "Database Error: " + dbError.message;
    } else {
        document.getElementById("message").textContent = "Signup successful! Redirecting...";
        setTimeout(() => window.location.href = "login.html", 2000); 
    }
});

