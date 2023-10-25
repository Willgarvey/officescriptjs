using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using WebAppFramework.Models;

namespace WebAppFramework.Controllers
{
    public class ResultsController : Controller
    {
        private static string connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=OfficeScript;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

        [HttpGet]
        public ActionResult Index()
        { return View(); }
        [HttpGet]
        public ActionResult Error()
        { return View(); }
        [HttpPost]
        public JsonResult GetResults([FromBody] RequestData requestData)
        {
            int selectedSeason = requestData.selectedSeason;
            int selectedEpisode = requestData.selectedEpisode;
            int selectedScene = requestData.selectedScene;

            List<ScriptLine> lines = new List<ScriptLine>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Use the received data in a custom SQL statement
                    string sql = "SELECT * FROM dbo.tblScriptRaw WHERE season = @Season AND episode = @Episode AND scene IN (@Scene)";
                    using (var command = new SqlCommand(sql, connection))
                    {
                        // Add parameters to the SQL command
                        command.Parameters.AddWithValue("@Season", selectedSeason);
                        command.Parameters.AddWithValue("@Episode", selectedEpisode);
                        command.Parameters.AddWithValue("@Scene", selectedScene);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                // Parse the retrieved data as before
                                ScriptLine line = new ScriptLine();

                                line.LineID = reader.GetInt32(reader.GetOrdinal("id"));
                                line.Season = reader.GetInt32(reader.GetOrdinal("season"));
                                line.Episode = reader.GetInt32(reader.GetOrdinal("episode"));
                                line.Scene = reader.GetInt32(reader.GetOrdinal("scene"));
                                line.LineText = reader.GetString(reader.GetOrdinal("line_text"));
                                line.Speaker = reader.GetString(reader.GetOrdinal("speaker"));
                                line.IsDeleted = reader.GetString(reader.GetOrdinal("deleted"));
                                line.Title = reader.GetString(reader.GetOrdinal("title"));
                                line.Dvd = reader.GetInt32(reader.GetOrdinal("dvd"));

                                lines.Add(line);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception appropriately
                throw;
            }
            // Construct the response object
            var response = new
            {
                status = "success",
                data = lines
            };
            // Console.WriteLine(response);
            // Return the response as JSON
            return Json(response);
        }
    }
}
