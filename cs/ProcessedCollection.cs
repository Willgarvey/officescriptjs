using System.Data;

namespace WebAppFramework.Models
{
    public class ProcessedCollection : List<ProcessedLine>
    {
        // constructor with the connection string to the OfficeScripts database with tblScriptRaw and tblScriptSearch
        public ProcessedCollection()
        {
            // Get the application's current directory
            string appDirectory = AppDomain.CurrentDomain.BaseDirectory;

            // Specify the relative path to the database files
            string databasePath = Path.Combine(appDirectory, "Data");

            // Update the connection string
            string connectionString = $"Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename={Path.Combine(databasePath, "OfficeScript.mdf")};Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

            // Assign the updated connection string to your DataAccess class or data access code
            DataAccess.ConnectionString = connectionString;
        }
        public void LoadFromDB()
        {
            string sql = "SELECT * FROM tblScriptSearch";
            DataTable table = DataAccess.SelectFromDB(sql);
            foreach (DataRow row in table.Rows)
            {
                Add(new ProcessedLine(row));
            }
            DataAccess.CloseConnection();
        }
    }
}
