using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Empresa
    {
         [Key]
        public int Id_Empresa {get; set;}
        public string? Nome {get; set;}
    }
}