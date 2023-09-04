using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Empresa")]
    public class EmpresaController : Controller
    {
        private readonly IEmpresaRepository _EmpresaRepository;
  
        public EmpresaController(IEmpresaRepository EmpresaRepository)
        {
            _EmpresaRepository = EmpresaRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(Empresa Empresa)
        {
            try
            {
                var resultado = await _EmpresaRepository.Inserir(Empresa);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, Empresa Empresa)
        {
            try
            {
                var resultado = await _EmpresaRepository.Editar(id, Empresa);
                          
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
                var resultado = await _EmpresaRepository.Deletar(id);

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
                var resultado = await _EmpresaRepository.Listar();

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