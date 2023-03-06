using System;
using System.Threading.Tasks;
using Mechavian.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

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