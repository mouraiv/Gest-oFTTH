using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Analise
    {
        [Key]
        public int Id_Analise {get; set;}
        public DateTime? DataAnalise {get; set;}
        public string? AnaliseObservacao {get; set;}
        public string? CDOIA {get; set;}
        public string? CDOIAStatus {get; set;}
        public string? CDOIAObs {get; set;}

        public int? Id_StatusAnalise {get; set;}
        public StatusAnalise? GetStatusAnalise {get; set;}
        public int? Id_Tecnico {get; set;}
        public Tecnico? GetTecnico {get; set;}
        public int? Id_TesteOptico {get; set;}
        public TesteOptico? GetTesteOptico {get; set;}
        public int? Id_Validacao {get; set;}
        public Validacao? GetValidacao {get; set;}
    }
}