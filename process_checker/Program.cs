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

namespace ConsoleApp1
{
    class Program
    {
        private const string RulesFile = "rules.json";
        private const string LogFile = "debug.log";
        private const string CreationEvent = "__InstanceCreationEvent";
        private const string DeletionEvent = "__InstanceDeletionEvent";

        private static readonly object _object = new object();
        private static Dictionary<string, Rule> _rules;
        private static readonly StreamWriter _logger = new StreamWriter(LogFile);
        private static ManagementEventWatcher _creationWatcher;
        private static ManagementEventWatcher _deletionWatcher;

        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(OnStopRequest);
            _logger.AutoFlush = true;

            var tokenSource = new CancellationTokenSource();
            tokenSource.Token.Register(() => OnStopRequest());

            Log("Big brother is always watching...", showMessageBox: true);

            LoadRulesFile();

            Task.Run(UpdateRulesFile);

            //var creationQuery = new WqlEventQuery(CreationEvent, new TimeSpan(0, 0, 1), "TargetInstance isa \"Win32_Process\"");
            //var deletionQuery = new WqlEventQuery(DeletionEvent, new TimeSpan(0, 0, 1), "TargetInstance isa \"Win32_Process\"");

            Start();
            //var deletionTask = StartLoop(deletionQuery, "deleted", tokenSource.Token);

            //while (true)
            //{
            //    await Task.Delay(-1);
            //}

            Console.ReadLine();
            Log("Requesting close...");
            tokenSource.Cancel();
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

            Log(rule.StartMessage, showMessageBox: true);
        }

        private static void DeletionWatcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            dynamic @event = e.NewEvent;
            var processName = @event["TargetInstance"]["Name"];
            var exists = _rules.TryGetValue(processName, out Rule rule);
            if (!exists) return;

            Log(rule.StopMessage, showMessageBox: true);
        }

        private static void OnStopRequest(object sender = null, EventArgs e = null)
        {
            _creationWatcher.Stop();
            _creationWatcher.Dispose();
            _deletionWatcher.Stop();
            _deletionWatcher.Dispose();
        }


        private static void LoadRulesFile()
        {
            try
            {
                if (!File.Exists(RulesFile)) throw new FileNotFoundException($"Rules not found @ {RulesFile}");

                var json = File.ReadAllText(RulesFile);
                _rules = new Dictionary<string, Rule>(StringComparer.InvariantCultureIgnoreCase);
                JsonConvert.PopulateObject(json, _rules);

                Log("Successfully loaded rules file");
            }
            catch (Exception ex)
            {
                Log(ex);
                throw;
            }
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
                var oldJson = File.ReadAllText(RulesFile);
                (var newHash, var oldHash) = GetHashes(newJson, oldJson);
                if (newHash == oldHash)
                {
                    Log("Rules are up to date");
                    return;
                }

                var testRules = new Dictionary<string, Rule>(StringComparer.InvariantCultureIgnoreCase);
                JsonConvert.PopulateObject(newJson, testRules);
                File.WriteAllText(RulesFile, newJson);
                Log("Successfully updated rules");
            }
            catch (Exception ex)
            {
                Log(new Exception("An error occurred whil updating rules", ex));
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

        //private static async Task StartLoop(WqlEventQuery Query, string name, CancellationToken cancellationToken)
        //{
        //    await Task.Yield();
        //    while (!cancellationToken.IsCancellationRequested)
        //    {
        //        try
        //        {
        //            using (var creationWatcher = new ManagementEventWatcher { Query = Query })
        //            {
        //                Log($"Starting {name}...");
        //                while (true)
        //                {
        //                    dynamic @event = creationWatcher.WaitForNextEvent();
        //                    var processName = @event["TargetInstance"]["Name"];
        //                    if (!_processes.Contains(processName)) continue;

        //                    Log($"Process {processName} has been {name}, path is: {@event["TargetInstance"]["ExecutablePath"]}");
        //                    var message = name == "created" ? $"Hello, {processName}" : $"Goodbye, {processName}";
        //                    _ = Task.Run(() => { Log(message, showMessageBox: true); });
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Log(ex);
        //        }
        //    }
        //}

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
            File.AppendAllText(LogFile, ex.ToString());
        }

        private class Rule
        {
            public string Name { get; set; }
            public string StartMessage { get; set; }
            public string StopMessage { get; set; }
        }
    }
}
