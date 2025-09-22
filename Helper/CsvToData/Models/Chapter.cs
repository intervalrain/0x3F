namespace CsvToData.Models;

public class Chapter
{
    public string Id { get; set; }
    public string Title { get; set; }
    public List<SubSection> Subsections { get; set; } = [];
}