using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SimpleMicroservice {
  public class Program {
    public static void Main (string[] args) {
      CreateHostBuilder (args).Build ().Run ();
    }

    public static IHostBuilder CreateHostBuilder (string[] args) {
      return Host.CreateDefaultBuilder (args)
        .ConfigureWebHostDefaults ((webBuilder) => {
          webBuilder.UseKestrel ();
          webBuilder.UseContentRoot (Directory.GetCurrentDirectory ());
          webBuilder.UseUrls ($"http://*:{HostPort}");
          webBuilder.UseIISIntegration ();

          webBuilder.UseStartup<Startup> ();
        });
    }

    private static bool IsDevelopment =>
      Environment.GetEnvironmentVariable ("ASPNETCORE_ENVIRONMENT") == "Development";

    public static string HostPort =>
      IsDevelopment ?
      "5000" :
      Environment.GetEnvironmentVariable ("PORT");
  }
}