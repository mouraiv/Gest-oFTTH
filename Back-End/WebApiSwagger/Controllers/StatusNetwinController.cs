using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/StatusNetwin")]
   public class StatusNetwinController : Controller
    {
        private readonly IStatusNetwinRepository _StatusNetwinRepository;
  
        public StatusNetwinController(IStatusNetwinRepository StatusNetwinRepository)
        {
            _StatusNetwinRepository = StatusNetwinRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(StatusNetwin StatusNetwin)
        {
            try
            {
                var resultado = await _StatusNetwinRepository.Inserir(StatusNetwin);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, StatusNetwin StatusNetwin)
        {
            try
            {
                
                var resultado = await _StatusNetwinRepository.Editar(id, StatusNetwin);
                          
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
                var resultado = await _StatusNetwinRepository.Deletar(id);

                return Ok("Deletado com sucesso!");
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao deletar: " + ex.Message);
            }
            
        }
        [HttpGet("Listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var resultado = await _StatusNetwinRepository.Listar();

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
       