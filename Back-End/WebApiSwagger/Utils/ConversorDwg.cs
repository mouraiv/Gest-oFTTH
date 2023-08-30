using GroupDocs.Conversion;
using GroupDocs.Conversion.Options.Convert;
using GroupDocs.Conversion.Reporting;
using System.Text.RegularExpressions;
namespace WebApiSwagger.Utils
{
    public partial class ConversorDwg : IConverterListener
    {
        public string? InputFilePath { get; set;}
        public byte[] OutputFilePath { get; set;} = null!;
        public bool Convercao { get; set; }
        public int Progresso { get; set; }
        public void ConvertFileInBackground()
        {

            ConverterSettings config = new()
            {
                Listener = this
            };

            var conversionOptions = new PdfConvertOptions();

            conversionOptions.PdfOptions.DocumentInfo.Title = MyRegex().Match(InputFilePath ?? "").Value;

            Converter converter = new(InputFilePath, () => config);

            MemoryStream output = new();

            converter.Convert(() => output, conversionOptions);

            OutputFilePath = output.ToArray();

            converter.Dispose();

        }

        [GeneratedRegex("[^\\\\/:*?\"<>|\\r\\n]+$")]
        private static partial Regex MyRegex();

        public void Started()
        {
            Convercao = true;
        }

        public void Progress(byte current)
        {
            Progresso = current;
        }

        public void Completed()
        {
            Convercao = false;
        }
    }
}