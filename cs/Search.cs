using System.Text.RegularExpressions;

namespace WebAppFramework.Models
{
    public class Search
    {
        // properties
        public string? input { get; set; }
        public string? output { get; set; }
        public List<string>? wordsList { get; set; }
        public List<string>? matchList { get; set; }
        public List<int>? matchIndexes { get; set; }
        public double matchPercentage { get; set; }

        // Takes the user input and formats the words for searching the processed data
        public static List<string> SplitandCleanWords(string textInput)
        {
            // Remove special characters except dashes using regex
            string cleanedText = Regex.Replace(textInput, "[^a-zA-Z0-9\\- ]", string.Empty);
            // Split the words into a list of strings
            List<string> wordsList = new List<string>(cleanedText.Split(' ', StringSplitOptions.RemoveEmptyEntries));
            return wordsList;
        }
        // Converts a cleaned string of word into a list to iterate thourgh
        public static List<string> StringToList(string inputString)
        {
            List<string> wordList = new List<string>();
            string[] words = inputString.Split(' ');
            foreach (string word in words)
            {
                wordList.Add(word);
            }
            return wordList;
        }
        // Takes in the search string, convert it to a list of words to compare to the words in each line of the entire script, returns a string of numbers separates by a comma
        public string SearchScript(string textInput, ProcessedCollection processedLines)
        {
            Search s = new Search();
            // s.matches = new Dictionary<int, int>();
            List<(int matchIndex, int matchCount, double matchPercentage)> dataList = new List<(int, int, double)> { };
            s.input = textInput;  // Assign user input to input variable in the search class           
            s.wordsList = SplitandCleanWords(s.input);  // Convert input to a cleaned list
            //bool uniqueWord = false;
            //foreach (string word in s.wordsList)
            //{
            //    if (!StopWords.Words.Contains(word))
            //    {
            //        uniqueWord = true;
            //        break;  // Action to perform when a word is not in the stop words list
            //    }
            //}
            if (s.wordsList == null /*|| uniqueWord == false*/)  // null check
            {
                s.output = "Invalid";
                return s.output;
            }

            foreach (ProcessedLine line in processedLines)  // iterate through each string in the list of script lines
            {
                int matchCount = 0;
                int matchIndex = line.LineID;
                s.matchList = new List<string>();
                // Convert the string of words into a list of words
                List<string> lineList = StringToList(line.LineText);
                // iterate through words in the list created from the script line
                foreach (string word in s.wordsList)
                {
                    // iterate through the list of words inputted by the user
                    foreach (string item in lineList)
                    {
                        // Check if the list of matching words does not yet contain the found match 
                        if (!s.matchList.Contains(item, StringComparer.OrdinalIgnoreCase))
                        {
                            // Check if the given search word is an exact match to the given script line word
                            if (word == item)
                            {
                                // Add the word to the match list to prevent the word from bwing counted again
                                s.matchList.Add(word);
                                // Add to the total of matches for this script line to determine how good of a match it is later
                                matchCount++;
                            }
                        }
                    }
                }
                // Create percent of line as a match to make closer matches flaot to the top.
                matchPercentage = (double)matchCount / lineList.Count();

                if (matchCount > 0)
                {
                    dataList.Add((matchIndex, matchCount, matchPercentage));
                }
            }
            // Sort the list of int int entries based on the highest match count
            var sortedList = dataList.OrderByDescending(t => t.matchCount).ThenByDescending(t => t.matchPercentage).ThenBy(t => t.matchIndex);
            // Extract the matchIndex values into a List<int>
            // s.matchIndexes = dataList.Select(t => t.matchIndex).ToList();
            s.matchIndexes = sortedList.Select(t => t.matchIndex).ToList();
            // Convert the list to a string of csv.
            s.output = string.Join(",", s.matchIndexes);
            // Console.WriteLine(s.output);
            return s.output; // return output is inserted into an SQL statement to retrieve relevant script lines
        }

        // Add indexes for the line before and after the given list of indexes
        public string AddContextLines(ScriptCollection lines)
        {
            List<int> numbers = new List<int>();

            foreach (ScriptLine line in lines)
            {
                numbers.Add(line.LineID);
            }

            List<int> copy = new List<int>(numbers);

            foreach (int number in copy)
            {

                if (!numbers.Contains(number + 1))
                {
                    numbers.Add(number + 1);
                }

                // Check if current number - 1 is not in the list
                if (!numbers.Contains(number - 1))
                {
                    numbers.Add(number - 1);
                }
            }

            numbers.Sort();
            string result = string.Join(",", numbers);

            return result;
        }
    }
}
