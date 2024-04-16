using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class StatusLogin
    {
        [Key]
        public int Id_StatusLogin {get; set;}
        public int? Status {get; set;}
        public DateTime? LoginDate {get; set;}
        public string? Token {get; set;}
        public int? Id_Usuario {get; set;}
       
    }
}