public static string GetOneTimeCode(string secret, DateTime date, int codeLifetimeSeconds)
{
    using (var alg = System.Security.Cryptography.HashAlgorithm.Create("sha256"))
    {
        var roundedSeconds = codeLifetimeSeconds * (date.Second / codeLifetimeSeconds);
        var roundedTime = new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, roundedSeconds);
        var ticksBuffer = BitConverter.GetBytes(roundedTime.Ticks);
        var buffer = Encoding.UTF8.GetBytes(secret).Concat(ticksBuffer).ToArray();
        var hash = alg.ComputeHash(alg.ComputeHash(buffer));
        var base64Hash = Convert.ToBase64String(hash);
        return base64Hash;
    }
}
