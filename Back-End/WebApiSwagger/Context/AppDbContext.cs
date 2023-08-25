using WebApiSwagger.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApiSwagger.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            //Database.SetCommandTimeout(1800);
        }

        public DbSet<Cargo> Cargos => Set<Cargo>();
        public DbSet<Analise> Analises => Set<Analise>();
        public DbSet<Empresa> Empresas => Set<Empresa>();
        public DbSet<EnderecoTotal> EnderecosTotais => Set<EnderecoTotal>();
        public DbSet<Ligacao> Ligacoes => Set<Ligacao>();
        public DbSet<Tecnico> Tecnicos => Set<Tecnico>();
        public DbSet<TesteOptico> TestesOpticos => Set<TesteOptico>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Validacao> Validacoes => Set<Validacao>();

        public override int SaveChanges()
        {
            // converte todas as propriedades de string em caixa alta antes de salvar
            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                foreach (var property in entry.CurrentValues.Properties.Where(p => p.ClrType == typeof(string)))
                {
                    var currentValue = (string?)entry.CurrentValues[property];
                    if (!string.IsNullOrEmpty(currentValue))
                    {
                        entry.CurrentValues[property] = currentValue.ToUpperInvariant();
                    }
                }
            }

            return base.SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<EnderecoTotal>()
                 .HasOne(p => p.GetLigacao)
                 .WithOne()
                 .HasForeignKey<EnderecoTotal>(p => p.Id_EnderecoTotal);

             modelBuilder.Entity<TesteOptico>()
                .HasOne(c => c.GetTecnico)
                .WithMany()
                .HasForeignKey(c => c.Id_Tecnico);

            modelBuilder.Entity<Analise>()
                .HasOne(c => c.GetTesteOptico)
                .WithMany(c => c.Analises)
                .HasForeignKey(c => c.Id_TesteOptico);

            modelBuilder.Entity<Analise>()
                .HasOne(c => c.GetTecnico)
                .WithMany()
                .HasForeignKey(c => c.Id_Tecnico);

            modelBuilder.Entity<Analise>()
                .HasOne(c => c.GetValidacao)
                .WithMany()
                .HasForeignKey(c => c.Id_Validacao);                                    

            modelBuilder.Entity<Usuario>()
                 .HasOne(p => p.GetTecnico)
                 .WithOne()
                 .HasForeignKey<Usuario>(p => p.Id_Usuario);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetCargo)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Tecnico);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetEmpresa)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Empresa); 

            modelBuilder.Entity<EnderecoTotal>()
                .Property(e => e.Latitude)
                .HasColumnType("decimal(9, 6)"); 

            modelBuilder.Entity<EnderecoTotal>()
                .Property(e => e.Longitude)
                .HasColumnType("decimal(9, 6)");              

            base.OnModelCreating(modelBuilder);
        }
    }
}
