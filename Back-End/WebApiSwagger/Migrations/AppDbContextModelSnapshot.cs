﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApiSwagger.Context;

#nullable disable

namespace WebApiSwagger.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("WebApiSwagger.Models.Analise", b =>
                {
                    b.Property<int>("Id_Analise")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_Analise"));

                    b.Property<string>("CDOIA")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DataAnalise")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Id_StatusAnalise")
                        .HasColumnType("int");

                    b.Property<int?>("Id_StatusOptico")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Tecnico")
                        .HasColumnType("int");

                    b.Property<int?>("Id_TesteOptico")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Validacao")
                        .HasColumnType("int");

                    b.Property<string>("Observacao")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ObservacaoCDOIA")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StatusCDOIA")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Analise");

                    b.HasIndex("Id_StatusAnalise");

                    b.HasIndex("Id_StatusOptico");

                    b.HasIndex("Id_Tecnico");

                    b.HasIndex("Id_TesteOptico");

                    b.HasIndex("Id_Validacao");

                    b.ToTable("Analises");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Cargo", b =>
                {
                    b.Property<int>("Id_Cargo")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_Cargo"));

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Cargo");

                    b.ToTable("Cargos");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Empresa", b =>
                {
                    b.Property<int>("Id_Empresa")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_Empresa"));

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Empresa");

                    b.ToTable("Empresas");
                });

            modelBuilder.Entity("WebApiSwagger.Models.EnderecoTotal", b =>
                {
                    b.Property<int>("Id_EnderecoTotal")
                        .HasColumnType("int");

                    b.Property<string>("Bairro")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CDO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CEP")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Celula")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CodSurvey")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("CodViabilidade")
                        .HasColumnType("int");

                    b.Property<string>("Complemento")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DispComercial")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Id_Ligacao")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Material")
                        .HasColumnType("int");

                    b.Property<string>("Logradouro")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Municipio")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Numero")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sigla")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TipoRede")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TipoViabilidade")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UF")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("UMS")
                        .HasColumnType("int");

                    b.HasKey("Id_EnderecoTotal");

                    b.HasIndex("Id_Material");

                    b.ToTable("EnderecosTotais");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Ligacao", b =>
                {
                    b.Property<int>("Id_Ligacao")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_Ligacao"));

                    b.Property<int?>("Cabo")
                        .HasColumnType("int");

                    b.Property<string>("CaboCDO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CaboDGO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Celula")
                        .HasColumnType("int");

                    b.Property<string>("DGO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FibraCDO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FibraDGO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ICX")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("InfraEstrutura")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OutSplitterCEOS")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PortaCDO")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Projeto")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Rede")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SplitterCEOS")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Ligacao");

                    b.ToTable("Ligacoes");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Material", b =>
                {
                    b.Property<int?>("Id_Material")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int?>("Id_Material"));

                    b.Property<string>("DataEstadoControle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DataEstadoOperacional")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EstadoControle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EstadoOperacional")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Material");

                    b.ToTable("Materiais");
                });

            modelBuilder.Entity("WebApiSwagger.Models.StatusAnalise", b =>
                {
                    b.Property<int>("Id_StatusAnalise")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_StatusAnalise"));

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_StatusAnalise");

                    b.ToTable("StatusAnalises");
                });

            modelBuilder.Entity("WebApiSwagger.Models.StatusOptico", b =>
                {
                    b.Property<int>("Id_StatusOptico")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_StatusOptico"));

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_StatusOptico");

                    b.ToTable("StatusOpticos");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Tecnico", b =>
                {
                    b.Property<int>("Id_Tecnico")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Id_Cargo")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Empresa")
                        .HasColumnType("int");

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SobreNome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Tecnico");

                    b.HasIndex("Id_Empresa")
                        .IsUnique()
                        .HasFilter("[Id_Empresa] IS NOT NULL");

                    b.ToTable("Tecnicos");
                });

            modelBuilder.Entity("WebApiSwagger.Models.TesteOptico", b =>
                {
                    b.Property<int>("Id_TesteOptico")
                        .HasColumnType("int");

                    b.Property<string>("BobinaLancamento")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("BobinaRecepcao")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Capacidade")
                        .HasColumnType("int");

                    b.Property<DateTime?>("DataConstrucao")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataRecebimento")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("DataTeste")
                        .HasColumnType("datetime2");

                    b.Property<string>("EquipeConstrucao")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EstadoCampo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Id_EnderecoTotal")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Tecnico")
                        .HasColumnType("int");

                    b.Property<string>("PosicaoIcxDgo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("QuantidadeTeste")
                        .HasColumnType("int");

                    b.Property<string>("TipoObra")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_TesteOptico");

                    b.HasIndex("Id_Tecnico");

                    b.ToTable("TestesOpticos");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Usuario", b =>
                {
                    b.Property<int>("Id_Usuario")
                        .HasColumnType("int");

                    b.Property<int?>("Id_Tecnico")
                        .HasColumnType("int");

                    b.Property<string>("Login")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Publico")
                        .HasColumnType("int");

                    b.Property<string>("Senha")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Tipo")
                        .HasColumnType("int");

                    b.HasKey("Id_Usuario");

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Validacao", b =>
                {
                    b.Property<int>("Id_Validacao")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id_Validacao"));

                    b.Property<string>("Nome")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id_Validacao");

                    b.ToTable("Validacoes");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Analise", b =>
                {
                    b.HasOne("WebApiSwagger.Models.StatusAnalise", "GetStatusAnalise")
                        .WithMany()
                        .HasForeignKey("Id_StatusAnalise");

                    b.HasOne("WebApiSwagger.Models.StatusOptico", "GetStatusOptico")
                        .WithMany()
                        .HasForeignKey("Id_StatusOptico");

                    b.HasOne("WebApiSwagger.Models.Tecnico", "GetTecnico")
                        .WithMany()
                        .HasForeignKey("Id_Tecnico");

                    b.HasOne("WebApiSwagger.Models.TesteOptico", "GetTesteOptico")
                        .WithMany("Analises")
                        .HasForeignKey("Id_TesteOptico");

                    b.HasOne("WebApiSwagger.Models.Validacao", "GetValidacao")
                        .WithMany()
                        .HasForeignKey("Id_Validacao");

                    b.Navigation("GetStatusAnalise");

                    b.Navigation("GetStatusOptico");

                    b.Navigation("GetTecnico");

                    b.Navigation("GetTesteOptico");

                    b.Navigation("GetValidacao");
                });

            modelBuilder.Entity("WebApiSwagger.Models.EnderecoTotal", b =>
                {
                    b.HasOne("WebApiSwagger.Models.Ligacao", "GetLigacao")
                        .WithOne()
                        .HasForeignKey("WebApiSwagger.Models.EnderecoTotal", "Id_EnderecoTotal")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApiSwagger.Models.Material", "GetMaterial")
                        .WithMany()
                        .HasForeignKey("Id_Material");

                    b.Navigation("GetLigacao");

                    b.Navigation("GetMaterial");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Tecnico", b =>
                {
                    b.HasOne("WebApiSwagger.Models.Empresa", "GetEmpresa")
                        .WithOne()
                        .HasForeignKey("WebApiSwagger.Models.Tecnico", "Id_Empresa");

                    b.HasOne("WebApiSwagger.Models.Cargo", "GetCargo")
                        .WithOne()
                        .HasForeignKey("WebApiSwagger.Models.Tecnico", "Id_Tecnico")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GetCargo");

                    b.Navigation("GetEmpresa");
                });

            modelBuilder.Entity("WebApiSwagger.Models.TesteOptico", b =>
                {
                    b.HasOne("WebApiSwagger.Models.Tecnico", "GetTecnico")
                        .WithMany()
                        .HasForeignKey("Id_Tecnico");

                    b.HasOne("WebApiSwagger.Models.EnderecoTotal", "GetEnderecoTotal")
                        .WithOne()
                        .HasForeignKey("WebApiSwagger.Models.TesteOptico", "Id_TesteOptico")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GetEnderecoTotal");

                    b.Navigation("GetTecnico");
                });

            modelBuilder.Entity("WebApiSwagger.Models.Usuario", b =>
                {
                    b.HasOne("WebApiSwagger.Models.Tecnico", "GetTecnico")
                        .WithOne()
                        .HasForeignKey("WebApiSwagger.Models.Usuario", "Id_Usuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GetTecnico");
                });

            modelBuilder.Entity("WebApiSwagger.Models.TesteOptico", b =>
                {
                    b.Navigation("Analises");
                });
#pragma warning restore 612, 618
        }
    }
}
