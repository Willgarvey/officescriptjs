// Start Javascript Here - Look into minification for the JSON Data
// Loads the model JSON data into a usable JSON object
var resultsJson = resultsJson;
var lines = resultsJson.lines;
// Loads the model JSON data into a usable JSON object
var contextJson = contextJson;
var contextLines = contextJson.contextLines;
document.addEventListener('DOMContentLoaded', function () {
    var lines = resultsJson; // json lines from results
    var contextLines = contextJson; // json lines from context lines 
    // console.log(lines);
    // Select elements on the page
    var searchInput = document.getElementById('searchInput'); // Search area
    var dropdown = document.getElementById('dropdown');
    var initialText = searchInput.dataset.text;
    var initialOption = dropdown.dataset.selectedOption;
    var resultList = document.querySelector('.result-list'); // List of results
    var sidebarTitle = document.getElementById('selected-title');
    var sidebarCharacter = document.getElementById('selected-character'); // Sidebar details
    var sidebarEpisode = document.getElementById('selected-episode');
    var sidebarSeason = document.getElementById('selected-season');
    var sidebarScene = document.getElementById('selected-scene');
    var sidebarDiskNumber = document.getElementById('selected-disk-number');
    var sidebarDeleted = document.getElementById('selected-deleted');
    var previousSpeakerElement = document.getElementById('previous-speaker'); // Context lines area
    var previousLineElement = document.getElementById('previous-line');
    var currentLineIDElement = document.getElementById('current-id');
    var currentSpeakerElement = document.getElementById('current-speaker');
    var currentLineElement = document.getElementById('current-line');
    var nextSpeakerElement = document.getElementById('next-speaker');
    var nextLineElement = document.getElementById('next-line');
    var lowerButtonUp = document.getElementById('lower-button-up');
    var lowerButtonDown = document.getElementById('lower-button-down');
    // Set intial values on the page
    searchInput.value = initialText;
    dropdown.value = initialOption;
    searchButton.disabled = false;
    resultList.innerHTML = '';
    var listCount = 0; // Track list count for triggers
    // create list items
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var className = i === 0 ? "result-item selected" : "result-item";
        var dataIndex = i;
        var lineText = line.LineText;
        var speaker = line.Speaker;
        var li = document.createElement('li');
        li.className = className;
        li.setAttribute('data-index', dataIndex);
        li.innerHTML = '<p class="description"><b>' + speaker + "</b>: " + lineText + '</p>';
        // Start Event listener for clickable list items
        li.addEventListener('click', function () {
            // console.log('Clicked on li item:', this);
            var selectedLi = resultList.querySelector('.result-item.selected');
            if (selectedLi) {
                selectedLi.classList.remove('selected');
            }
            this.classList.add('selected');
            var dataIndex = parseInt(this.getAttribute('data-index'));
            var selectedItem = lines[dataIndex];
            var selectedIndex = selectedItem.LineID; // LineID of selectedItem
            // Populate the sidebar with ddata related to selected list item
            sidebarTitle.textContent = selectedItem.Title;
            sidebarSeason.textContent = selectedItem.Season;
            sidebarEpisode.textContent = selectedItem.Episode;
            sidebarScene.textContent = selectedItem.Scene;
            sidebarCharacter.textContent = selectedItem.Speaker;
            sidebarDiskNumber.textContent = selectedItem.Dvd;
            sidebarDeleted.textContent = selectedItem.IsDeleted;
            // Find the matching line in the context lines JSON
            for (var i = 0; i < contextLines.length; i++) {
                if (contextLines[i].LineID === selectedIndex) {
                    selectedIndex = i;
                    break;
                }
            }
            // Check if a matching line was found
            if (selectedIndex !== -1) {
                var selectedLine = contextLines[selectedIndex];
                var previousLine = contextLines[selectedIndex - 1];
                var nextLine = contextLines[selectedIndex + 1];
                // Retrieve the Speaker and LineText properties for the selected line
                var selectedSpeaker = selectedLine.Speaker;
                var selectedLineText = selectedLine.LineText;
                var selectedLineID = selectedLine.LineID;
                // Retrieve the Speaker and LineText properties for the previous line
                var previousSpeaker = previousLine ? previousLine.Speaker : "";
                var previousLineText = previousLine ? previousLine.LineText : "";
                // Retrieve the Speaker and LineText properties for the next line
                var nextSpeaker = nextLine ? nextLine.Speaker : "";
                var nextLineText = nextLine ? nextLine.LineText : "";
                // Assign values to the elements
                previousSpeakerElement.textContent = previousSpeaker;
                previousLineElement.textContent = previousLineText;
                currentSpeakerElement.textContent = selectedSpeaker;
                currentLineElement.textContent = selectedLineText;
                nextSpeakerElement.textContent = nextSpeaker;
                nextLineElement.textContent = nextLineText;
                currentLineIDElement.textContent = selectedLineID;
            } else {
                // console.log("No line found with the given LineID");
            }
        });
        resultList.appendChild(li);
        listCount++;
    }
    // console.log("List length:" + listCount);
    // Do something with no results
    if (listCount == 0) {
        var paragraph = document.createElement('p');
        var bold = document.createElement('b');
        bold.textContent = 'No results,  Please try again.';
        paragraph.className = "result-zero";
        paragraph.appendChild(bold);
        resultList.appendChild(paragraph);
    }
    // Simulate a click event on the first list item
    var firstListItem = resultList.querySelector('.result-item');
    if (firstListItem) {
        firstListItem.click();
    }
    // Update the variable that holds the dropdown value when changed
    var dropdown = document.getElementById('dropdown');
    var moreOptions = "More Options...";
    var characterList = []; // Array to hold the character options
    var charactersLoaded = 50; // Number of characters initially loaded

    // Function to load character options from the server
    function loadCharacterOptions() {
        // Instantiate the CharacterList class
        var characterListObj = new CharacterList();

        // Call the getCharacterOptions() method to retrieve the character options
        var characterOptions = characterListObj.getCharacterOptions();

        // Populate the characterList array with the retrieved character options
        characterList = characterOptions;
    }

    // Function to populate the dropdown with character options
    function populateCharacterOptions() {
        dropdown.innerHTML = ''; // Clear existing options

        // Add the initial characters to the dropdown
        for (var i = 0; i < charactersLoaded && i < characterList.length; i++) {
            var character = characterList[i];
            var option = document.createElement('option');
            option.value = character;
            option.textContent = character;
            dropdown.appendChild(option);
        }

        // Check if there are more characters to load
        if (charactersLoaded < characterList.length) {
            // Add the "More Options..." option
            var moreOptionsOption = document.createElement('option');
            moreOptionsOption.value = moreOptions;
            moreOptionsOption.textContent = moreOptions;
            dropdown.appendChild(moreOptionsOption);
        }
    }

    // Load the initial character options
    loadCharacterOptions();
    populateCharacterOptions();

    // Event listener for dropdown change
    dropdown.addEventListener('change', function () {
        var selectedOption = dropdown.value;
        if (selectedOption === moreOptions) {
            // Load all remaining characters
            charactersLoaded = characterList.length;
            populateCharacterOptions();
        } else {
            // Handle selection of other character options
            // ...existing code...
        }
    });
    // Up and Down arrows for the script context scrolling
    var storedResults = null;
    lowerButtonUp.addEventListener('click', function () {
        var currentLineID = document.getElementById('current-id').innerHTML;
        if (currentLineID != "") {
            // Check if there are stored results and the current line ID exists in the results
            if (storedResults && storedResults.some(line => line.lineID == currentLineID)) {
                assignResults(storedResults, "up");
                //console.log("Cached JSON Used")
            } else {
                results = sendDataToServer(parseInt(sidebarSeason.textContent), +
                    parseInt(sidebarEpisode.textContent), parseInt(sidebarScene.textContent), "up");
                    //console.log("New JSON Used")
            }
            return results;
        }
    });
    lowerButtonDown.addEventListener('click', function () {      
        var currentLineID = document.getElementById('current-id').innerHTML;
        // console.log("Current Line ID" + currentLineID);
        if (currentLineID != "") {
            // Check if there are stored results and the current line ID exists in the results
            if (storedResults && storedResults.some(line => line.lineID == currentLineID)) {
                assignResults(storedResults, "down");
                //console.log("Cached JSON Used")
            } else {
                results = sendDataToServer(parseInt(sidebarSeason.textContent), +
                    parseInt(sidebarEpisode.textContent), parseInt(sidebarScene.textContent), "down");
                //console.log("New JSON Used")
            }
            return results;
        }      
    });
    function sendDataToServer(season, episode, scene, button) {
        var data = {
            selectedSeason: season,
            selectedEpisode: episode,
            selectedScene: scene,
        };
        var jsonData = JSON.stringify(data); // Convert the data object to a JSON string
        var xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
        xhr.open("POST", "/Results/GetResults", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        // Callback function for request completion
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.status === "success") {
                        // Process the results
                        var results = response.data;
                        storedResults = results;
                        assignResults(results, button);
                    } else {         
                        window.location.href = "/Error"; // Redirect to the error page
                    }
                } else {   
                    window.location.href = "/Error"; // Redirect to the error page
                }
            }
        };      
        xhr.send(jsonData); // Send the JSON data to the server
    }
    function assignResults(results, button) {
        var previousSpeakerElement = document.getElementById('previous-speaker');
        var previousLineElement = document.getElementById('previous-line');
        var currentSpeakerElement = document.getElementById('current-speaker');
        var currentLineElement = document.getElementById('current-line');
        var nextSpeakerElement = document.getElementById('next-speaker');
        var nextLineElement = document.getElementById('next-line');

        var currentLineID = document.getElementById('current-id').innerHTML;
        // console.log("Line ID Captured: " + currentLineID);

        // Check if any line ID matches the current line ID
        var matchingLine = results.find(function (line) {
            return line.lineID == currentLineID;
        });

        if (matchingLine) {
            // Find the index of the matching line
            var matchingIndex = results.indexOf(matchingLine);

            // Check if there are previous and next lines available
            if (matchingIndex >= 1) {
                if (button === "up")
                {
                    // console.log("UP shift the lines")

                    currentSpeakerElement.innerHTML = results[matchingIndex - 1].speaker;
                    currentLineElement.innerHTML = results[matchingIndex - 1].lineText;

                    nextSpeakerElement.innerHTML = results[matchingIndex].speaker;
                    nextLineElement.innerHTML = results[matchingIndex].lineText;

                    try {
                        previousSpeakerElement.innerHTML = results[matchingIndex - 2].speaker;
                        previousLineElement.innerHTML = results[matchingIndex - 2].lineText;
                    }

                    catch {
                        previousSpeakerElement.innerHTML = "";
                        previousLineElement.innerHTML = "<b>Beginning of Scene<//b>";
                        currentLineID = parseInt(currentLineID) + 1;
                    }

                    currentLineID = parseInt(currentLineID) - 1;
                }

                else if (button === "down")
                {
                    // console.log("DOWN shift the lines")
                    currentSpeakerElement.innerHTML = results[matchingIndex + 1].speaker;
                    currentLineElement.innerHTML = results[matchingIndex + 1].lineText;

                    try {
                        nextSpeakerElement.innerHTML = results[matchingIndex + 2].speaker;
                        nextLineElement.innerHTML = results[matchingIndex + 2].lineText;
                    }

                    catch {
                        nextSpeakerElement.innerHTML = "";
                        nextLineElement.innerHTML = "<b>End of Scene<//b>";
                        currentLineID = parseInt(currentLineID) - 1;
                    }


                    previousSpeakerElement.innerHTML = results[matchingIndex].speaker;
                    previousLineElement.innerHTML = results[matchingIndex].lineText;

                    currentLineID = parseInt(currentLineID) + 1;
                }

                currentLineIDElement.textContent = currentLineID; // Update the currentLineIDElement with the new value

            }

        } else {
            // console.log("No matching line found.");
        }
        return results;
    }
    // Keydown event listener for up and down arrow keys
    document.addEventListener('keydown', function (event) {
        var selectedLi = resultList.querySelector('.result-item.selected');
        if (selectedLi) {
            var currentIndex = parseInt(selectedLi.getAttribute('data-index'));
            if (event.key === 'ArrowUp' && currentIndex > 0) {
                currentIndex--;
            } else if (event.key === 'ArrowDown' && currentIndex < lines.length - 1) {
                currentIndex++;
            }
            var newSelectedLi = resultList.querySelector('[data-index="' + currentIndex + '"]');
            if (newSelectedLi) {
                selectedLi.classList.remove('selected');
                newSelectedLi.classList.add('selected');
                newSelectedLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                var selectedIndex = parseInt(newSelectedLi.getAttribute('data-index'));
                var selectedItem = lines[selectedIndex];
                var selectedLineID = selectedItem.LineID;

                sidebarTitle.textContent = selectedItem.Title;
                sidebarCharacter.textContent = selectedItem.Speaker;
                sidebarEpisode.textContent = selectedItem.Episode;
                sidebarSeason.textContent = selectedItem.Season;
                sidebarDiskNumber.textContent = selectedItem.Dvd;
                sidebarDeleted.textContent = "";

                for (var i = 0; i < contextLines.length; i++) {
                    if (contextLines[i].LineID === selectedLineID) {
                        selectedIndex = i;
                        break;
                    }
                }
                // Check if a matching line was found
                if (selectedIndex !== -1) {
                    var selectedLine = contextLines[selectedIndex];
                    var previousLine = contextLines[selectedIndex - 1];
                    var nextLine = contextLines[selectedIndex + 1];

                    // Retrieve the Speaker and LineText properties for the selected line
                    var selectedSpeaker = selectedLine.Speaker;
                    var selectedLineText = selectedLine.LineText;

                    // Retrieve the Speaker and LineText properties for the previous line
                    var previousSpeaker = previousLine ? previousLine.Speaker : "";
                    var previousLineText = previousLine ? previousLine.LineText : "";

                    // Retrieve the Speaker and LineText properties for the next line
                    var nextSpeaker = nextLine ? nextLine.Speaker : "";
                    var nextLineText = nextLine ? nextLine.LineText : "";

                    // Assign values to the elements
                    previousSpeakerElement.textContent = previousSpeaker;
                    previousLineElement.textContent = previousLineText;
                    currentSpeakerElement.textContent = selectedSpeaker;
                    currentLineElement.textContent = selectedLineText;
                    nextSpeakerElement.textContent = nextSpeaker;
                    nextLineElement.textContent = nextLineText;
                } else {
                    // console.log("No line found with the given LineID");
                }
            }
        }
    });

    // Disable search button until results are retrieved
    document.getElementById('searchForm').addEventListener('submit', function () {
        // Disable the submit button
        searchButton.disabled = true;
    });
});


