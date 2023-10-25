using CsvHelper;
using CsvHelper.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;

namespace WebAppFramework.Models
{
    public class ScriptCollection : List<ScriptLine>
    {
        private static string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=OfficeScript;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

        // constructor with the connection string to the OfficeScripts database with tblScriptRaw and tblScriptSearch
        public ScriptCollection()
        {
            // Connection String for the OfficeScript database for both tables
            DataAccess.ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=OfficeScript;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
        }
        // Loads the entire raw script database. This will ultimately be unescessary
        public void LoadFromDB()
        {
            string sql = "SELECT * FROM tblScriptRaw";
            DataTable table = DataAccess.SelectFromDB(sql);
            foreach (DataRow row in table.Rows)
            {
                Add(new ScriptLine(row));
            }
            DataAccess.CloseConnection();
        }
        // Pulls the script lines for the user to view once the search is completed in the preprocessed database
        public void SearchFromDB(string result)
        {
            if (string.IsNullOrEmpty(result))
            {
                return;
            }
            //string sql = "SELECT * FROM tblScriptRaw";
            string sql = $"SELECT * FROM tblScriptRaw WHERE ID IN ({result})";
            DataTable table = DataAccess.SelectFromDB(sql);
            foreach (DataRow row in table.Rows)
            {
                Add(new ScriptLine(row));
            }
            DataAccess.CloseConnection();
        }
        public void SortByRelevance(string result, ScriptCollection searchResults)
        {
            if (string.IsNullOrEmpty(result))
            {
                return;
            }
            List<int> matchList = result.Split(',').Select(int.Parse).ToList();

            ScriptCollection reorderedLinesList = new ScriptCollection();

            foreach (int id in matchList)
            {
                ScriptLine matchingLine = searchResults.FirstOrDefault(line => line.LineID == id);

                if (matchingLine != null)
                {
                    reorderedLinesList.Add(matchingLine);

                    // Break the loop if we have reached the desired limit of 30 lines
                    if (reorderedLinesList.Count >= 40)
                    {
                        break;
                    }
                    Console.WriteLine(reorderedLinesList);
                }
            }
            // Clear the original searchResults and add the reordered lines
            searchResults.Clear();
            searchResults.AddRange(reorderedLinesList);
        }

        public void LoadFromCSV(string filePath)
        {
            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                CsvConfiguration csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    Delimiter = "\t",
                    HeaderValidated = null  // Ignore header validation
                };

                List<ScriptLine> lines = csv.GetRecords<ScriptLine>().ToList();
                this.AddRange(lines);
            }
        }
        public void InsertIntoDB()
        {
            try
            {
                // Clear the table before inserting new data
                string clearSql = "DELETE FROM tblScriptRaw";
                DataAccess.ExecuteSql(clearSql);

                // Create a SQL insert statement
                string insertSql = "INSERT INTO tblScriptRaw (id, season, episode, scene, line_text, speaker, deleted, title, dvd) VALUES (@id, @season, @episode, @scene, @line_text, @speaker, @deleted, @title, @dvd)";

                foreach (ScriptLine scriptLine in this)
                {
                    // Create a list to store the parameters and values
                    List<SqlParameter> parameters = new List<SqlParameter>
                    {
                        new SqlParameter("@id", scriptLine.LineID),
                        new SqlParameter("@season", scriptLine.Season),
                        new SqlParameter("@episode", scriptLine.Episode),
                        new SqlParameter("@scene", scriptLine.Scene),
                        new SqlParameter("@line_text", scriptLine.LineText),
                        new SqlParameter("@speaker", scriptLine.Speaker),
                        new SqlParameter("@deleted", scriptLine.IsDeleted),
                        new SqlParameter("@title", scriptLine.Title),
                        new SqlParameter("@dvd", scriptLine.Dvd),
                    };
                    // Execute the SQL insert statement
                    DataAccess.ExecuteSql(insertSql, parameters, false);
                }
                // Close the database connection
                DataAccess.CloseConnection();
                // Display a success message
                Console.WriteLine("CSV data inserted into the database successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while inserting CSV data into the database: " + ex.Message);
            }
        }

        public ScriptCollection SelectFromDB(string searchIndexes, string selectedOption)
        {
            ScriptCollection lines = new ScriptCollection();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    string sql = "SELECT * FROM dbo.tblScriptRaw WHERE ID IN (" + searchIndexes + ")";
                    if (selectedOption != null && selectedOption != "All Speakers")
                    {
                        sql = "SELECT * FROM dbo.tblScriptRaw WHERE speaker = @SelectedOption AND ID IN (" + searchIndexes + ")";
                    }
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@SelectedOption", selectedOption);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ScriptLine line = new ScriptLine();

                                line.LineID = reader.GetInt32(0);
                                line.Season = reader.GetInt32(1);
                                line.Episode = reader.GetInt32(2);
                                line.Scene = reader.GetInt32(3);
                                line.LineText = reader.GetString(4);
                                line.Speaker = reader.GetString(5);
                                line.IsDeleted = reader.GetString(6);
                                line.Title = reader.GetString(7);
                                line.Dvd = reader.GetInt32(8);

                                lines.Add(line);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                return lines;
            }
            //TODO: Check results being returned
            return lines;
        }


    }
}
