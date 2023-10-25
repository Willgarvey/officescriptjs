using System.Data;

namespace WebAppFramework.Models
{
    public class ScriptLine
    {
        // properties
        public int LineID { get; set; }
        public int Season { get; set; }
        public int Episode { get; set; }
        public int Scene { get; set; }
        public string LineText { get; set; } = "";
        public string Speaker { get; set; } = "";
        public string IsDeleted { get; set; } = "";
        public string Title { get; set; } = "";
        public int Dvd { get; set; }

        // default constructor
        public ScriptLine() { }
        // database constructor
        public ScriptLine(DataRow lineRow)
        {
            LineID = Convert.ToInt32(lineRow["id"]);
            Season = Convert.ToInt32(lineRow["season"])!;
            Episode = Convert.ToInt32(lineRow["episode"])!;
            Scene = Convert.ToInt32(lineRow["scene"])!;
            LineText = Convert.ToString(lineRow["line_text"])!;
            Speaker = Convert.ToString(lineRow["speaker"])!;
            IsDeleted = Convert.ToString(lineRow["deleted"])!;
            Title = Convert.ToString(lineRow["title"])!;
            Dvd = Convert.ToInt32(lineRow["dvd"])!;


        }
    }
}
