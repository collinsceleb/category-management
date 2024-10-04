import { IsNotEmpty, IsNumber } from "class-validator";

export class MoveCategorySubtreeDto {
    @IsNumber()
    @IsNotEmpty()
    newParentId: number;
}