using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiSwagger.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cargos",
                columns: table => new
                {
                    Id_Cargo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cargos", x => x.Id_Cargo);
                });

            migrationBuilder.CreateTable(
                name: "Empresas",
                columns: table => new
                {
                    Id_Empresa = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empresas", x => x.Id_Empresa);
                });

            migrationBuilder.CreateTable(
                name: "Ligacoes",
                columns: table => new
                {
                    Id_Ligacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Projeto = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cabo = table.Column<int>(type: "int", nullable: true),
                    Celula = table.Column<int>(type: "int", nullable: true),
                    InfraEstrutura = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ICX = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DGO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FibraDGO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CaboDGO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SplitterCEOS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OutSplitterCEOS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CaboCDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FibraCDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PortaCDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rede = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ligacoes", x => x.Id_Ligacao);
                });

            migrationBuilder.CreateTable(
                name: "Materiais",
                columns: table => new
                {
                    Id_Material = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstadoOperacional = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataEstadoOperacional = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EstadoControle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataEstadoControle = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materiais", x => x.Id_Material);
                });

            migrationBuilder.CreateTable(
                name: "StatusAnalises",
                columns: table => new
                {
                    Id_StatusAnalise = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusAnalises", x => x.Id_StatusAnalise);
                });

            migrationBuilder.CreateTable(
                name: "StatusOpticos",
                columns: table => new
                {
                    Id_StatusOptico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusOpticos", x => x.Id_StatusOptico);
                });

            migrationBuilder.CreateTable(
                name: "Validacoes",
                columns: table => new
                {
                    Id_Validacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Validacoes", x => x.Id_Validacao);
                });

            migrationBuilder.CreateTable(
                name: "Tecnicos",
                columns: table => new
                {
                    Id_Tecnico = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SobreNome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Id_Cargo = table.Column<int>(type: "int", nullable: true),
                    Id_Empresa = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tecnicos", x => x.Id_Tecnico);
                    table.ForeignKey(
                        name: "FK_Tecnicos_Cargos_Id_Tecnico",
                        column: x => x.Id_Tecnico,
                        principalTable: "Cargos",
                        principalColumn: "Id_Cargo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tecnicos_Empresas_Id_Empresa",
                        column: x => x.Id_Empresa,
                        principalTable: "Empresas",
                        principalColumn: "Id_Empresa");
                });

            migrationBuilder.CreateTable(
                name: "EnderecosTotais",
                columns: table => new
                {
                    Id_EnderecoTotal = table.Column<int>(type: "int", nullable: false),
                    Celula = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sigla = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Municipio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bairro = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Logradouro = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Numero = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CEP = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Complemento = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CDO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UMS = table.Column<int>(type: "int", nullable: true),
                    CodViabilidade = table.Column<int>(type: "int", nullable: true),
                    TipoViabilidade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TipoRede = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DispComercial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodSurvey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Id_Ligacao = table.Column<int>(type: "int", nullable: true),
                    Id_Material = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnderecosTotais", x => x.Id_EnderecoTotal);
                    table.ForeignKey(
                        name: "FK_EnderecosTotais_Ligacoes_Id_EnderecoTotal",
                        column: x => x.Id_EnderecoTotal,
                        principalTable: "Ligacoes",
                        principalColumn: "Id_Ligacao",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EnderecosTotais_Materiais_Id_Material",
                        column: x => x.Id_Material,
                        principalTable: "Materiais",
                        principalColumn: "Id_Material");
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id_Usuario = table.Column<int>(type: "int", nullable: false),
                    Login = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Senha = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tipo = table.Column<int>(type: "int", nullable: true),
                    Publico = table.Column<int>(type: "int", nullable: true),
                    Id_Tecnico = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id_Usuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Tecnicos_Id_Usuario",
                        column: x => x.Id_Usuario,
                        principalTable: "Tecnicos",
                        principalColumn: "Id_Tecnico",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TestesOpticos",
                columns: table => new
                {
                    Id_TesteOptico = table.Column<int>(type: "int", nullable: false),
                    Capacidade = table.Column<int>(type: "int", nullable: true),
                    DataTeste = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EstadoCampo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataConstrucao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataRecebimento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TipoObra = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PosicaoIcxDgo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BobinaLancamento = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BobinaRecepcao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuantidadeTeste = table.Column<int>(type: "int", nullable: true),
                    EquipeConstrucao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Id_EnderecoTotal = table.Column<int>(type: "int", nullable: true),
                    Id_Tecnico = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestesOpticos", x => x.Id_TesteOptico);
                    table.ForeignKey(
                        name: "FK_TestesOpticos_EnderecosTotais_Id_TesteOptico",
                        column: x => x.Id_TesteOptico,
                        principalTable: "EnderecosTotais",
                        principalColumn: "Id_EnderecoTotal",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestesOpticos_Tecnicos_Id_Tecnico",
                        column: x => x.Id_Tecnico,
                        principalTable: "Tecnicos",
                        principalColumn: "Id_Tecnico");
                });

            migrationBuilder.CreateTable(
                name: "Analises",
                columns: table => new
                {
                    Id_Analise = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataAnalise = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Observacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CDOIA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusCDOIA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ObservacaoCDOIA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Id_Tecnico = table.Column<int>(type: "int", nullable: true),
                    Id_TesteOptico = table.Column<int>(type: "int", nullable: true),
                    Id_StatusOptico = table.Column<int>(type: "int", nullable: true),
                    Id_StatusAnalise = table.Column<int>(type: "int", nullable: true),
                    Id_Validacao = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analises", x => x.Id_Analise);
                    table.ForeignKey(
                        name: "FK_Analises_StatusAnalises_Id_StatusAnalise",
                        column: x => x.Id_StatusAnalise,
                        principalTable: "StatusAnalises",
                        principalColumn: "Id_StatusAnalise");
                    table.ForeignKey(
                        name: "FK_Analises_StatusOpticos_Id_StatusOptico",
                        column: x => x.Id_StatusOptico,
                        principalTable: "StatusOpticos",
                        principalColumn: "Id_StatusOptico");
                    table.ForeignKey(
                        name: "FK_Analises_Tecnicos_Id_Tecnico",
                        column: x => x.Id_Tecnico,
                        principalTable: "Tecnicos",
                        principalColumn: "Id_Tecnico");
                    table.ForeignKey(
                        name: "FK_Analises_TestesOpticos_Id_TesteOptico",
                        column: x => x.Id_TesteOptico,
                        principalTable: "TestesOpticos",
                        principalColumn: "Id_TesteOptico");
                    table.ForeignKey(
                        name: "FK_Analises_Validacoes_Id_Validacao",
                        column: x => x.Id_Validacao,
                        principalTable: "Validacoes",
                        principalColumn: "Id_Validacao");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Analises_Id_StatusAnalise",
                table: "Analises",
                column: "Id_StatusAnalise");

            migrationBuilder.CreateIndex(
                name: "IX_Analises_Id_StatusOptico",
                table: "Analises",
                column: "Id_StatusOptico");

            migrationBuilder.CreateIndex(
                name: "IX_Analises_Id_Tecnico",
                table: "Analises",
                column: "Id_Tecnico");

            migrationBuilder.CreateIndex(
                name: "IX_Analises_Id_TesteOptico",
                table: "Analises",
                column: "Id_TesteOptico");

            migrationBuilder.CreateIndex(
                name: "IX_Analises_Id_Validacao",
                table: "Analises",
                column: "Id_Validacao");

            migrationBuilder.CreateIndex(
                name: "IX_EnderecosTotais_Id_Material",
                table: "EnderecosTotais",
                column: "Id_Material");

            migrationBuilder.CreateIndex(
                name: "IX_Tecnicos_Id_Empresa",
                table: "Tecnicos",
                column: "Id_Empresa",
                unique: true,
                filter: "[Id_Empresa] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TestesOpticos_Id_Tecnico",
                table: "TestesOpticos",
                column: "Id_Tecnico");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Analises");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "StatusAnalises");

            migrationBuilder.DropTable(
                name: "StatusOpticos");

            migrationBuilder.DropTable(
                name: "TestesOpticos");

            migrationBuilder.DropTable(
                name: "Validacoes");

            migrationBuilder.DropTable(
                name: "EnderecosTotais");

            migrationBuilder.DropTable(
                name: "Tecnicos");

            migrationBuilder.DropTable(
                name: "Ligacoes");

            migrationBuilder.DropTable(
                name: "Materiais");

            migrationBuilder.DropTable(
                name: "Cargos");

            migrationBuilder.DropTable(
                name: "Empresas");
        }
    }
}
