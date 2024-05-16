using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class ServicoAssociado
    {
        [Key]
        public int Id_ServicoAssociados {get; set;}
        public string? EstadoHSI {get; set;}
        public string? EstadoAcessoGPON {get; set;}
        public string? EstadoProvPortaFisica {get; set;}
        public string? CFSAcessoGPON { get; set; }
        public string? CodigoSurvey { get; set; }
        public int? Id_EnderecoTotal { get; set; }
        public EnderecoTotal EnderecosTotais { get; set; } = null!;
    }
}