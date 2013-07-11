using Microsoft.AspNet.SignalR;

namespace Server
{
    public class GameHub : Hub
    {
        public void SignIn(UserInfo userInfo)
        {
            Clients.All.signInComplete(userInfo);
        }
    }

    public class UserInfo
    {
        public string DisplayName { get; set; }
        public string Guid { get; set; }
        public string Colour { get; set; }
    }
}