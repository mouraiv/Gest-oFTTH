﻿using WebApiSwagger.Models;
using WebApiSwagger.Filters;
using WebApiSwagger.Utils;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Repository.Interface
{
    public interface IEnderecoTotalRepository
    {
        Task<EnderecoTotal> CarregarId(int? id_MaterialRede, string? survey, bool filterSurvey);
        Task<IEnumerable<EnderecoTotal>> ListarCarregarId(int? id_MaterialRede);
        Task<IEnumerable<EnderecoTotal>> Listar(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, PainelGanho painelGanho, Paginacao paginacao, int pageOff);
        Task<IEnumerable<EnderecoTotal>> BaseAcumulada(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao);
        Task<IEnumerable<EnderecoTotal>> ListarGanho(IProgressoRepository progressoRepository, FiltroEnderecoTotal filtro, Paginacao paginacao, PainelGanho painelGanho);
        Task<IEnumerable<EnderecoTotalDropFilter>> ListaUnica();
        Task<IEnumerable<LocalidadeDropFilter>> ListaUnicaLocalidade(FiltroEnderecoTotal filtro);
    }
}
