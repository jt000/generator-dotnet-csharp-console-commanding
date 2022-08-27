
namespace <%= projectName %>
{
    interface IProgram
    {
        bool IsRunning { get; }

        void Close();
    }
}