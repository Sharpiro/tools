using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Management;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Security.Cryptography;
using System.Text;
using System.Linq;

namespace dotnet
{
    class Program
    {
        private const string CreationEvent = "__InstanceCreationEvent";
        private const string DeletionEvent = "__InstanceDeletionEvent";

        private static readonly string AppDir = $"{Environment.GetEnvironmentVariable("appdata")}\\bigbro";
        private static readonly string RulesFile = $"{AppDir}\\rules.json";
        private static readonly string LogFile = $"{AppDir}\\debug.log";
        private static readonly object _object = new object();
        private static Dictionary<string, Rule> _rules;
        private static StreamWriter _logger;
        private static ManagementEventWatcher _creationWatcher;
        private static ManagementEventWatcher _deletionWatcher;
        private static bool _initialized;

        static async Task Main(string[] args)
        {
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(OnStopRequest);
            Directory.CreateDirectory(AppDir);
            _logger = new StreamWriter(LogFile, append: true);
            _logger.AutoFlush = true;

            var tokenSource = new CancellationTokenSource();
            tokenSource.Token.Register(() => OnStopRequest());

            var initialMessageTask = Task.Delay(TimeSpan.FromSeconds(15)).ContinueWith((_) => ShowNotification("Big brother is always watching..."));

            try
            {
                LoadRulesFile();
                Start();
                _initialized = true;
            }
            catch(Exception ex)
            {
                Log(ex);
            }

            try
            {
                await Task.Delay(TimeSpan.FromSeconds(15));
                await Task.Run(UpdateRulesFile);
            }
               catch(Exception ex)
            {
                Log(ex);
            }

            await initialMessageTask;
            if (!_initialized) return;
            
            await Task.Delay(-1);
            // Console.ReadLine();
            // Log("Requesting close...");
            // tokenSource.Cancel();
            // Task.Delay(TimeSpan.FromSeconds(2)).Wait();
        }

        private static void Start()
        {
            var creationQuery = new WqlEventQuery(CreationEvent, new TimeSpan(0, 0, 1), "TargetInstance isa \"Win32_Process\"");

            _creationWatcher = new ManagementEventWatcher { Query = creationQuery };
            Log($"Starting creation...");
            _creationWatcher.EventArrived += CreationWatcher_EventArrived;
            _creationWatcher.Start();

            var deletionQuery = new WqlEventQuery(DeletionEvent, new TimeSpan(0, 0, 1), "TargetInstance isa \"Win32_Process\"");
            _deletionWatcher = new ManagementEventWatcher { Query = deletionQuery };
            Log($"Starting deletion...");
            _deletionWatcher.EventArrived += DeletionWatcher_EventArrived;
            _deletionWatcher.Start();
        }

        private static void CreationWatcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            dynamic @event = e.NewEvent;
            var processName = @event["TargetInstance"]["Name"];
            var exists = _rules.TryGetValue(processName, out Rule rule);
            if (!exists) return;

            ShowNotification(rule.StartMessage);
        }

        private static void DeletionWatcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            dynamic @event = e.NewEvent;
            var processName = @event["TargetInstance"]["Name"];
            var exists = _rules.TryGetValue(processName, out Rule rule);
            if (!exists) return;

            ShowNotification(rule.StopMessage);
        }

        private static void OnStopRequest(object sender = null, EventArgs e = null)
        {
            if (!_initialized) return;
            
            _creationWatcher.Stop();
            _creationWatcher.Dispose();
            _deletionWatcher.Stop();
            _deletionWatcher.Dispose();
            Log("Closing...");
        }


        private static void LoadRulesFile()
        {
            if (!File.Exists(RulesFile)) throw new FileNotFoundException($"Rules not found @ {RulesFile}");

            var json = File.ReadAllText(RulesFile);
            _rules = new Dictionary<string, Rule>(StringComparer.InvariantCultureIgnoreCase);
            JsonConvert.PopulateObject(json, _rules);

            Log("Successfully loaded rules file");
        }

        private static async Task UpdateRulesFile()
        {
            try
            {
                var rulesUrl = "https://statichostsharp.blob.core.windows.net/misc/rules.json";
                var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(rulesUrl);
                if (!response.IsSuccessStatusCode) return;

                var newJson = await response.Content.ReadAsStringAsync();
                if (File.Exists(RulesFile))
                {
                    var oldJson = File.ReadAllText(RulesFile);
                    (var newHash, var oldHash) = GetHashes(newJson, oldJson);
                    if (newHash == oldHash)
                    {
                        Log("Rules are up to date");
                        return;
                    }
                }

                var testRules = new Dictionary<string, Rule>(StringComparer.InvariantCultureIgnoreCase);
                JsonConvert.PopulateObject(newJson, testRules);
                File.WriteAllText(RulesFile, newJson);
                Log("Successfully updated rules");
            }
            catch (Exception ex)
            {
                Log(new Exception("An error occurred while updating rules", ex));
            }
        }

        private static (string NewHash, string OldHash) GetHashes(string newData, string oldData)
        {
            using (var sha256 = HashAlgorithm.Create(HashAlgorithmName.SHA256.Name))
            {
                var newHash = string.Join(string.Empty, sha256.ComputeHash(Encoding.UTF8.GetBytes(newData)).Select(b => b.ToString("x2")));
                var oldHash = string.Join(string.Empty, sha256.ComputeHash(Encoding.UTF8.GetBytes(oldData)).Select(b => b.ToString("x2")));
                return (newHash, oldHash);
            }
        }

        private static void Log(string message, bool showMessageBox = false)
        {
            Console.WriteLine(message);
            _logger.WriteLine(message);
            if (showMessageBox)
            {
                Task.Run(() => MessageBox.Show(message));
            }
        }

        private static void Log(Exception ex)
        {
            Console.WriteLine(ex);
            _logger.WriteLine(ex.ToString());
        }

        private static void ShowNotification(string message)
        {
            using (var notification = new NotifyIcon()
            {
                Visible = true,
                Icon = System.Drawing.SystemIcons.Information,
                BalloonTipTitle = "Big Bro",
                BalloonTipText = message
            })
            {
                notification.ShowBalloonTip(5000);
                 Console.WriteLine("notify: " + message);
                _logger.WriteLine("notify: " + message);
            }
        }

        private class Rule
        {
            public string Name { get; set; }
            public string StartMessage { get; set; }
            public string StopMessage { get; set; }
        }
    }
}

//static Form TopMostForm()
//{
//    var topmostForm = new Form
//    {
//        Size = new Size(1, 1),
//        StartPosition = FormStartPosition.Manual
//    };
//    var rect = SystemInformation.VirtualScreen;
//    topmostForm.Location = new Point(rect.Bottom + 10, rect.Right + 10);
//    topmostForm.Show();
//    topmostForm.Focus();
//    topmostForm.BringToFront();
//    topmostForm.TopMost = true;
//    return topmostForm;
//    MessageBox.Show(TopMostForm(), "hello world");
//}
