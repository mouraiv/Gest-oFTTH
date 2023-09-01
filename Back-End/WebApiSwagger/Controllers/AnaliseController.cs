using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [Route("Api/TesteOptico")]
   public class AnaliseController : Controller
    {
         private readonly IAnaliseRepository _analiseRepository;
  
        public AnaliseController(IAnaliseRepository analiseRepository)
        {
            _analiseRepository = analiseRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(AnaliseView analise)
        {
            try
            {
                var modelo = new Analise{

                    Status = analise.Status,
                    DataAnalise =  DateTime.Now,
                    AnaliseObservacao = analise.AnaliseObservacao,
                    CDOIA = analise.CDOIA,
                    CDOIAStatus = analise.CDOIAStatus,
                    CDOIAObs = analise.CDOIAObs,
                    Id_Tecnico = analise.Id_Tecnico,
                    Id_TesteOptico = analise.Id_TesteOptico,
                    Id_Validacao = analise.Id_Validacao
                };

                var resultado = await _analiseRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, AnaliseView analise)
        {
            try
            {
                var modelo = new Analise{

                    Status = analise.Status,
                    DataAnalise = analise.DataAnalise,
                    AnaliseObservacao = analise.AnaliseObservacao,
                    CDOIA = analise.CDOIA,
                    CDOIAStatus = analise.CDOIAStatus,
                    CDOIAObs = analise.CDOIAObs,
                    Id_Tecnico = analise.Id_Tecnico,
                    Id_TesteOptico = analise.Id_TesteOptico,
                    Id_Validacao = analise.Id_Validacao
                };

                var resultado = await _analiseRepository.Editar(id, modelo);
                          
                return Ok("Atualizado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao atualizar: " + ex.Message);
            }
            
        }
        [HttpDelete("Deletar/{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            try
            {
                var resultado = await _analiseRepository.Deletar(id);

                return Ok("Deletado com sucesso!");
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao deletar: " + ex.Message);
            }
            
        }
    }
}
       