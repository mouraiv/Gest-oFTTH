using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Ligacao
    {
        [Key]
        public int Id_Ligacao {get; set;}
        public string? Projeto {get; set;}
        public int? Cabo {get; set;}
        public string? Celula {get; set;}
        public string? ICX {get; set;}
        public string? DGO {get; set;}
        public string? FibraDGO {get; set;}
        public string? CaboDGO {get; set;}
        public string? SplitterCEOS {get; set;}
        public string? SplitterCDO {get; set;}
        public string? OutSplitterCEOS {get; set;}
        public string? CaboCDO {get; set;}
        public string? FibraCDO {get; set;}
        public string? PortaCDO {get; set;}
        public string? Rede {get; set;}
        public string? EstadoOperacional {get; set;}
        public string? DataEstadoOperacional {get; set;}
        public string? EstadoControle {get; set;}
        public string? DataEstadoControle {get; set;}
    }
}