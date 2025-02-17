using Bogus;
using System.Reflection.Emit;

namespace ClientCraft.Core.Models;

public class Lead
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string AssignedUser { get; set; }
    public string Phone { get; set; }
    public LeadStatuses Status { get; set; }
    
    public static Lead CreateMock()
    {
        var faker = new Faker();
        return new Lead()
        {
            Name = faker.Name.FullName(),
            Email = faker.Internet.Email(),
            AssignedUser = faker.Name.FirstName(),
            Id = faker.Random.Int(1, 10000),
            Phone = faker.Phone.PhoneNumber(),
            Status = new LeadStatuses()
            {
                Label = "TEST",
                Color = faker.PickRandom(new List<string>() {"default", "positive", "secondary", "danger"})
            }
        };
    }
}

public class LeadStatuses
{
    public string Label { get; set; }
    public string Color { get; set; }
}
