﻿using System;
using System.Web.Mvc;
using Server.Models;

namespace Server.Controllers
{
    public class HomeController : Controller
    {
        private DateTime? _lastBuild;

        public ActionResult Index()
        {
            if (!_lastBuild.HasValue)
            {
                System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(assembly.Location);
                _lastBuild = fileInfo.LastWriteTime;
            }

            AsteroidsViewModel model = new AsteroidsViewModel(_lastBuild.Value);

            return View(model);
        }
    }
}