public interface IByteObfuscator
{
    byte Obfuscate(byte @byte);
}

public class ByteSwapper : IByteObfuscator
{
    public byte Obfuscate(byte @byte)
    {
        return (byte)(~@byte & 0xff);
    }
}