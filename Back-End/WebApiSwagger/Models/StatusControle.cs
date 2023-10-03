using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class StatusControle
    {
        [Key]
        public int Id_StatusControle {get; set;}
        public string? Nome {get; set;}
        
    }
}