using System.ComponentModel.DataAnnotations;
public class Diretorio
{
    [Key]
    public int Id_Diretorio { get; set; }
    public string? Server { get; set; }
    public string? Caminho { get; set; }
}