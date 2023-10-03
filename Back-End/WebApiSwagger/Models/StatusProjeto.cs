using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class StatusProjeto
    {
        [Key]
        public int Id_StatusProjeto {get; set;}
        public string? Nome {get; set;}
        
    }
}