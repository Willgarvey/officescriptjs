// Import the required classes and data objects
import Search from 'search.js';
import scriptLines from './scriptLines.js';
import processedLines from './processedLines.js';

// Event listener function for the search button
document.getElementById('searchButton').addEventListener('click', async function () {
  // Retrieve the search text and selected character from the form
  let searchText = document.getElementById('searchInput').value;
  let selectedCharacter = document.getElementById('searchOption').value;

  // Create an instance of the Search class
  let search = new Search();

  // return the results of the search as an ordered list of indexes
  let result = search.searchScript(searchText, processedLines, selectedCharacter);

  // Handle if the result is "Invalid" (not using unique words)
  if (result === 'Invalid') {
    // Perform the necessary actions to display the result on the page (e.g., show a message)
    showInvalidResult(); // TODO: Impliment this function
    return;
  }

  // If there is a valid result
  if (result !== '' && selectedCharacter !== null) {
    const lines = new ScriptCollection();

    // TODO: Look in HomeController.cs and Search.js / Search.cs for references
    let unsortedFinalResults = search.getMatchingLines(result, scriptLines); // TODO: create method
    let sortedFinalResults = SortByRelevance(result, unsortedFinalResults); //TODO: create method
    // Post the final results to the main list
    displayResults(sortedFinalResults);
    // Start to retreive the context lines as another variable
    let resultWithContextLines = search.AddContextLines(lines); // Create result with all context indexes
    let contextLines = new ScriptCollection();
    contextLines = search.getMatingLines(resultWithContextLines, lines);

  } else {
    console.log("Bad results was not handled correctly.");
    return
  }
});

// Function to display the results on the page (replace with actual implementation)
function displayResults(sortedFinalResults) { //TODO: Fix this to work
  console.log(sortedFinalResults);
}

export default submitForm;