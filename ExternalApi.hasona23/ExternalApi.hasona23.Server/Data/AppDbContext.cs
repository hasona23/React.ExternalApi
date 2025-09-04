using System.Drawing;
using ExternalApi.hasona23.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ExternalApi.hasona23.Server.Data;

public class AppDbContext:DbContext
{
    
    public DbSet<ClothesItem> Clothes { get; set; }
    
    public AppDbContext(DbContextOptions options) : base( options)
    { }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<ClothesItem>().Property(c => c.Color).HasConversion(c => c.ToArgb(),c => Color.FromArgb(c));

        modelBuilder.Entity<ClothesItem>().HasData(
                new ClothesItem()
                {
                    Name = "Chemise",
                    Price = 100,
                    Color = Color.Black,
                    Size = "L",
                    Fit = "Slim",
                    ImagePath = "chemise.jpeg"
                },
                new ClothesItem()
                {
                    Name = "Shirt",
                    Price = 120,
                    Color = Color.Red,
                    Size = "M",
                    Fit = "Regular",
                    ImagePath = "shirt.jpeg"
                },
                new ClothesItem()
                {
                    Name = "Hoodie",
                    Price = 100,
                    Color = Color.Black,
                    Size = "L",
                    Fit = "Regular",
                    ImagePath = "hoodie.jpeg"
                },
                new ClothesItem()
                {
                    Name = "Shoes",
                    Price = 70,
                    Color = Color.Black,
                    Size = "42",
                    Fit = "Regular",
                    ImagePath = "shoes.jpeg"
                },
                new ClothesItem()
                {
                    Name = "Pullover",
                    Price = 100,
                    Color = Color.Blue,
                    Size = "L",
                    Fit = "Slim",
                    ImagePath = "pullover.jpeg"
                }
            );
    }
}