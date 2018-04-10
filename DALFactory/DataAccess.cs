using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Reflection;
using Model;
using IDAL;

namespace DALFactory
{
    public class DataAccess
    {
        private static string AssemblyName = ConfigurationManager.AppSettings["Path"].ToString();
        private static string db = ConfigurationManager.AppSettings["DB"].ToString();
        public static IBook CreateBook()
        {
            string className = AssemblyName + "." + db + "Book";
            return (IBook)Assembly.Load(AssemblyName).CreateInstance(className);
        }
    }
}
