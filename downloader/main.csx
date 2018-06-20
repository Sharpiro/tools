#! "netcoreapp2.0"

using System.Net;
using System.Net.Http;

if (Args.Count < 2) throw new Exception("Invalid number of arguments");

var environmentProxyUrl = Environment.GetEnvironmentVariable("http_proxy");
WriteLine(environmentProxyUrl);
var proxyFunctionUrl = "https://sharpirotestfunctions.azurewebsites.net/api/HttpTriggerCSharp1?code=O756E2BV0acD9mDbtQ9J3jbZ4rysCcvn9nxhKwcvPmrTD1sXpj4MVw==";
WriteLine(proxyFunctionUrl);
// var requestUrl = "https://raw.githubusercontent.com/Sharpiro/dotnet-script/master/LICENSE";
var requestUrl = Args[0];
WriteLine(requestUrl);
var encodedRequestUrl = Convert.ToBase64String(Encoding.UTF8.GetBytes(requestUrl).Select(Swap).ToArray());
WriteLine(encodedRequestUrl);
var generatedRequestUrl = $"{proxyFunctionUrl}&data={encodedRequestUrl}";
WriteLine(generatedRequestUrl);
var fileName = Args[1];
var httpClientHandler = new HttpClientHandler { Proxy = new WebProxy(environmentProxyUrl) };
var httpClient = environmentProxyUrl == null ? new HttpClient() : new HttpClient(httpClientHandler, disposeHandler: true);

var res = await httpClient.GetAsync(generatedRequestUrl);
var bytes = (await res.Content.ReadAsByteArrayAsync()).Select(Swap).ToArray();

File.WriteAllBytes(fileName, bytes);
static byte Swap(byte @byte)
{
    return (byte)(~@byte & 0xff);
}