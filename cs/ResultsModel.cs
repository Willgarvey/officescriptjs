namespace WebAppFramework.Models
{
    public class ResultsModel
    {
        // Used to execute a search
        public string? Text { get; set; }
        public string? SelectedOption { get; set; }
        public ScriptCollection Lines { get; set; } = new ScriptCollection();
        public ScriptCollection ContextLines { get; set; } = new ScriptCollection();
        public string ResultsJson { get; set; } = ""; // Property to hold the JSON as a string
        public string ContextJson { get; set; } = ""; // Property to hold JSON as a string
    }


}
