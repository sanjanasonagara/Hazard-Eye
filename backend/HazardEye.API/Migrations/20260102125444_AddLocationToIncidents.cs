using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HazardEye.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationToIncidents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Incidents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Plant",
                table: "Incidents",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Area",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "Plant",
                table: "Incidents");
        }
    }
}
