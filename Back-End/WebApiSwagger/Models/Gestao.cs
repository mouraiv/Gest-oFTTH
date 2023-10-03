using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Gestao
    {
        [Key]
        public int Id_Gestao {get; set;}
        public string? EstadoProjeto { get; set; }
        public string? EstadoControle { get; set; }
        public DateTime? DataAceitacao { get; set; }
        public string? MesAceitacao { get; set; }
        public DateTime? DataRecebimento { get; set; }
        public string? AnaliseTipo { get; set; }
        public string? AnaliseStatus { get; set; }
        public string? AnaliseData { get; set; }
        public string? Analista { get; set; }
        public string? AnaliseObs { get; set; }
        public string? FiscalizacaoTipo { get; set; }
        public string? FiscalizacaoStatus { get; set; }
        public string? FiscalizacaoEnvio { get; set; }
        public string? FiscalizacaoRecebimento { get; set; }
        public string? Fiscal { get; set; }
        public string? FiscalizacaoObs { get; set; }
        public int? Meta { get; set; }
        public int? DiaRec { get; set; }
        public int? MesRec { get; set; }
        public int? AnoRec { get; set; }
        public int? OrdemCDO { get; set; }
        public int? Sel { get; set; }
        public int? Id_TesteOptico { get; set; }
        public TesteOptico? GetTesteOptico {get; set;}
        
    }
}