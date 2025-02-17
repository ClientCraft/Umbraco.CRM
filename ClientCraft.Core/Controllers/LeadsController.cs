using Asp.Versioning;
using ClientCraft.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

namespace ClientCraft.Core.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Leads")]
public class LeadsController : ClientCraftCrmControllerBase
{
    // Retrieve all contacts
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Lead>), 200)]
    public ActionResult<TableResource<Lead>> GetLeads()
    {
        var response = new TableResource<Lead>();

        // Logic to retrieve all contacts, e.g., from a repository
        var items = new List<Lead>
        {
            Lead.CreateMock(),
            Lead.CreateMock(),
            Lead.CreateMock(),
            Lead.CreateMock(),
            Lead.CreateMock()
        };

        response.Items = items;

        var columns = new List<Column>
        {
            new() { Name = "Name", Sortable = true },
            new() { Name = "Email", Sortable = true },
            new() { Name = "Phone", Sortable = true },
            new() { Name = "Assigned User", Sortable = true },
            new() { Name = "Status", Sortable = true },
        };

        response.Columns = columns;
        return Ok(response); // Corrected usage of Ok() to return the list of contacts
    }

    // Retrieve a specific contact
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Lead), 200)]
    [ProducesResponseType(404)]
    public ActionResult<Lead> GetLead(int id)
    {
        // Logic to retrieve a specific contact by ID
        var contact = new Lead { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
        if (contact == null) return NotFound();
        return Ok(contact);
    }

    // Create a new contact
    [HttpPost]
    [ProducesResponseType(typeof(Lead), 201)]
    [ProducesResponseType(400)]
    public ActionResult<Lead> CreateLead([FromBody] Lead contact)
    {
        // Logic to create a new contact
        var createdLead = new Lead { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
        return CreatedAtAction(nameof(GetLead), new { id = createdLead.Id }, createdLead);
    }

    // Update a specific contact
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Lead), 200)]
    [ProducesResponseType(404)]
    public ActionResult<Lead> UpdateLead(int id, [FromBody] Lead contact)
    {
        // Logic to update a specific contact by ID
        var existingLead = new Lead { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
        if (existingLead == null) return NotFound();
        // Update logic
        return Ok(existingLead);
    }

    // Partially update a contact
    [HttpPatch("{id}")]
    [ProducesResponseType(typeof(Lead), 200)]
    [ProducesResponseType(404)]
    public ActionResult<Lead> PartiallyUpdateLead(int id, [FromBody] JsonPatchDocument<Lead> patch)
    {
        // Logic for partial update of a contact
        var existingLead = new Lead { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
        if (existingLead == null) return NotFound();
        patch.ApplyTo(existingLead);
        return Ok(existingLead);
    }

    // Delete a specific contact
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public IActionResult DeleteLead(int id)
    {
        // Logic to delete a contact by ID
        var existingLead = new Lead { Id = 1, Name = "John Doe", Email = "john.doe@example.com" };
        if (existingLead == null) return NotFound();
        // Delete logic
        return NoContent();
    }
}
