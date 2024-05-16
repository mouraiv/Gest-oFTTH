using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;
using WebApiSwagger.Models;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/Info")]
    public class InfoController : Controller
    {
        private readonly IInfoRepository _InfoRepository;

        public InfoController(IInfoRepository InfoRepository)
        {
            _InfoRepository = InfoRepository;

        }
        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(Info info)
        {
            try
            {
                var modelo = new Info{
                    Base = info.Base,
                    DataImport = info.DataImport,
                    Atualizar = info.Atualizar,
                    
                };

                var resultado = await _InfoRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }
        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, Info info)
        {
            try
            {
    
                    var modelo = new Info{
                        Base = info.Base,
                        DataImport = info.DataImport,
                        Atualizar = info.Atualizar,
                    
                    };

                var resultado = await _InfoRepository.Editar(id, modelo);
                          
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
                var resultado = await _InfoRepository.Deletar(id);

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
                var resultado = await _InfoRepository.Listar();

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