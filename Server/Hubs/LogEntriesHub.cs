using log4net;
using Microsoft.AspNet.SignalR;

namespace Server
{
	public class LogEntriesHub : Hub
	{
		private static readonly ILog _log;

		static LogEntriesHub()
        {
			_log = LogManager.GetLogger("AsteroidsLog");
        }

		public void Info(string message)
		{
			_log.Info(message);
		}
	}
}