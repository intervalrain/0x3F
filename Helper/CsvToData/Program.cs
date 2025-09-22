using System.Text.Json;
using System.Text.Json.Serialization;
using CsvToData.Models;

namespace CsvToData;

public class Program
{
    public static void Main()
    {
        var filePath = "../../sample.csv";

        if (File.Exists(filePath))
        {
            var reader = new StreamReader(File.OpenRead(filePath));
            var lines = new List<string>();

            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine();
                if (!string.IsNullOrEmpty(line))
                    lines.Add(line);
            }

            reader.Close();

            // Skip header line
            if (lines.Count > 0)
                lines.RemoveAt(0);

            var topics = Parse(lines);

            // Output or process the parsed data
            Console.WriteLine($"Parsed {topics.Count} topics");

            // Generate JSON output
            var outputPath = "../../src/data/allTopicsData.json";
            GenerateJsonOutput(topics, outputPath);
        }
        else
        {
            Console.WriteLine($"File not found: {filePath}");
        }
    }

    public record ParseInfo(
        int TopicId,
        string TopicName,
        string ChapterName,
        string SubsectionName,
        int ProblemNumber,
        string ProblemTitle,
        string Url,
        int? Difficulty,
        bool IsPremium);
    

    public static List<List<Chapter>> Parse(List<string> lines)
    {
        Dictionary<int, List<Chapter>> topicChapters = [];
        Dictionary<int, Dictionary<string, int>> chapterIndices = [];
        Dictionary<int, Dictionary<string, Dictionary<string, int>>> subsectionIndices = [];

        foreach (var line in lines)
        {
            var parts = ParseCsvLine(line);
            if (parts.Length < 9) continue;

            var info = new ParseInfo(
                int.Parse(parts[0]),
                parts[1],
                parts[2],
                parts[3],
                int.Parse(parts[4]),
                parts[5],
                parts[6],
                int.TryParse(parts[7], out int diffResult) ? diffResult : null,
                bool.Parse(parts[8]));

            // Initialize topic if not exists
            if (!topicChapters.TryGetValue(info.TopicId, out var chapters))
            {
                chapters = [];
                topicChapters[info.TopicId] = chapters;
                chapterIndices[info.TopicId] = [];
                subsectionIndices[info.TopicId] = [];
            }

            // Initialize chapter if not exists
            if (!chapterIndices[info.TopicId].TryGetValue(info.ChapterName, out var chapterIndex))
            {
                var chapterId = GenerateChapterId(info.ChapterName);
                chapterIndex = topicChapters[info.TopicId].Count;
                chapterIndices[info.TopicId][info.ChapterName] = chapterIndex;
                subsectionIndices[info.TopicId][info.ChapterName] = [];

                topicChapters[info.TopicId].Add(new Chapter
                {
                    Id = chapterId,
                    Title = info.ChapterName,
                    Subsections = []
                });
            }

            var chapter = topicChapters[info.TopicId][chapterIndex];

            // Initialize subsection if not exists
            if (!subsectionIndices[info.TopicId][info.ChapterName].TryGetValue(info.SubsectionName, out var subsectionIndex))
            {
                var subsectionId = GenerateSubsectionId(info.SubsectionName);
                subsectionIndex = chapter.Subsections.Count;
                subsectionIndices[info.TopicId][info.ChapterName][info.SubsectionName] = subsectionIndex;

                chapter.Subsections.Add(new SubSection
                {
                    Id = subsectionId,
                    Title = info.SubsectionName,
                    Problems = []
                });
            }

            var subsection = chapter.Subsections[subsectionIndex];

            // Create problem
            var problem = new Problem
            {
                Id = $"lc{info.ProblemNumber}",
                TopicId = info.TopicId,
                ChapterId = chapter.Id,
                SubsectionId = subsection.Id,
                Number = info.ProblemNumber,
                Title = info.ProblemTitle,
                Url = info.Url,
                IsPremium = info.IsPremium,
                Difficulty = info.Difficulty > 0 ? info.Difficulty : null, // 只有大於0才設置
                Completed = false,
                CompletedAt = null // 不設置完成時間
            };

            subsection.Problems.Add(problem);
        }

        // Convert to list format
        List<List<Chapter>> result = [];
        foreach (var kvp in topicChapters.OrderBy(x => x.Key))
        {
            result.Add(kvp.Value);
        }

        return result;
    }

    private static string[] ParseCsvLine(string line)
    {
        List<string> result = [];
        var current = "";
        bool inQuotes = false;

        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];

            if (c == '"')
            {
                inQuotes = !inQuotes;
            }
            else if (c == ',' && !inQuotes)
            {
                result.Add(current.Trim());
                current = "";
            }
            else
            {
                current += c;
            }
        }

        result.Add(current.Trim());
        return result.ToArray();
    }

    private static string GenerateChapterId(string chapterName)
    {
        // Extract meaningful part from chapter name for ID
        // 檢查不定長必須在定長之前，因為"不定長滑動視窗"包含"定長滑動視窗"
        if (chapterName.Contains("不定長滑動視窗") || chapterName.Contains("Variable-Length"))
            return "variable-length";
        if (chapterName.Contains("定長滑動視窗") || chapterName.Contains("Fixed-Length"))
            return "fixed-length";

        // Default fallback - convert to lowercase and replace spaces/punctuation
        return chapterName.ToLower()
            .Replace("、", "-")
            .Replace("（", "-")
            .Replace("）", "")
            .Replace("(", "-")
            .Replace(")", "")
            .Replace(" ", "-")
            .Replace(".", "")
            .Trim('-');
    }

    private static string GenerateSubsectionId(string subsectionName)
    {
        // Extract meaningful part from subsection name for ID
        if (subsectionName.Contains("基礎") || subsectionName.Contains("Basic"))
            return subsectionName.Contains("定長") ? "fixed-basic" :
                   subsectionName.Contains("不定長") ? "variable-basic" : "basic";
        if (subsectionName.Contains("進階") || subsectionName.Contains("Advanced"))
            return subsectionName.Contains("定長") ? "fixed-advanced" :
                   subsectionName.Contains("不定長") ? "variable-advanced" : "advanced";
        if (subsectionName.Contains("最長") || subsectionName.Contains("Longest"))
            return "variable-longest";
        if (subsectionName.Contains("最短") || subsectionName.Contains("Shortest"))
            return "variable-shortest";

        // Default fallback
        return subsectionName.ToLower()
            .Replace("§", "")
            .Replace(".", "")
            .Replace(" ", "-")
            .Replace("（", "-")
            .Replace("）", "")
            .Replace("(", "-")
            .Replace(")", "")
            .Trim('-');
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    private static void GenerateJsonOutput(List<List<Chapter>> topics, string outputPath)
    {

        try
        {
            // Create the output directory if it doesn't exist
            var outputDir = Path.GetDirectoryName(outputPath);
            if (!string.IsNullOrEmpty(outputDir) && !Directory.Exists(outputDir))
            {
                Directory.CreateDirectory(outputDir);
            }

            // Generate TypeScript export structure
            var tsContent = GenerateTypeScriptExports(topics);
            var tsPath = Path.ChangeExtension(outputPath, ".ts");
            File.WriteAllText(tsPath, tsContent);

            // Also generate pure JSON for reference
            var json = JsonSerializer.Serialize(topics, JsonOptions);
            File.WriteAllText(outputPath, json);

            Console.WriteLine($"Generated TypeScript exports: {tsPath}");
            Console.WriteLine($"Generated JSON: {outputPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating output: {ex.Message}");
        }
    }

    private static string GenerateTypeScriptExports(List<List<Chapter>> topics)
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine("import { Chapter } from '../types';");
        sb.AppendLine();

        for (int i = 0; i < topics.Count; i++)
        {
            var topicChapters = topics[i];
            if (topicChapters.Count == 0) continue;

            var topicId = i + 1; // Assuming 1-based indexing

            // Generate topic name based on chapter titles
            var topicName = GetTopicName(topicChapters);
            var variableName = GetVariableName(topicName);

            sb.AppendLine($"// Topic {topicId}: {topicName}");
            sb.AppendLine($"export const {variableName}Chapters: Chapter[] = [");

            for (int j = 0; j < topicChapters.Count; j++)
            {
                var chapter = topicChapters[j];
                sb.AppendLine("  {");
                sb.AppendLine($"    id: '{chapter.Id}',");
                sb.AppendLine($"    title: '{EscapeString(chapter.Title)}',");
                sb.AppendLine("    subsections: [");

                for (int k = 0; k < chapter.Subsections.Count; k++)
                {
                    var subsection = chapter.Subsections[k];
                    sb.AppendLine("      {");
                    sb.AppendLine($"        id: '{subsection.Id}',");
                    sb.AppendLine($"        title: '{EscapeString(subsection.Title)}',");
                    sb.AppendLine("        problems: [");

                    for (int l = 0; l < subsection.Problems.Count; l++)
                    {
                        var problem = subsection.Problems[l];
                        sb.AppendLine("          {");
                        sb.AppendLine($"          \"id\": \"{problem.Id}\",");
                        sb.AppendLine($"          \"topicId\": {problem.TopicId},");
                        sb.AppendLine($"          \"chapterId\": \"{problem.ChapterId}\",");
                        sb.AppendLine($"          \"subsectionId\": \"{problem.SubsectionId}\",");
                        sb.AppendLine($"          \"number\": \"{problem.Number}\",");
                        sb.AppendLine($"          \"title\": \"{EscapeString(problem.Title)}\",");
                        sb.AppendLine($"          \"url\": \"{problem.Url}\",");
                        sb.Append($"          \"completed\": {problem.Completed.ToString().ToLower()}");
                        if (problem.Difficulty > 0)
                        {
                            sb.AppendLine($",");
                            sb.Append($"          \"difficulty\": {problem.Difficulty}");
                        }
                        sb.AppendLine();
                        sb.Append(l == subsection.Problems.Count - 1 ? "}" : "},");
                        sb.AppendLine();
                    }

                    sb.AppendLine("        ]");
                    sb.Append(k == chapter.Subsections.Count - 1 ? "      }" : "      },");
                    sb.AppendLine();
                }

                sb.AppendLine("    ]");
                sb.Append(j == topicChapters.Count - 1 ? "  }" : "  },");
                sb.AppendLine();
            }

            sb.AppendLine("];");
            sb.AppendLine();
        }

        return sb.ToString();
    }

    private static string GetTopicName(List<Chapter> chapters)
    {
        if (chapters.Count == 0) return "Unknown Topic";

        var firstChapterTitle = chapters[0].Title;
        if (firstChapterTitle.Contains("滑動視窗") || firstChapterTitle.Contains("雙指針"))
            return "滑動視窗與雙指針 (Sliding Window and Two Pointers)";

        return "Unknown Topic";
    }

    private static string GetVariableName(string topicName)
    {
        if (topicName.Contains("滑動視窗") || topicName.Contains("Sliding Window"))
            return "slidingWindow";

        return "unknownTopic";
    }

    private static string EscapeString(string input)
    {
        return input.Replace("\"", "\\\"").Replace("'", "\\'");
    }
}