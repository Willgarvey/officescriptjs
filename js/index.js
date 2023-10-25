document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.getElementById('dropdown');
    var moreOptions = "More Options...";
    var characterList = []; // Array to hold the character options
    var charactersLoaded = 50; // Number of characters initially loaded

    let searchButton = document.getElementById('search');

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

    // ...existing code...
});
