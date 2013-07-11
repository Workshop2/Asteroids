using System;
using System.Collections.Generic;
using Microsoft.AspNet.SignalR;

namespace Server
{
    public class GameHub : Hub
    {
        private static Dictionary<string, UserInfo> _users = new Dictionary<string, UserInfo>();

        public void SignIn(UserInfo userInfo)
        {
            UserInfo result = null;
            string connectionId = this.Context.ConnectionId;

            // only allow the same user to sign in once
            if (_users.ContainsKey(connectionId))
            {
                result = _users[connectionId];
            }
            else
            {
                result = new UserInfo
                {
                    displayName = userInfo.displayName,
                    colour = RandomColour(),
                    guid = connectionId
                };
                _users.Add(connectionId, result);

                Clients.All.playerJoined(result);
            }

            Clients.Caller.signInComplete(result);
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            string connectionId = this.Context.ConnectionId;
            if (_users.ContainsKey(connectionId))
            {
                Clients.All.playerDisconnected(_users[connectionId]);
                _users.Remove(Context.ConnectionId);
            }
            
            return base.OnDisconnected();
        }

        private static string RandomColour()
        {
            var random = new Random();
            return String.Format("#{0:X6}", random.Next(0x1000000));
        }
    }

    public class UserInfo
    {
        public string displayName { get; set; }
        public string guid { get; set; }
        public string colour { get; set; }
    }
}