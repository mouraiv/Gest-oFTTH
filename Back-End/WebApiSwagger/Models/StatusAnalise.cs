using System.ComponentModel.DataAnnotations;

namespace End.WebApiSwagger.Models
{
    public class StatusAnalise
    {
        [Key]
        public int Id_StatusAnalise {get; set;}
        public string? Nome {get; set;}
    }
}