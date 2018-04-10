using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using System.Runtime.Remoting.Messaging;

namespace DAL
{
    public class DbContextFactory
    {
        public static MvcBookStoreEntities CreateDbContext()
        {
            MvcBookStoreEntities dbContext = (MvcBookStoreEntities)CallContext.GetData("dbContext");
            if (dbContext == null)
            {
                dbContext = new MvcBookStoreEntities();
                CallContext.SetData("dbContext", dbContext);
            }
            return dbContext;
        }
    }
}
