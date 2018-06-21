#load "Obfuscation.csx"

class RequestInfo
{
    private readonly IByteObfuscator _byteObfuscator;

    public string RequestUrl { get; set; }
    public string FileName { get; set; }
    public string Proxy { get; set; }
    public string EnvironmentProxy => Environment.GetEnvironmentVariable("http_proxy");
    public string EncodedRequestUrl => Convert.ToBase64String(Encoding.UTF8.GetBytes(RequestUrl).Select(_byteObfuscator.Obfuscate).ToArray());
    public string GeneratedRequestUrl => $"{Proxy}&data={EncodedRequestUrl}";
    public bool IsDebug { get; set; }

    public RequestInfo(IByteObfuscator byteObfuscator)
    {
        _byteObfuscator = byteObfuscator;
    }
}