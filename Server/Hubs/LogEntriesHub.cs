using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
			Console.WriteLine(message);
		}

		public void Warn(string message)
		{
			_log.Warn(message);
			Console.WriteLine(message);
		}

		public void Error(string message)
		{
			_log.Error(message);
			Console.WriteLine(message);
		}
	}
}