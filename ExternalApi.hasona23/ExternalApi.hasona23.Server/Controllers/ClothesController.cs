using ExternalApi.hasona23.Server.Data;
using ExternalApi.hasona23.Server.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ExternalApi.hasona23.Server.Controllers;

[Controller]
[Route("/clothes")]
public class ClothesController(AppDbContext dbContext):ControllerBase
{
    [HttpGet]
    public IActionResult GetAllClothes()
    {
        return Ok(dbContext.Clothes.Select(c => new ClothesItemDto(c.Id,c.Name,c.Price,c.ImageUrl)).ToList());
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetClothes(Guid id)
    {
        return Ok(dbContext.Clothes.FirstOrDefault(c => c.Id == id));
    }
}