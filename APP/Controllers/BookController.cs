using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Mvc;
using Model;
using BLL;

namespace APP.Controllers
{
    public class BookController : Controller
    {
        // GET: StoreManage
        MvcBookStoreEntities db = new MvcBookStoreEntities();
        // GET: StoreManager
        //显示所有的书籍信息
        BookManager bookmanager = new BookManager();
        public ActionResult Index()
        {

            var books = bookmanager.GetBooks();
            return View(books);
        }

        // GET: StoreManager/Create
        //添加书籍的GET方法
        public ActionResult Create()
        {
            //存储在ViewBag.CategoryId属性中的分类数据是为了让视图中的DropDownList辅助方法检索
            //SelectList类用于表示构建下拉列表需要的数据，构造函数的第1个参数指定了将要放在列表中的项，
            //第2个参数是一个属性名称，该属性包含当用户选择一个指定项时使用的键值，
            //第3个参数是每一项要显示的文本，第4个参数包含了最初选定项的值。
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name");
            return View("Create");
        }

        // POST: StoreManager/Create
        //添加书籍的POST方法
        [HttpPost]
        [ValidateAntiForgeryToken]
        //[ValidateAntiForgeryToken]特性用来防止伪造的跨站请求，配合表单中的@Html.AntiForgeryToken()使用
        //对数据进行增删改时要防止csrf攻击！
        //该特性表示检测服务器请求是否被篡改。注意：该特性只能用于post请求，get请求无效。
        public ActionResult Create([Bind(Include = "BookId,CategoryId,Title,Price,BookCoverUrl,Authors")] Books book)
        {

            if (ModelState.IsValid)
            {
                bookmanager.AddBook(book);
                return RedirectToAction("Index");
            }
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", book.CategoryId);
            return View("Create", book);
        }
        // GET: StoreManager/Edit/5
        //编辑书籍的GET方法
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Books book = bookmanager.GetBookById(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", book.CategoryId);

            return View(book);
        }

        // POST: StoreManager/Edit/5
        //编辑书籍的POST方法
        [HttpPost]
        [ValidateAntiForgeryToken]
        //[ValidateAntiForgeryToken]特性用来防止伪造的跨站请求，配合表单中的@Html.AntiForgeryToken()使用
        //对数据进行增删改时要防止csrf攻击！
        //该特性表示检测服务器请求是否被篡改。注意：该特性只能用于post请求，get请求无效。
        public ActionResult Edit([Bind(Include = "BookId,CategoryId,Title,Price,BookCoverUrl,Authors")] Books book)
        {
            //使用Bind属性的目的是限制用户在提交form表单时使用合适且正确的值。当我们提交一个表单时，就会检查每一个实体上绑定的特性。
            //Bind属性是一个重要的安全机制，可以防止黑客攻击。
            if (ModelState.IsValid)
            {
                bookmanager.EditBook(book);
                return RedirectToAction("Index");
            }
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", book.CategoryId);

            return View(book);
        }

        // GET: StoreManager/Delete/5
        //删除给定id的书籍
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Books book = bookmanager.GetBookById(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            return View(book);
        }

        // POST: StoreManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        //[ValidateAntiForgeryToken]特性用来防止伪造的跨站请求，配合表单中的@Html.AntiForgeryToken()使用
        //对数据进行增删改时要防止csrf攻击！
        //该特性表示检测服务器请求是否被篡改。注意：该特性只能用于post请求，get请求无效。
        public ActionResult DeleteConfirmed(int id)
        {
            Books book = bookmanager.GetBookById(id);
            int bookid = book.BookId;
            var Carts = bookmanager.GetCartByBookId(bookid);
            if (Carts.Count() > 0)
            {
                bookmanager.RemoveRangeCarts(Carts);
            }
            var orderdetail = bookmanager.GetOrdersByBookId(bookid);
            if (orderdetail.Count() > 0)
            {
                bookmanager.RemoveRangeOrders(orderdetail);
            }
            bookmanager.RemoveBook(book);
            return RedirectToAction("Index");
        }
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Books book = bookmanager.GetBookById(id);
            if (book == null)
            {
                return HttpNotFound();
            }
            return View(book);
        }
    }
}