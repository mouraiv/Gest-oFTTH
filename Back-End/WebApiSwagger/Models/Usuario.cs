using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Usuario
    {
        [Key]
        public int Id_Usuario {get; set;}
        public string? Login {get; set;}
        public string? Senha {get; set;}
        public int? Tipo {get; set;}
        public int? Publico {get; set;}
        public int? Error {get; set;}
        public Tecnico GetTecnico {get; set;} = null!;
        public StatusLogin StatusLogin {get; set;} = null!;
    }
}