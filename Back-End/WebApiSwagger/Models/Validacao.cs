using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Validacao
    {
         [Key]
        public int Id_Validacao {get; set;}
        public string? Nome {get; set;}
    }
}