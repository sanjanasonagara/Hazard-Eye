using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HazardEye.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentsToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "Tasks",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comments",
                table: "Tasks");
        }
    }
}
