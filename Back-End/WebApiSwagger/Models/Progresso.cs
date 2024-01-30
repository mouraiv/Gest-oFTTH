
namespace WebApiSwagger.Models
{
    public class Progresso
    {
        public bool Start {get; set;}
        public int Contador {get; set;}
        public string Descricao {get; set;} = null!;
        public int Total {get; set;}

    }
}