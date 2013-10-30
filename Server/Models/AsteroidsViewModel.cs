using System;

namespace Server.Models
{
    public class AsteroidsViewModel
    {
        public DateTime LastBuild { get; set; }
        public bool DevMode { get; set; }

        public AsteroidsViewModel(DateTime lastBuild, bool devMove)
        {
            LastBuild = lastBuild;
            DevMode = devMove;
        }
    }
}