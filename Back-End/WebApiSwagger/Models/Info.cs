using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class Info
    {
        [Key]
        public int Id_info {get; set;}
        public string? Base {get; set;}
        public DateTime? DataImport {get; set;}
        public int? Atualizar {get; set;}
       
    }
}