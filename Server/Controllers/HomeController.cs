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
             string scriptsPath = Url.Content("~/Scripts/");
             AsteroidsViewModel model = new AsteroidsViewModel(minorVersion, scriptsPath);

             return View(model);
         }
    }
}