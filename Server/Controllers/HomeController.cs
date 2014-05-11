using System.Web.Mvc;
using Server.Models;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
         public ActionResult Index()
         {
             AsteroidsViewModel model = new AsteroidsViewModel();

             return View(model);
         }
    }
}