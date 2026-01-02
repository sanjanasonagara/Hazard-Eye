using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HazardEye.API.Migrations
{
    /// <inheritdoc />
    public partial class RefactorLocationLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AreaLocationId",
                table: "Tasks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlantLocationId",
                table: "Tasks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AreaLocationId",
                table: "Incidents",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlantLocationId",
                table: "Incidents",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AreaLocationId",
                table: "Tasks",
                column: "AreaLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_PlantLocationId",
                table: "Tasks",
                column: "PlantLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_AreaLocationId",
                table: "Incidents",
                column: "AreaLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_PlantLocationId",
                table: "Incidents",
                column: "PlantLocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Incidents_Locations_AreaLocationId",
                table: "Incidents",
                column: "AreaLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Incidents_Locations_PlantLocationId",
                table: "Incidents",
                column: "PlantLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Locations_AreaLocationId",
                table: "Tasks",
                column: "AreaLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Locations_PlantLocationId",
                table: "Tasks",
                column: "PlantLocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Incidents_Locations_AreaLocationId",
                table: "Incidents");

            migrationBuilder.DropForeignKey(
                name: "FK_Incidents_Locations_PlantLocationId",
                table: "Incidents");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Locations_AreaLocationId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Locations_PlantLocationId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_AreaLocationId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_PlantLocationId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_AreaLocationId",
                table: "Incidents");

            migrationBuilder.DropIndex(
                name: "IX_Incidents_PlantLocationId",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "AreaLocationId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "PlantLocationId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "AreaLocationId",
                table: "Incidents");

            migrationBuilder.DropColumn(
                name: "PlantLocationId",
                table: "Incidents");
        }
    }
}
