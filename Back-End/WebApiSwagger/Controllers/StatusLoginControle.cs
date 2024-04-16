using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/StatusLogin")]
   public class StatusLoginController : Controller
    {
        private readonly IStatusLoginRepository _statusLoginRepository;
  
        public StatusLoginController(IStatusLoginRepository statusLoginRepository)
        {
            _statusLoginRepository = statusLoginRepository;
        }

        [HttpGet("Verificar")]
        public async Task<IActionResult> Verificar([FromQuery] int id)
        {
            try
            {
                var resultado = await _statusLoginRepository.CarregarId(id);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao carregar: " + ex.Message);
            }

        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(StatusLogin statusLogin)
        {
            try
            {
                 var modelo = new StatusLogin{
                    Status = statusLogin.Status,
                    LoginDate =  DateTime.Now,
                    Token = statusLogin.Token,
                    Id_Usuario = statusLogin.Id_Usuario
                };

                var resultado = await _statusLoginRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, StatusLogin statusLogin)
        {
            try
            {
                var modelo = new StatusLogin{
                    Id_StatusLogin = _statusLoginRepository.CarregarId(id).Result.Id_StatusLogin,
                    Status = statusLogin.Status,
                    LoginDate =  DateTime.Now,
                    Token = statusLogin.Token,
                    Id_Usuario = statusLogin.Id_Usuario
                };

                var resultado = await _statusLoginRepository.Editar(id, modelo);
                          
                return Ok("Status Login Atualizado");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao atualizar: " + ex.Message);
            }
            
        }
    }
}