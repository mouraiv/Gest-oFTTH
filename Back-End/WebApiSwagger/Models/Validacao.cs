using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Validacao
    {
        [Key]
        public int Id_Validacao {get; set;}
        public DateTime? DataValidacao {get; set;}
        public string? Tecnico {get; set;}
        public int? Id_TesteOptico {get; set;} 
        public string? Status {get; set;}
    }
}