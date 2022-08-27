using System.Linq;
using Mechavian.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Sharprompt;
using Sharprompt.Fluent;

namespace <%= projectName %>
{
    class Program : IProgram
    {
        static void Main(string[] args)
        {
            var program = new Program();
            program.Run();
        }

        public void Run()
        {
            var services = new ServiceCollection().AddServicesFromAssembly(typeof(Program).Assembly).AddSingleton<IProgram>(this);
            var serviceProvider = services.BuildServiceProvider();

            while (IsRunning)
            {
                var commands = serviceProvider.GetServices<ICommand>().OrderBy(c => c.Order);

                var command = Prompt.Select<ICommand>(o => o.WithMessage("OPTION: ").WithItems(commands).WithTextSelector(c => c.DisplayText));

                command.Run(serviceProvider).Wait();
            }
        }

        public bool IsRunning { get; set; } = true;

        public void Close()
        {
            IsRunning = false;
        }
    }
}
