#load "RequestInfo.csx"
#load "Obfuscation.csx"

using System.Net;
using System.Net.Http;

var byteObfuscator = new ByteSwapper();
var parsedArguments = ParseArgs();
var requestInfo = GetRequestInfo(parsedArguments.urlArgument, parsedArguments.options);
if (requestInfo.IsDebug)
{
    WriteLine($"environmentProxyUrl: '{requestInfo.EnvironmentProxy}'");
    WriteLine($"Proxy: '{requestInfo.Proxy}'");
    WriteLine($"RequestUrl: '{requestInfo.RequestUrl}'");
    WriteLine($"UrlBase64encodedRequestUrl: '{requestInfo.UrlBase64EncodedRequestUrl}'");
    WriteLine($"generatedRequestUrl: '{requestInfo.GeneratedRequestUrl}'\r\n\r\n");
}

var httpClientHandler = new HttpClientHandler { Proxy = new WebProxy(requestInfo.EnvironmentProxy) };
var httpClient = requestInfo.EnvironmentProxy == null ? new HttpClient() : new HttpClient(httpClientHandler, disposeHandler: true);
var res = await httpClient.GetAsync(requestInfo.GeneratedRequestUrl);
if (res.StatusCode != HttpStatusCode.OK)
{
    var reason = await res.Content.ReadAsStringAsync();
    throw new Exception($"Response was not successful.  Reason: '{reason}'");
}

var bytes = (await res.Content.ReadAsByteArrayAsync()).Select(byteObfuscator.Obfuscate).ToArray();

if (requestInfo.FileName != null)
{
    File.WriteAllBytes(requestInfo.FileName, bytes);
    return;
}

WriteLine(Encoding.UTF8.GetString(bytes));

(string urlArgument, Dictionary<string, string> options) ParseArgs()
{
    var tempArgs = Args;
    if (tempArgs.Count < 1) throw new Exception("Must provide url for request");

    var map = new Dictionary<string, string>();
    if (tempArgs.Count > 1)
    {
        for (var i = 1; i < tempArgs.Count; i += 2)
        {
            if (i + 1 >= tempArgs.Count) throw new Exception($"Invalid data @ '{tempArgs[i]}'");
            map.Add(tempArgs[i], tempArgs[i + 1]);
        }
    }

    return (Args[0], map);
}

RequestInfo GetRequestInfo(string urlArgument, Dictionary<string, string> options)
{
    const string defaultProxy = "https://sharpirotestfunctions.azurewebsites.net/api/HttpTriggerCSharp1?code=O756E2BV0acD9mDbtQ9J3jbZ4rysCcvn9nxhKwcvPmrTD1sXpj4MVw==";

    options.TryGetValue("-f", out string fileName);
    options.TryGetValue("-p", out string proxy);
    options.TryGetValue("-d", out string isDebugString);
    bool.TryParse(isDebugString, out bool isDebug);

    var requestInfo = new RequestInfo(byteObfuscator)
    {
        RequestUrl = urlArgument,
        FileName = fileName,
        Proxy = proxy ?? defaultProxy,
        IsDebug = isDebug
    };
    return requestInfo;
}