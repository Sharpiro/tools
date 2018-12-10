#r "nuget: Newtonsoft.Json, 11.0.2"

using Newtonsoft.Json;

class FormatTextAsNumberConverter : JsonConverter
{
    public override bool CanRead => false;
    public override bool CanWrite => true;
    public override bool CanConvert(Type type) => type == typeof(string);

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var stringValue = value as string;
        var parseResult = int.TryParse(stringValue, out int number);
        if (parseResult)
        {
            writer.WriteValue(number);
            return;
        }
        writer.WriteValue(stringValue);
    }

    public override object ReadJson(JsonReader reader, Type type, object existingValue, JsonSerializer serializer)
    {
        throw new NotSupportedException();
    }
}