using System.Data;

namespace WebAppFramework.Models
{
    public class ProcessedLine
    {
        public int LineID { get; set; }
        public string LineText { get; set; } = "";

        public ProcessedLine() { }

        // constructor for database
        public ProcessedLine(DataRow lineRow)
        {
            LineID = Convert.ToInt32(lineRow["id"]);
            LineText = Convert.ToString(lineRow["line_text"])!;
        }
        // override to show the linetext for each ScriptLine in the listBox
    }
}
