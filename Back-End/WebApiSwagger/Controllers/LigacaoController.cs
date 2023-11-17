using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Ligacao")]
    public class LigacaoController : Controller
    {
        private readonly ILigacaoRepository _ligacaoRepository;

        public LigacaoController(ILigacaoRepository ligacaoRepository)
        {
            _ligacaoRepository = ligacaoRepository;

        }
        [HttpGet("Carregar")]
        public async Task<IActionResult> Carregar([FromQuery] int id)
        {
            try
            {
                var resultado = await _ligacaoRepository.CarregarId(id);

                if (resultado == null)
                {
                    return NotFound(); 
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
             
        }
         [HttpGet("ListarCarregarId")]
        public async Task<IActionResult> ListarCarregarId([FromQuery] int? id)
        {
            try
            {
                var resultado = await _ligacaoRepository.ListarCarregarId(id);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }
    }
}