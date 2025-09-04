using System.Drawing;

namespace ExternalApi.hasona23.Server.Models;

public class ClothesItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Size { get; set; }
    public string Fit { get; set; }
    public Color Color { get; set; }
    public float Price { get; set; }
    public string ImagePath { get; set; }
    public string ImageUrl => $"Images/{ImagePath}";
}