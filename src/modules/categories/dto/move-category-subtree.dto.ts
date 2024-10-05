import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MoveCategorySubtreeDto {
    @ApiProperty({ example: 1, description: 'The new parent category ID' })
    @IsNumber()
    @IsNotEmpty()
    newParentId: number;
}