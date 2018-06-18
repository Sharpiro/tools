#r "ref/Blake2Sharp.dll"

using System.Security.Cryptography;
using Blake2Sharp;

public class Blake2Scripted : HashAlgorithm
{
    private Hasher _hasher = Blake2B.Create();

    public override void Initialize() => _hasher.Init();
    protected override void HashCore(byte[] array, int ibStart, int cbSize) => _hasher.Update(array, ibStart, cbSize);
    protected override byte[] HashFinal() => _hasher.Finish();
    public new static HashAlgorithm Create() => new Blake2Scripted();
}
