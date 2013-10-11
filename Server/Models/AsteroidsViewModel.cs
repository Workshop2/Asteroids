using System;

namespace Server.Models
{
    public class AsteroidsViewModel
    {
        public DateTime LastBuild { get; set; }

        public AsteroidsViewModel(DateTime lastBuild)
        {
            LastBuild = lastBuild;
        }
    }
}