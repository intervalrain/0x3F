namespace CsvToData.Models;

public class SubSection
{
    public string Id { get; set; }
    public string Title { get; set; }
    public List<Problem> Problems { get; set; } = [];
}