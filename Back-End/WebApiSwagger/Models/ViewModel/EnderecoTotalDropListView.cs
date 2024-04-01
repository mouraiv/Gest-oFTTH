using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models.ViewModel
{
    public class EnderecoTotalDropListView
    {
        [Key]
        public int Id_DropEnderecosTotais {get; set;}
        public string? UF { get; set; }
        public string? SiglaEstacao { get; set; }
        public string? NomeAbastecedora { get; set; }
        public string? Cod_Viabilidade { get; set; }
        public string? Bairro { get; set; }
        public string? Municipio { get; set; }
        public string? AnoMes { get; set; }
        public string? GrupoOperacional { get; set; }
        public string? EstadoControle { get; set; }
        public string? EstadoOperacional { get; set; }
    }
}