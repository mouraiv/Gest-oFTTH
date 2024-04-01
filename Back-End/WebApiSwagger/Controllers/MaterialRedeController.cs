using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/MaterialRede")]
    public class MaterialRedeController : Controller
    {
        private readonly IMaterialRedeRepository _materialRedeRepository;

        public MaterialRedeController(IMaterialRedeRepository materialRedeRepository)
        {
            _materialRedeRepository = materialRedeRepository;

        }
        [HttpGet("Carregar")]
        public async Task<IActionResult> Carregar([FromQuery] int id)
        {
            try
            {
                var resultado = await _materialRedeRepository.CarregarId(id);

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
        [HttpGet("ListaUnica")]
        public async Task<IActionResult> ListaUnica([FromQuery] 
            string? uf, 
            string? sigla,
            string? estacao,
            string? bairro,
            string? municipio
            )
        {
            try
            {

                var resultado = await _materialRedeRepository.ListaUnica(
                    uf ?? "", 
                    sigla ?? "",
                    estacao ?? "",
                    bairro ?? "",
                    municipio ?? ""
                    );

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