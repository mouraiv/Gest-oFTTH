namespace WebApiSwagger.Models.ViewModel
{
    public class AnaliseView
    {
        public int? Id_StatusAnalise {get; set;}
        public DateTime? DataAnalise {get; set;}
        public string? AnaliseObservacao {get; set;}
        public string? CDOIA {get; set;}
        public string? CDOIAStatus {get; set;}
        public string? CDOIAObs {get; set;}
        public int? Id_Tecnico {get; set;}
        public int? Id_TesteOptico {get; set;}
        public int? Id_Validacao {get; set;}
    }
}