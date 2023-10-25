using System.Data;
using System.Data.SqlClient;

namespace WebAppFramework.Models
{
    public class DataAccess
    {
        private static SqlConnection? connection = null;
        public static string ConnectionString { get; set; } = "";
        private static void Connect()
        {
            if (ConnectionString == null || ConnectionString == "")
            {
                throw new Exception("Connection string was not set.");
            }

            if (connection == null)
            {
                connection = new SqlConnection(ConnectionString);
            }

            if (connection.State != System.Data.ConnectionState.Open)
            {
                connection.Open();
            }
        }
        public static void CloseConnection()
        {
            connection?.Close();
        }
        public static DataTable SelectFromDB(string sql, List<SqlParameter>? parameters = null, bool closeConnection = true)
        {
            Connect();

            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }

                using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                {
                    DataTable table = new DataTable();
                    adapter.Fill(table);

                    if (closeConnection) CloseConnection();

                    return table;
                }
            }
        }
        public static int ExecuteSql(string sql, List<SqlParameter>? parameters = null, bool closeConnection = true)
        {
            Connect();

            using (SqlCommand command = new SqlCommand(sql, connection))
            {
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }


                int result = Convert.ToInt32(command.ExecuteScalar());
                if (closeConnection) CloseConnection();

                return result;
            }
        }
    }
}
