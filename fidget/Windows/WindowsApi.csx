#load "WindowsStructs.csx"

using System;
using System.Runtime.InteropServices;

public class WindowsApi
{
    private Random randomizer = new Random();

    public int? GetIdleSeconds()
    {
        var lastInputInfo = new LASTINPUTINFO();
        lastInputInfo.cbSize = Marshal.SizeOf(lastInputInfo);
        var success = GetLastInputInfo(ref lastInputInfo);
        if (!success) return null;
        var idleTicks = Environment.TickCount - lastInputInfo.dwTime;
        var idleSeconds = (int)Math.Round((double)idleTicks / 1000);
        return idleSeconds;
    }

    public void SendInput()
    {
        var input = new INPUT
        {
            Type = 1,
            Data = new MOUSEKEYBDHARDWAREINPUT
            {
                Keyboard = new KEYBDINPUT
                {
                    Vk = 0x79,
                    Scan = 0,
                    Flags = 0,
                    Time = 0,
                    ExtraInfo = IntPtr.Zero
                }
            }
        };
        SendInput(1, new[] { input }, Marshal.SizeOf(typeof(INPUT)));
    }

    public void SetCursorPosition(int x, int y)
    {
        SetCursorPos(x, y);
    }

    public void SetCursorPositionRandom(int x, int y)
    {
        var randX = randomizer.Next(2, x);
        var randY = randomizer.Next(2, y);
        SetCursorPos(x, y);
    }

    [DllImport("user32")]
    private static extern bool SetCursorPos(int x, int y);

    [DllImport("user32")]
    private static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern uint SendInput(uint numberOfInputs, INPUT[] inputs, int sizeOfInputStructure);
}
