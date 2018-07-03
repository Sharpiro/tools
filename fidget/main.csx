#load "Windows/WindowsApi.csx"

var timeoutArg = Args.Count > 0 ? Args[0] : "120";
var pollingArg = Args.Count > 1 ? Args[1] : "5";

var timeoutSeconds = int.TryParse(timeoutArg, out int y) ? y : 120;
var pollingIntervalSeconds = int.TryParse(pollingArg, out int z) ? z : 5;
var randomInterval = 5;

WriteLine($"Starting Fidget with timeout: '{timeoutSeconds}' and polling interval: '{pollingIntervalSeconds}'");

var windowsApi = new WindowsApi();
var randomizer = new Random();

while (true)
{
    var idleSeconds = windowsApi.GetIdleSeconds();
    if (idleSeconds > pollingIntervalSeconds)
        WriteLine($"idle for {idleSeconds} seconds");
    if (idleSeconds == null) throw new InvalidOperationException("GetIdleSeconds returned null, which should never happen");


    if (idleSeconds >= randomInterval)
    {
        windowsApi.SendInput();
        randomInterval = randomizer.Next(1, timeoutSeconds);
        WriteLine($"Random interval set to {randomInterval} seconds");
    }

    Task.Delay(pollingIntervalSeconds * 1000).Wait();
}
