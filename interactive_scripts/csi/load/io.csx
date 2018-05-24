static MemoryStream ReadSafe(string inputFile)
{
    using (var sourceStream = new FileStream(inputFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
    {
        var memoryStream = new MemoryStream();
        sourceStream.CopyTo(memoryStream);
        return memoryStream;
    }
}

static MemoryStream ReadSafeTemp(string inputFilePath)
{
    var tempDirectory = Path.GetTempPath();
    var fileInfo = new FileInfo(inputFilePath);
    var tempFilePath = $"{tempDirectory}{fileInfo.Name}";
    fileInfo.CopyTo(tempFilePath, overwrite: true);

    MemoryStream memoryStream;
    try
    {
        using (var sourceStream = new FileStream(tempFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
        {
            memoryStream = new MemoryStream();
            sourceStream.CopyTo(memoryStream);
        }
    }
    finally
    {
        File.Delete(tempFilePath);
    }
    return memoryStream;
}