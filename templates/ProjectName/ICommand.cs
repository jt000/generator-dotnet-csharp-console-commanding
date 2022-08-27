
using System;
using System.Threading.Tasks;

namespace <%= projectName %>
{
    interface ICommand
    {
        public int Order { get; }
        public string DisplayText { get; }
        public Task Run(IServiceProvider services);
    }
}