namespace Server.Models
{
    public class AsteroidsViewModel
    {
        private readonly int _minorVersion;
        public string VersionPostFix { get { return "?v=" + _minorVersion; } }

        public AsteroidsViewModel(int minorVersion)
        {
            _minorVersion = minorVersion;
        }

        public string AppendVersion(string thing)
        {
            throw new System.NotImplementedException();
        }
    }
}