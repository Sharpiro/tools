#r "nuget: Newtonsoft.Json, 12.0.1"

#load "args.csx"
#load "auth.csx"

using System.Net;
using System.Net.Http;

async Task Main()
{
    const string secret = "38762a56abf4da28884d818c8cff4b9b3878f7377b2474e4aad0b800b944f13b";
    const int codeLifetimeSeconds = 5;

    var code = GetOneTimeCode(secret, DateTime.UtcNow, codeLifetimeSeconds);
    Func<byte, byte> Obfuscate = (byte b) => (byte)~b;
    var (requestUrl, parsedOptions) = ParseArgs();
    var requestOptions = GetRequestOptions(requestUrl, parsedOptions);
    var obfuscatedRequestUrl = Encoding.UTF8.GetBytes(requestUrl).Select(Obfuscate).ToArray();
    var base64ObfuscatedUrl = Convert.ToBase64String(obfuscatedRequestUrl);
    var postData = new { Code = code, Data = base64ObfuscatedUrl };
    var postDataJson = Newtonsoft.Json.JsonConvert.SerializeObject(postData);

    WriteLine($"LocalProxy: '{requestOptions.LocalProxy}'");
    WriteLine($"RemoteProxy: '{requestOptions.RemoteProxy}'");
    WriteLine($"RequestUrl: '{requestUrl}'");
    WriteLine($"Post Data: '{postDataJson}'");
    WriteLine("\n------------------------------------------------------------------------------\n");

    var httpClient = requestOptions.LocalProxy == null ?
        new HttpClient { Timeout = TimeSpan.FromHours(1) } :
        new HttpClient(new HttpClientHandler { Proxy = new WebProxy(requestOptions.LocalProxy) })
        {
            Timeout = TimeSpan.FromHours(1)
        };

    var response = await httpClient.PostAsync(requestOptions.RemoteProxy, new StringContent(postDataJson));
    if (response.StatusCode != HttpStatusCode.OK)
    {
        var reason = await response.Content.ReadAsStringAsync();
        throw new Exception($"'{(int)response.StatusCode} ({response.ReasonPhrase})'. Message: '{reason}'");
    }

    var content = (await response.Content.ReadAsByteArrayAsync())
        .Select(Obfuscate).ToArray();

    if (requestOptions.FileName != null)
    {
        File.WriteAllBytes(requestOptions.FileName, content);
        return;
    }

    if (content.Length < 100_000)
    {
        WriteLine(Encoding.UTF8.GetString(content));
        return;
    }

    WriteLine("Data too long to show in console...");
}

await Main();
