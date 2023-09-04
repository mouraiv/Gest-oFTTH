using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class StatusAnalise
    {
        [Key]
        public int Id_StatusAnalise {get; set;}
        public string? Nome {get; set;}
    }
}