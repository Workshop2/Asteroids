using System.Reflection;
using System.Web.Mvc;
using Server.Models;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
         public ActionResult Index()
         {
             int minorVersion = Assembly.GetExecutingAssembly().GetName().Version.MinorRevision;
             AsteroidsViewModel model = new AsteroidsViewModel(minorVersion);

             return View(model);
         }
    }
}