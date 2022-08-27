using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using CsvHelper.Configuration.Attributes;
using Mechavian.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Sharprompt;
using Sharprompt.Fluent;

namespace <%= projectName %>
{
    [Service(typeof(ICommand), ServiceLifetime = ServiceLifetime.Transient)]
    class ExitCommand : ICommand
    {
        public int Order { get; } = int.MaxValue;
        public string DisplayText { get; } = "Quit";

        public Task Run(IServiceProvider services)
        {
            services.GetRequiredService<IProgram>().Close();
            return Task.CompletedTask;
        }
    }
}