#r "nuget: TakeIo.Spreadsheet, 1.0.0.16"

using TakeIo.Spreadsheet;
using System.Reflection;

static IList<IList<string>> sheet(string filePath) => Spreadsheet.Read(new FileInfo(filePath));

static IEnumerable<T> sheet<T>(string filePath)
{
    var fileInfo = new FileInfo(filePath);
    if (!fileInfo.Exists) throw new FileNotFoundException($"File not found @ '{filePath}'");
    var tempFilePath = $"{Path.GetTempPath()}{fileInfo.Name}";

    IList<IList<string>> sheet;
    var tempFileInfo = new FileInfo(tempFilePath);
    try
    {
        fileInfo.CopyTo(tempFilePath, overwrite: true);
        sheet = Spreadsheet.Read(tempFileInfo);
        tempFileInfo.Delete();
    }
    catch (Exception)
    {
        tempFileInfo.Delete();
        throw;
    }

    if (!sheet.Any()) throw new Exception("Spreadsheet was empty");

    var properties = typeof(T).GetProperties();
    var firstRow = sheet.First();
    if (firstRow.Count != properties.Length) throw new Exception("Number of object public properties must equal spreadsheet columns");

    for (var i = 0; i < firstRow.Count; i++)
    {
        if (firstRow[i].ToLowerInvariant() != properties[i].Name.ToLowerInvariant())
        {
            throw new Exception("Object properties must be provided in same order as spreadsheet");
        }
    }

    for (var i = 1; i < sheet.Count; i++)
    {
        var row = sheet[i];
        var tInstance = Activator.CreateInstance<T>();
        for (var j = 0; j < row.Count; j++)
        {
            try
            {
                var value = getValue(properties[j], row[j]);
                properties[j].SetValue(tInstance, value);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred @ row '{i + 1}', column '{(char)(j + 'A')}'\r\n{ex.Message}", ex);
            }
        }
        yield return tInstance;
    }

    object getValue(PropertyInfo propertyInfo, string data)
    {
        if (propertyInfo.PropertyType.IsGenericType)
        {
            var genericArgumentName = propertyInfo.PropertyType.GenericTypeArguments[0].Name;
            switch (genericArgumentName)
            {
                case "DateTime":
                    DateTime.TryParse(data, out DateTime value);
                    return value == DateTime.MinValue ? null : (DateTime?)value;
                default: throw new InvalidCastException($"Unable to cast to generic argument '{genericArgumentName}' on type '{propertyInfo.PropertyType.Name}'");
            }
        }
        switch (propertyInfo.PropertyType.Name)
        {
            case "String":
                return data;
            case "Boolean":
                return bool.Parse(data);
            case "Byte":
                return byte.Parse(data);
            case "Int32":
                return int.Parse(data);
            case "Single":
                return float.Parse(data);
            case "Double":
                return double.Parse(data);
            case "DateTime":
                return DateTime.Parse(data);
            default: throw new InvalidCastException($"Unable to cast to type '{propertyInfo.PropertyType.Name}'");
        }
    }
}