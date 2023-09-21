using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Tecnico
    {
         [Key]
        public int Id_Tecnico {get; set;}
        public string? Nome {get; set;}
        public string? Email {get; set;}

        public int? Id_Cargo {get; set;}
        public Cargo GetCargo {get; set;} = null!;
        public int? Id_Empresa {get; set;}
        public Empresa GetEmpresa {get; set;} = null!;

    }
}