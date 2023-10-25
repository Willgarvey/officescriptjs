class Search {
    constructor() {
      this.input = null;
      this.character = null;
      this.output = null;
      this.wordsList = null;
      this.matchList = null;
      this.matchIndexes = null;
      this.matchPercentage = 0;
    }
  
    static splitAndCleanWords(textInput) {
      // Remove special characters except dashes using regex (kept as is)
      const cleanedText = textInput.replace(/[^a-zA-Z0-9\- ]/g, '');
      // Split the words into a list of strings
      const wordsList = cleanedText.split(' ').filter(word => word !== '');
      return wordsList;
    }
  
    static stringToList(inputString) {
      const wordList = [];
      const words = inputString.split(' ');
      for (const word of words) {
        wordList.push(word);
      }
      return wordList;
    }
  
    searchScript(textInput, processedLines, selectedCharacter) {
      const s = new Search();
      const dataList = [];
  
      s.input = textInput;
      s.wordsList = Search.splitAndCleanWords(s.input);
  
      // Return is there are no words in the list
      if (!s.wordsList.length) {
        s.output = 'Invalid';
        return s.output;
      }

      for (let line of processedLines) {
        let matchCount = 0;
        let matchIndex = line.LineID;
        s.matchList = [];
        const lineList = Search.stringToList(line.LineText);
  
        for (let word of s.wordsList) {
          for (let item of lineList) {
            if (!s.matchList.includes(item.toLowerCase())) {
              if (word === item) {
                s.matchList.push(word.toLowerCase());
                matchCount++;
              }
            }
          }
        }
  
        s.matchPercentage = matchCount / lineList.length;
  
        if (matchCount > 0) {
          dataList.push({ matchIndex, matchCount, matchPercentage: s.matchPercentage });
        }
      }
  
      let sortedList = dataList
        .sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage || a.matchIndex - b.matchIndex);
  
      s.matchIndexes = sortedList.map(entry => entry.matchIndex);
      s.output = s.matchIndexes.join(',');
      return s.output;
    }
  
    addContextLines(lines) {
      let numbers = lines.map(line => line.LineID);
      let copy = numbers.slice();
  
      for (let number of copy) {
        if (!numbers.includes(number + 1)) {
          numbers.push(number + 1);
        }
  
        if (!numbers.includes(number - 1)) {
          numbers.push(number - 1);
        }
      }
  
      numbers.sort((a, b) => a - b);
      let result = numbers.join(',');
      
      // return an ordered list of indexes to retrieve the search results from the raw script list
      return result;
    }

    getMatchingLines(result, scriptLines){

      const indices = result.split(",").map(index => parseInt(index, 10));
      const unsortedFinalResults = scriptLines.filter(obj => indices.includes(parseInt(obj.LineID, 10)));
      return unsortedFinalResults;

    }
  }
  