static MemoryStream ReadSafe(string inputFile)
{
    using (var sourceStream = new FileStream(inputFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
    {
        var memoryStream = new MemoryStream();
        sourceStream.CopyTo(memoryStream);
        return memoryStream;
    }
}

static List<string> ReadAllLinesSafe(string filePath)
{
    using (var sourceStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
    {
        var streamReader = new StreamReader(sourceStream);
        var lines = new List<string>();
        string line;
        while ((line = streamReader.ReadLine()) != null)
        {
            lines.Add(line);
        }
        return lines;
    }
}
