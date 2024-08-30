// DOM Elements
const quotesContainer = document.getElementById("quotes-container");
const quoteList = document.getElementById("quote-list");
const newQuoteForm = document.getElementById("new-quote-form");
const newQuoteInput = document.getElementById("new-quote");
const authorInput = document.getElementById("author");

const BASE_URL = "http://localhost:3000";

// Fetch quotes on page load
async function fetchQuotes() {
  try {
    const response = await fetch(`${BASE_URL}/quotes?_embed=likes`);
    const data = await response.json();

    if (data.length === 0) {
      displayEmptyState();
    } else {
      displayQuotes(data);
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
    displayErrorMessage("Failed to fetch quotes. Please try again later.");
  }
}

// Display quotes
function displayQuotes(quotes) {
  quoteList.innerHTML = ""; // Clear existing quotes

  quotes.forEach((quote) => {
    const quoteCard = document.createElement("li");
    quoteCard.classList.add("quote-card");

    const quoteBlock = document.createElement("blockquote");
    quoteBlock.classList.add("blockquote");

    const quoteText = document.createElement("p");
    quoteText.classList.add("mb-0");
    quoteText.textContent = quote.quote;

    const quoteAuthor = document.createElement("footer");
    quoteAuthor.classList.add("blockquote-footer");
    quoteAuthor.textContent = quote.author;

    const likeButton = document.createElement("button");
    likeButton.classList.add("btn", "btn-success");
    likeButton.textContent = `Likes: ${quote.likes.length}`;
    likeButton.addEventListener("click", () => likeQuote(quote.id));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteQuote(quote.id));

    quoteBlock.appendChild(quoteText);
    quoteBlock.appendChild(quoteAuthor);
    quoteBlock.appendChild(likeButton);
    quoteBlock.appendChild(deleteButton);

    quoteCard.appendChild(quoteBlock);
    quoteList.appendChild(quoteCard);
  });
}

// Display empty state message
function displayEmptyState() {
  quoteList.innerHTML = ""; // Clear existing quotes
  const emptyStateMessage = document.createElement("p");
  emptyStateMessage.textContent = "No quotes found. Add a new quote!";
  quoteList.appendChild(emptyStateMessage);
}

// Display error message
function displayErrorMessage(message) {
  quoteList.innerHTML = ""; // Clear existing quotes
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("text-danger");
  errorMessage.textContent = message;
  quoteList.appendChild(errorMessage);
}

// Add new quote
async function addQuote() {
  const quoteText = newQuoteInput.value.trim();
  const author = authorInput.value.trim();

  if (!quoteText || !author) {
    displayErrorMessage("Please enter both quote and author.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/quotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quote: quoteText, author: author }),
    });

    if (!response.ok) {
      throw new Error("Failed to add quote.");
    }

    newQuoteInput.value = "";
    authorInput.value = "";
    fetchQuotes();
  } catch (error) {
    console.error("Error adding quote:", error);
    displayErrorMessage("Failed to add quote. Please try again later.");
  }
}

// Like quote
async function likeQuote(quoteId) {
  try {
    const response = await fetch(`${BASE_URL}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quoteId: quoteId }),
    });

    if (!response.ok) {
      throw new Error("Failed to like quote.");
    }

    fetchQuotes();
  } catch (error) {
    console.error("Error liking quote:", error);
    displayErrorMessage("Failed to like quote. Please try again later.");
  }
}

// Delete quote
async function deleteQuote(quoteId) {
  try {
    const response = await fetch(`${BASE_URL}/quotes/${quoteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete quote.");
    }

    fetchQuotes();
  } catch (error) {
    console.error("Error deleting quote:", error);
    displayErrorMessage("Failed to delete quote. Please try again later.");
  }
}

// Event listeners
newQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addQuote();
});

// Initial fetch to get and display quotes
fetchQuotes();
