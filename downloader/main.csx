#load "RequestInfo.csx"
#load "Obfuscation.csx"

using System.Net;
using System.Net.Http;

var byteObfuscator = new ByteSwapper();
var parsedArguments = ParseArgs();
var requstInfo = GetRequestInfo(parsedArguments.urlArgument, parsedArguments.options);
WriteLine($"environmentProxyUrl: '{requstInfo.EnvironmentProxy}'");
WriteLine($"Proxy: '{requstInfo.Proxy}'");
WriteLine($"RequestUrl: '{requstInfo.RequestUrl}'");
WriteLine($"encodedRequestUrl: '{requstInfo.EncodedRequestUrl}'");
WriteLine($"generatedRequestUrl: '{requstInfo.GeneratedRequestUrl}'");

var httpClientHandler = new HttpClientHandler { Proxy = new WebProxy(requstInfo.EnvironmentProxy) };
var httpClient = requstInfo.EnvironmentProxy == null ? new HttpClient() : new HttpClient(httpClientHandler, disposeHandler: true);
var res = await httpClient.GetAsync(requstInfo.GeneratedRequestUrl);
var bytes = (await res.Content.ReadAsByteArrayAsync()).Select(byteObfuscator.Obfuscate).ToArray();

if (requstInfo.FileName != null)
{
    File.WriteAllBytes(requstInfo.FileName, bytes);
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

    var requestInfo = new RequestInfo(byteObfuscator)
    {
        RequestUrl = urlArgument,
        FileName = fileName,
        Proxy = proxy ?? defaultProxy,
    };
    return requestInfo;
}