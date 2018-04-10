using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace IDAL
{
    public interface IBook
    {
        IEnumerable<Books> GetBooks();
        Books GetBookById(int? id);
        IQueryable<Carts> GetCartByBookId(int id);
        IQueryable<OrderDetails> GetOrdersByBookId(int id);
        void RemoveBook(Books book);
        void AddBook(Books book);
        void EditBook(Books book);

        void RemoveRangeCarts(IQueryable<Carts> Carts);
        void RemoveRangeOrders(IQueryable<OrderDetails> orderdetail);
    }
}
