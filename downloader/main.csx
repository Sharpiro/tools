#load "args.csx"

using System.Net;
using System.Net.Http;

async Task Main()
{
    Func<byte, byte> Obfuscate = (byte b) => (byte)~b;
    var (requestUrl, parsedOptions) = ParseArgs();
    var requestOptions = GetRequestOptions(requestUrl, parsedOptions);
    var obfuscatedRequestUrl = Encoding.UTF8.GetBytes(requestUrl).Select(Obfuscate).ToArray();
    var postData = Convert.ToBase64String(obfuscatedRequestUrl);

    WriteLine($"LocalProxy: '{requestOptions.LocalProxy}'");
    WriteLine($"RemoteProxy: '{requestOptions.RemoteProxy}'");
    WriteLine($"RequestUrl: '{requestUrl}'");
    WriteLine($"Post Data: '{postData}'");
    WriteLine("\n------------------------------------------------------------------------------\n");

    var httpClient = requestOptions.LocalProxy == null ?
        new HttpClient() :
        new HttpClient(new HttpClientHandler { Proxy = new WebProxy(requestOptions.LocalProxy) });

    var response = await httpClient.PostAsync(requestOptions.RemoteProxy, new StringContent(postData));
    if (response.StatusCode != HttpStatusCode.OK)
    {
        var reason = await response.Content.ReadAsStringAsync();
        throw new Exception($"Response was not successful.  Reason: '{reason}'");
    }


    var contentBuffer = await response.Content.ReadAsByteArrayAsync();
    var unObfuscatedContent = contentBuffer.Select(Obfuscate).ToArray();

    if (requestOptions.FileName != null)
    {
        File.WriteAllBytes(requestOptions.FileName, unObfuscatedContent);
        return;
    }

    if (unObfuscatedContent.Length < 100_000)
    {
        WriteLine(Encoding.UTF8.GetString(unObfuscatedContent));
        return;
    }

    WriteLine("Data too long to show in console...");
}

await Main();
