import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  parentId: number;
}
