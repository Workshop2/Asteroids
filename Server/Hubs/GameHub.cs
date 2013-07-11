using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace Server
{
    public class GameHub : Hub
    {
        private static readonly Dictionary<string, UserInfo> Users = new Dictionary<string, UserInfo>();

        public void SignIn(UserInfo userInfo)
        {
            UserInfo result = null;
            string connectionId = this.Context.ConnectionId;

            // only allow the same user to sign in once
            if (Users.ContainsKey(connectionId))
            {
                result = Users[connectionId];
            }
            else
            {
                // tell them about all of the existing users
                foreach (var userKey in Users.Keys)
                {
                    Clients.Caller.playerJoined(Users[userKey]);
                }

                result = new UserInfo
                {
                    displayName = userInfo.displayName,
                    colour = RandomColour(),
                    guid = connectionId
                };
                Users.Add(connectionId, result);

                Clients.AllExcept(connectionId).playerJoined(result);
            }

            Clients.Caller.signInComplete(result);
        }

        public override Task OnDisconnected()
        {
            string connectionId = this.Context.ConnectionId;
            if (Users.ContainsKey(connectionId))
            {
                Clients.All.playerDisconnected(Users[connectionId]);
                Users.Remove(Context.ConnectionId);
            }
            
            return base.OnDisconnected();
        }

        public void UpdatePlayer(dynamic player)
        {
            player.guid = this.Context.ConnectionId;
            Clients.AllExcept(this.Context.ConnectionId).playerChange(player);
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