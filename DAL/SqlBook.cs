using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using IDAL;
using System.Data.Entity;

namespace DAL
{
    public class SqlBook : IBook
    {
        //MvcBookStoreEntities db = new MvcBookStoreEntities();
        MvcBookStoreEntities db = DbContextFactory.CreateDbContext();
        public IEnumerable<Books> GetBooks()
        {
            var books = db.Books.ToList();
            return books;
        }
        public Books GetBookById(int? id)
        {
            Books book = db.Books.Find(id);
            return book;
        }
        public IQueryable<Carts> GetCartByBookId(int id)
        {
            var Carts = db.Carts.Include("Books").Where(c => c.BookId == id);
            return Carts;
        }
        public IQueryable<OrderDetails> GetOrdersByBookId(int id)
        {
            var Orders = db.OrderDetails.Include("Books").Where(o => o.BookId == id);
            return Orders;
        }
        public void RemoveBook(Books book)
        {
            //以下两种方式都可以
            //db.Books.Remove(book);
            db.Entry(book).State = EntityState.Deleted;
            db.SaveChanges();
        }
        public void AddBook(Books book)
        {
            db.Books.Add(book);
            db.SaveChanges();
        }
        public void EditBook(Books book)
        {
            db.Entry(book).State = EntityState.Modified;
            db.SaveChanges();
        }

        public void RemoveRangeCarts(IQueryable<Carts> Carts)
        {
            db.Carts.RemoveRange(Carts);
            db.SaveChanges();
        }
        public void RemoveRangeOrders(IQueryable<OrderDetails> orderdetail)
        {
            db.OrderDetails.RemoveRange(orderdetail);
            db.SaveChanges();
        }
    }
}
