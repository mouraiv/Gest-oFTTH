using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Analise
    {
        [Key]
        public int Id_Analise {get; set;}
        public string? Status {get; set;}
        public string? Analista {get; set;}
        public DateTime? DataAnalise {get; set;}
        public string? AnaliseObservacao {get; set;}
        public int? Id_TesteOptico {get; set;}
        public ICollection<AnaliseCDOIA> AnaliseCDOIAs {get;} = new List<AnaliseCDOIA>();
    }
}