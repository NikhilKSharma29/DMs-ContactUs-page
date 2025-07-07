document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("form");
  var errorMsg = document.getElementById("form-error");

  function showError(input, message) {
    var field = input.parentElement;
    field.classList.add("error");
    field.querySelector(".error-message").textContent = message;
  }

  function clearError(input) {
    var field = input.parentElement;
    field.classList.remove("error");
    field.querySelector(".error-message").textContent = "";
  }

  function showSuccess(message) {
    errorMsg.textContent = message;
    errorMsg.style.color = "green";
    form.reset();

    setTimeout(function () {
      errorMsg.textContent = "";
    }, 3000);
  }

  function showFormError(message) {
    errorMsg.textContent = message;
    errorMsg.style.color = "red";
  }

  // Function to update submit button state
  function setSubmitButtonState(isLoading, isSuccess = false) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector(".submit-text");
    const spinner = submitBtn.querySelector(".spinner");

    if (isLoading) {
      submitBtn.disabled = true;
      submitText.textContent = "Sending...";
      spinner.style.display = "inline-block";
    } else {
      submitBtn.disabled = false;
      submitText.textContent = isSuccess ? "Sent!" : "Send Message";
      spinner.style.display = "none";

      if (isSuccess) {
        setTimeout(() => {
          submitText.textContent = "Send Message";
        }, 3000);
      }
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var isValid = true;

    // Reset form error message
    errorMsg.textContent = "";
    errorMsg.style.display = "none";

    var firstName = document.getElementById("first-name");
    var lastName = document.getElementById("last-name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");

    [firstName, lastName, email, message].forEach(clearError);

    if (firstName.value.trim() === "") {
      showError(firstName, "First name is required");
      isValid = false;
    } else if (firstName.value.length < 2) {
      showError(firstName, "Must be at least 2 characters");
      isValid = false;
    }

    if (lastName.value.trim() === "") {
      showError(lastName, "Last name is required");
      isValid = false;
    } else if (lastName.value.length < 2) {
      showError(lastName, "Must be at least 2 characters");
      isValid = false;
    }

    if (email.value.trim() === "") {
      showError(email, "Email is required");
      isValid = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
      showError(email, "Please enter a valid email");
      isValid = false;
    }

    if (message.value.trim() === "") {
      showError(message, "Message is required");
      isValid = false;
    } else if (message.value.length < 10) {
      showError(message, "Message too short (min 10 chars)");
      isValid = false;
    }

    if (isValid) {
      // Show loading state
      setSubmitButtonState(true);

      const formData = new FormData(form);

      // Simulate network delay for demo (remove in production)
      const submitPromise = new Promise((resolve) => {
        setTimeout(() => {
          fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
          })
            .then((response) => response.json())
            .then((data) => resolve({ success: true, data }))
            .catch((error) =>
              resolve({
                success: false,
                error: error.message || "Network error occurred",
              })
            );
        }, 1000); // 1 second delay for demo
      });

      submitPromise
        .then(({ success, data, error }) => {
          if (success && data.success) {
            setSubmitButtonState(false, true);
            // Redirect to thank you page after a short delay to show success state
            setTimeout(() => {
              window.location.href = "/thankyou.html";
            }, 1500);
            return; // Exit early since we're redirecting
          } else {
            setSubmitButtonState(false);
            const errorMessage =
              data && data.message
                ? data.message
                : error || "Something went wrong. Please try again.";
            showFormError(errorMessage);
          }
          console.log("Server response:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setSubmitButtonState(false);
          showFormError("Failed to send message. Please try again.");
        });
    } else {
      showFormError("Please fix the errors below.");
    }
  });
});
