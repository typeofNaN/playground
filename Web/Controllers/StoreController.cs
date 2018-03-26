using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class StoreController : Controller
    {
        // GET: Store
        public ActionResult Index()
        {
            //创建数据库实体
            Models.BookStoreEntities db = new Models.BookStoreEntities();
            //获取Books数据表数据
            var data = db.Books;
            return View(data);
        }

        [HttpGet]
        public ActionResult Order(int id)
        {
            //创建数据库实体
            Models.BookStoreEntities db = new Models.BookStoreEntities();
            //查询id对应书籍信息
            var book = db.Books.Where(b => b.BookId == id).FirstOrDefault();
            //将书籍信息放到ViewData
            ViewBag.BookId = book.BookId;
            ViewBag.AuthorName = book.AuthorName;
            ViewBag.Title = book.Title;
            ViewBag.Price = book.Price;
            ViewBag.BookCoverUrl = book.BookCoverUrl;
            return View();
        }

        [HttpPost]
        public ActionResult Order(int BookId, int Num, string Address)
        {
            //创建数据库实体
            Models.BookStoreEntities db = new Models.BookStoreEntities();
            //将订单数据添加到数据库的Order表
            db.Orders.Add(new Models.Orders()
            {
                BookId = BookId,
                Num = Num,
                Address = Address
            });
            //将数据保存到数据库
            db.SaveChanges();
            return RedirectToAction("Details");
        }

        public ActionResult Details()
        {
            //创建数据库实体
            Models.BookStoreEntities db = new Models.BookStoreEntities();
            //获取Orders数据表数据
            var data = db.Orders;
            return View(data);
        }
    }
}