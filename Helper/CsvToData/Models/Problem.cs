namespace CsvToData.Models;

public class Problem
{
    public string Id { get; set; }
    public int TopicId { get; set; }
    public string? ChapterId { get; set; }
    public string? SubsectionId { get; set; }
    public int Number { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }
    public bool? IsPremium { get; set; } = false;
    public int? Difficulty { get; set; }
    public bool Completed { get; set; }
    public DateTime? CompletedAt { get; set; }
}