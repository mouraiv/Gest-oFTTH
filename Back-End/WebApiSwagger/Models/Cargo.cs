using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Cargo
    {
        [Key]
        public int Id_Cargo {get; set;}
        public string? Nome {get; set;}
    }
}