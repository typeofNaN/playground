using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using IDAL;
using DALFactory;

namespace BLL
{
    public class BookManager
    {
        IBook ibook = DataAccess.CreateBook();
        public IEnumerable<Books> GetBooks()
        {
            var books = ibook.GetBooks();
            return books;
        }
        public Books GetBookById(int? id)
        {
            Books book = ibook.GetBookById(id);
            return book;
        }
        public IQueryable<Carts> GetCartByBookId(int id)
        {
            var Carts = ibook.GetCartByBookId(id);
            return Carts;
        }
        public IQueryable<OrderDetails> GetOrdersByBookId(int id)
        {
            var Orders = ibook.GetOrdersByBookId(id);
            return Orders;
        }
        public void RemoveBook(Books book)
        {
            ibook.RemoveBook(book);

        }
        public void AddBook(Books book)
        {
            ibook.AddBook(book);

        }
        public void EditBook(Books book)
        {
            ibook.EditBook(book);

        }
        public void RemoveRangeCarts(IQueryable<Carts> Carts)
        {
            ibook.RemoveRangeCarts(Carts);
        }
        public void RemoveRangeOrders(IQueryable<OrderDetails> orderdetail)
        {
            ibook.RemoveRangeOrders(orderdetail);
        }
    }
}
