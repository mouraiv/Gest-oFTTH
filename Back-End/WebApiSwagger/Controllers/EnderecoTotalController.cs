using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [Route("Api/EnderecoTotal")]
    public class EnderecoTotalController : Controller
    {
        private readonly IEnderecoTotalRepository _enderecoTotalRepository;

        public EnderecoTotalController(IEnderecoTotalRepository enderecoTotalRepository)
        {
            _enderecoTotalRepository = enderecoTotalRepository;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar(FiltroEnderecoTotal filtro)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.Listar(filtro);

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
        [HttpGet("Carregar/{id}")]
        public async Task<IActionResult> Carregar(int id)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.CarregarId(id);

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
    }
}