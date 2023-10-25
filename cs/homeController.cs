using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Text.Json;
using WebAppFramework.Models;

namespace WebAppFramework.Controllers
{
    public class HomeController : Controller
    {
        private readonly string? connectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=OfficeScript;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

        [HttpPost]
        public IActionResult SubmitForm(HomeModel model)
        {
            // Assign the Search Text and Selected Character into a model for the nest page's Model, a ResultModel
            ResultsModel resultsModel = new ResultsModel
            {
                Text = Request.Form["Text"],
                SelectedOption = Request.Form["SelectedOption"],
            };

            ProcessedCollection processedLines = new ProcessedCollection();

            // load the preprocessed data to check against
            processedLines.LoadFromDB();
            Search search = new Search();

            string text = Request.Form["Text"];
            string selectedOption = Request.Form["SelectedOption"];

            //execute search method
            string result = search.SearchScript(text.ToLower(), processedLines);

            //TODO: Handle if result == "Invalid" for not using unique words
            if (result == "Invalid")
            {
                return View("Results", resultsModel);
            }


            if (result != "" && selectedOption != null)
            {
                ScriptCollection lines = new ScriptCollection();
                lines = lines.SelectFromDB(result, selectedOption); // SQL Select using result 
                lines.SortByRelevance(result, lines); // Sort lines by relevance
                string resultWithContextLines = search.AddContextLines(lines); // Create result with all context indexes
                ScriptCollection contextLines = new ScriptCollection();
                contextLines = contextLines.SelectFromDB(resultWithContextLines, selectedOption); // SQL select using context indexes

                // Serialize the resultsModel to JSON
                string resultsJson = JsonSerializer.Serialize(lines);
                resultsModel.ResultsJson = resultsJson;
                string contextJson = JsonSerializer.Serialize(contextLines);
                resultsModel.ContextJson = contextJson;
                resultsModel.Lines = lines;
            }

            else
            {
                resultsModel.ResultsJson = "[]";
                resultsModel.ContextJson = "[]";
            }

            //TODO: Last stop before results are rendered
            return View("Results", resultsModel);
        }
        [HttpGet]

        //TODO: Move this into the ScriptCollection Class and replace this with a method call
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Result()
        {
            // Action for displaying the result page
            return View();
        }
    }
}