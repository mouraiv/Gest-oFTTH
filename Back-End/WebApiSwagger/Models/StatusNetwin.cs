using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class StatusNetwin
    {
        [Key]
        public int Id_StatusNetwin {get; set;}
        public string? Codigo {get; set;}
        public string? Tipo {get; set;}
        public string? Descricao {get; set;}
        
    }
}