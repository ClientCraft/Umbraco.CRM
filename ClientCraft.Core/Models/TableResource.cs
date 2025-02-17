namespace ClientCraft.Core.Models;

public class TableResource<T>
{
    public IEnumerable<Column> Columns { get; set; }
    public IEnumerable<T> Items { get; set; }
}
