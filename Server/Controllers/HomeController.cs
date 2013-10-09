using System.Web.Mvc;
using Server.Models;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
         public ActionResult Index()
         {
             return View(new AsteroidsViewModel());
         }
    }
}