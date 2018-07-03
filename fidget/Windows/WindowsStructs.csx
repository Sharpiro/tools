using System;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)]
struct LASTINPUTINFO
{
    public static readonly int SizeOf = Marshal.SizeOf(typeof(LASTINPUTINFO));

    [MarshalAs(UnmanagedType.U4)]
    public int cbSize;
    [MarshalAs(UnmanagedType.U4)]
    public UInt32 dwTime;
}

[StructLayout(LayoutKind.Sequential)]
internal struct INPUT
{
    public uint Type { get; set; }
    public MOUSEKEYBDHARDWAREINPUT Data { get; set; }
}

[StructLayout(LayoutKind.Explicit)]
internal struct MOUSEKEYBDHARDWAREINPUT
{
    [FieldOffset(0)]
    public HARDWAREINPUT Hardware;
    [FieldOffset(0)]
    public KEYBDINPUT Keyboard;
    [FieldOffset(0)]
    public MOUSEINPUT Mouse;
}

internal struct HARDWAREINPUT
{
    public uint Msg { get; set; }
    public ushort ParamL { get; set; }
    public ushort ParamH { get; set; }
}

[StructLayout(LayoutKind.Sequential)]
internal struct KEYBDINPUT
{
    public ushort Vk { get; set; }
    public ushort Scan { get; set; }
    public uint Flags { get; set; }
    public uint Time { get; set; }
    public IntPtr ExtraInfo { get; set; }
}

[StructLayout(LayoutKind.Sequential)]
internal struct MOUSEINPUT
{
    public int X { get; set; }
    public int Y { get; set; }
    public uint MouseData { get; set; }
    public uint Flags { get; set; }
    public uint Time { get; set; }
    public IntPtr ExtraInfo { get; set; }
}