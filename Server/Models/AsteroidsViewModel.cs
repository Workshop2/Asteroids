namespace Server.Models
{
    public class AsteroidsViewModel
    {
        private readonly int _minorVersion;
        private readonly string _scriptsPath;
        //public string VersionPostFix { get { return "?v=" + _minorVersion; } }

        public AsteroidsViewModel(int minorVersion, string scriptsPath)
        {
            _minorVersion = minorVersion;
            _scriptsPath = scriptsPath;
        }

        public string GetScript(string scriptName)
        {
            return string.Format("{0}{1}?v={2}", _scriptsPath, scriptName, _minorVersion);
        }

    }
}