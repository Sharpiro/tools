(string urlArgument, Dictionary<string, string> options) ParseArgs()
{
    var args = Args; // for debug
    if (args.Count < 1) throw new Exception("Must provide url for request");

    var map = new Dictionary<string, string>();
    if (args.Count > 1)
    {
        for (var i = 1; i < args.Count; i++)
        {
            var currentArg = args[i];
            switch (currentArg)
            {
                case "-r":
                    if (i + 1 >= args.Count) throw new Exception($"Invalid data @ '{currentArg}'");
                    if (args[i + 1].StartsWith("-")) throw new Exception($"Invalid data @ '{currentArg}'");
                    map.Add(currentArg, args[i + 1]);
                    i++;
                    break;
                case "-p":
                    if (i + 1 >= args.Count) throw new Exception($"Invalid data @ '{currentArg}'");
                    if (args[i + 1].StartsWith("-")) throw new Exception($"Invalid data @ '{currentArg}'");
                    map.Add(currentArg, args[i + 1]);
                    i++;
                    break;
                case "-o":
                    if (i + 1 >= args.Count || args[i + 1].StartsWith("-"))
                    {
                        map.Add(currentArg, null);
                    }
                    else
                    {
                        map.Add(currentArg, args[i + 1]);
                        i++;
                    }
                    break;
                default: throw new Exception($"invalid arg '{currentArg}");
            }
        }
    }
    return (args[0], map);
}

(string FileName, string RemoteProxy, string LocalProxy) GetRequestOptions(string requestUrl, Dictionary<string, string> options)
{
    const string defaultRemoteProxy = "https://sharpirofunctions.azurewebsites.net/api/" +
        "GetData?code=dkRNdUZ7GzcFr6Lvc4yXZMd6dRhq2QF4UX48GxF4eRq0/CTuf1aaHw==";

    options.TryGetValue("-r", out string remoteProxy);
    options.TryGetValue("-p", out string localProxy);

    string fileName = null;
    var useFile = options.ContainsKey("-o");
    if (useFile)
    {
        options.TryGetValue("-o", out fileName);
        if (fileName == null)
        {
            fileName = requestUrl.Split("/").Last();
        }
    }

    var environmentLocalProxyUrl = Environment.GetEnvironmentVariable("http_proxy");
    return (fileName, remoteProxy ?? defaultRemoteProxy, localProxy ?? environmentLocalProxyUrl);
}
