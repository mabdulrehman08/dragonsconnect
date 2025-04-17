// Step 1: Initialize Supabase
const SUPABASE_URL = "https://ifamfjeazbkrnmqbxsux.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYW1mamVhemJrcm5tcWJ4c3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzU4NzYsImV4cCI6MjA1NTY1MTg3Nn0.pxme26fjpYTuH0yFUhFzf9o50n_5q7KfzgCD_8vwu_Q"; // Replace with your Supabase anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Step 2: Handle form submission
document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from refreshing

    // Step 3: Get form values
    const { createClient } = supabase;
        const supabaseUrl = "https://ifamfjeazbkrnmqbxsux.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYW1mamVhemJrcm5tcWJ4c3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzU4NzYsImV4cCI6MjA1NTY1MTg3Nn0.pxme26fjpYTuH0yFUhFzf9o50n_5q7KfzgCD_8vwu_Q"; // Hide this in a backend
        const supabaseClient = createClient(supabaseUrl, supabaseKey);

        async function signUp(event) {
            event.preventDefault();
            document.getElementById("signup-btn").innerText = "Signing up...";
            document.getElementById("signup-btn").disabled = true;

            const first = document.getElementById("first-name").value;
            const last = document.getElementById("last-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            // Validate password match
            if (password !== confirmPassword) {
                document.getElementById("message").innerText = "Passwords do not match!";
                resetButton();
                return;
            }

            try {
              let { data, error } = await supabaseClient.auth.signUp({ email, password });

              if (error) {
                  throw new Error(error.message);
              }
              
              if (!data.user) {
                  throw new Error("User not created. Please verify your email.");
              }

              // Extract user ID
              const userId = data.user?.id || data.user?.user_metadata?.sub;

              // Insert profile into database
              const { error: dbError } = await supabaseClient.from("profiles").insert([
                  { id: userId, first_name: first, last_name: last, email: email }
              ]);

              if (dbError) {
                  console.error("Database error:", dbError);
                  throw new Error(`Signup successful, but failed to save profile: ${dbError.message}`);
              }

              document.getElementById("message").innerText = "Sign-up successful! Check your email for confirmation.";
          } 
          catch (err) {
              document.getElementById("message").innerText = err.message;
          } finally {
              resetButton();
          }

        function resetButton() {
            document.getElementById("signup-btn").innerText = "Sign Up";
            document.getElementById("signup-btn").disabled = false;
        }
        }
});

